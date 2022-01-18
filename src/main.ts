import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from './plugins/element-plus'

import './styles/index.scss'

createApp(App)
  .use(store)
  .use(router)
  .use(ElementPlus)
  .mount('#app')