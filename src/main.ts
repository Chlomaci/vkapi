import App from './App.vue'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import store, {key} from '@/store';
import { loadVKAPI, initVKAPI } from "@/api.js";


const app = createApp(App)
registerPlugins(app)

loadVKAPI().then(() => {
  initVKAPI(51795832)
  app.use(store).mount('#app')
});

