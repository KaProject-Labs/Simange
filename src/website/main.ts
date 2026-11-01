import { createApp } from 'vue';
import { createPinia } from 'pinia';
import WebsiteApp from './WebsiteApp.vue';
import '../assets/style.css';

const app = createApp(WebsiteApp);
app.use(createPinia());
app.mount('#app');
