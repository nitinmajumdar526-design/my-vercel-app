import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import "@google/model-viewer";
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);

app.use(router);

app.use(vue3GoogleLogin, {
  clientId: "566971903390-1c0662n1bc3f6f3ur4t010a11se19ee3.apps.googleusercontent.com"
});

app.mount("#app");