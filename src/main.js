import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import 'bootstrap/dist/css/bootstrap.min.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'
createApp(App).use(router).use(VueChartkick).mount('#app')