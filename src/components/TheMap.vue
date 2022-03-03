<template>
  <div style="height: 75vh">
    <l-map
      v-model="zoom"
      v-model:zoom="zoom"
      :center="center"
      @move="log('move')"
    >
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      ></l-tile-layer>

      <l-marker :lat-lng="center" @moveend="log('moveend')">
        <l-popup> lol </l-popup>
      </l-marker>
    </l-map>
    <!-- <button @click="changeIcon">New kitten icon</button> -->
  </div>
</template>
<script >
import {
  LMap,
  LTileLayer,
  LMarker,
  LControlLayers,
  LTooltip,
  LPopup,
} from "@vue-leaflet/vue-leaflet";
import "leaflet/dist/leaflet.css";
export default {
  components: {
    LMap,
    // LIcon,
    LTileLayer,
    LMarker,
    // LControlLayers,
    // LTooltip,
    LPopup,
    // LPolyline,
    // LPolygon,
    // LRectangle,
  },
  props: {
    // zoom: {
    //   type: Number,
    //   default: 12,
    // },
    center: {
      type: Object,
      default: () => ({
        lat: 47.41322,
        lng: -1.219482,
      }),
    },
  },
  data() {
    return {
      zoom: 16,
      iconWidth: 25,
      iconHeight: 40,
    };
  },
  computed: {},
  methods: {
    log(a) {
      console.log(a);
    },
  },
};
</script>