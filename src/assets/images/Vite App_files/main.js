import { createApp } from '/node_modules/.vite/deps/vue.js?v=46de4ef1'
import App from '/src/App.vue'
import router from '/src/router/index.js?t=1680255929278'
import '/node_modules/bootstrap/dist/css/bootstrap.min.css';

import '/node_modules/bootstrap/dist/css/bootstrap.min.css';
import '/src/custom.css';

createApp(App).use(router).mount('#app')