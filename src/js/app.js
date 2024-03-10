import { createApp } from "vue";
import { pinia } from "./plugins/store";
import vuetify from "./plugins/vuetify";

import App from "./components/App.vue";

const app = createApp(App);
app.use(vuetify).use(pinia).mount("#nandroplanner");
