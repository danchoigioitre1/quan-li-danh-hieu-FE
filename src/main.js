import { createApp } from "vue";
import App from "./App.vue";
import emitter from "tiny-emitter/instance";
import router from "./router";
import EmulationEnum from "./js/enum/emulationEnum";
import { BASEURL } from "./js/service/api";
import EmulationResources from "./js/resource/EmulationResource";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
const vuetify = createVuetify({
  components,
  directives,
});

export const app = createApp(App);
app.config.globalProperties.$EmulationEnum = EmulationEnum;
app.config.globalProperties.$BASEURL = BASEURL;
app.config.globalProperties.$EmulationResources = EmulationResources;
app.config.globalProperties.$emitter = emitter;
app.use(router);
app.use(vuetify);
app.mount("#app");
