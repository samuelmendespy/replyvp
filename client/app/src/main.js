import { createApp } from 'vue';
import App from './App.vue';
import Toast from 'vue-toastification';
import "vue-toastification/dist/index.css";
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

createApp(App).use(router).use(Toast).mount('#app');