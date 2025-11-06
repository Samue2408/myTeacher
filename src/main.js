import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/authStore';

import "./_global.css";
import "./shared/styles/loader.css";
import "./shared/styles/skeleton.css";


const app = createApp(App);
app.use(router);
app.use(createPinia())

const authStore = useAuthStore();
await authStore.restoreSession(); // ✅ Restaura sesión si hay token

app.mount('#app')
