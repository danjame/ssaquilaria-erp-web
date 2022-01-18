import { App } from 'vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'

export default {
  install (app: App) {
    app.use(ElementPlus, { size: 'medium', zIndex: 3000, locale: zhCn })
  }
}