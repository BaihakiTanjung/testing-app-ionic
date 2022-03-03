import { Geolocation } from "@capacitor/geolocation";
import { ref,onMounted } from "vue"

export function useGeolocation() {
  // const geolocation = Geolocation.use();

  const location = ref<any>({});

  const currentLocation = async () => {
    // get the users current position
    const position = await Geolocation.getCurrentPosition();

    // grab latitude & longitude
    location.value = position.coords;
  };

  onMounted(currentLocation)

  return {
    location
  }
}
