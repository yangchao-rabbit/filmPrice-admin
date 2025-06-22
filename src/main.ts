import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import './style/index.scss'
import 'element-plus/theme-chalk/dark/css-vars.css'
import pinia from './stores'
import router from './route'

const app = createApp(App)

app.use(router)
app.use(pinia)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus)
app.mount('#app')