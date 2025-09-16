import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import "./_global.css";
import "./shared/styles/loader.css";

const app = createApp(App);
app.use(router);
app.mount('#app')
