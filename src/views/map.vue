<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Maps</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row>
          <ion-col>
            <TheMap
              v-if="
                location.latitude !== undefined &&
                location.longitude !== undefined
              "
              :zoom="12"
              :center="{
                lat: Number(location.latitude),
                lng: Number(location.longitude),
              }"
            ></TheMap>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  onIonViewWillEnter,
  onIonViewDidEnter,
  onIonViewWillLeave,
  onIonViewDidLeave,
} from "@ionic/vue";
// import ExploreContainer from "@/components/ExploreContainer.vue";
import { useGeolocation } from "@/composables/useGeolocation";
import TheMap from "@/components/TheMap.vue";

export default defineComponent({
  name: "Tab1Page",
  components: {
    // ExploreContainer,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    TheMap,
  },
  setup() {
    const { location } = useGeolocation();

    console.log(location);

    onIonViewDidEnter(() => {
      console.log("Home page did enter");
    });

    onIonViewDidLeave(() => {
      console.log("Home page did leave");
    });

    onIonViewWillEnter(() => {
      console.log("Home page will enter");
    });

    onIonViewWillLeave(() => {
      console.log("Home page will leave");
    });

    return {
      location,
    };
  },
});
</script>
