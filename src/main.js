import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

// 配置axios
axios.defaults.baseURL = '/api'
app.config.globalProperties.$http = axios

app.use(ElementPlus)
app.use(router)
app.mount('#app')
