import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Optionnel si on utilisait Pinia, mais ici on garde notre store simple
import App from './App.vue';
import router from './router'; // Import du routeur
import './style.css';

const app = createApp(App);

app.use(router); // Activation du routeur

app.mount('#app');