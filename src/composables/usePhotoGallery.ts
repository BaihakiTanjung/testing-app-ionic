import { ref, onMounted, watch } from "vue";
import { Capacitor } from "@capacitor/core";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Storage } from "@capacitor/storage";
import { isPlatform } from "@ionic/vue";
import { actionSheetController } from "@ionic/vue";
import { trash, close } from "ionicons/icons";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export function usePhotoGallery() {
  const photos = ref<UserPhoto[]>([]);
  const PHOTO_STORAGE = "photos";

  const cachePhotos = () => {
    Storage.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });
  };

  const deletePhoto = async (photo: UserPhoto) => {
    // Remove this photo from the Photos reference data array
    photos.value = photos.value.filter((p) => p.filepath !== photo.filepath);

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf("/") + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data,
    });
  };

  const showActionSheet = async (photo: UserPhoto) => {
    const actionSheet = await actionSheetController.create({
      header: "Photos",
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          icon: trash,
          handler: () => {
            deletePhoto(photo);
          },
        },
        {
          text: "Cancel",
          icon: close,
          role: "cancel",
          handler: () => {
            // Nothing to do, action sheet is automatically closed
          },
        },
      ],
    });
    await actionSheet.present();
  };

  watch(photos, cachePhotos);

  const loadSaved = async () => {
    const photoList = await Storage.get({ key: PHOTO_STORAGE });
    const photosInStorage = photoList.value ? JSON.parse(photoList.value) : [];

    // If running on the web...
    if (!isPlatform("hybrid")) {
      for (const photo of photosInStorage) {
        const file = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data,
        });
        // Web platform only: Load the photo as base64 data
        photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
      }
    }

    photos.value = photosInStorage;
  };

  onMounted(loadSaved);

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = new Date().getTime() + ".jpeg";
    const savedFileImage = await savePicture(photo, fileName);

    photos.value = [savedFileImage, ...photos.value];
  };

  const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });

  const savePicture = async (
    photo: Photo,
    fileName: string
  ): Promise<UserPhoto> => {
    let base64Data: string;
    // "hybrid" will detect mobile - iOS or Android
    if (isPlatform("hybrid")) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = (await convertBlobToBase64(blob)) as string;
    }
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    if (isPlatform("hybrid")) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    }
  };

  return {
    photos,
    takePhoto,
    deletePhoto,
    showActionSheet
  };
}
