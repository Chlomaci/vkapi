import App from './App.vue'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import store, {key} from '@/store';
import { loadVKAPI, initVKAPI, callVKAPI } from "@/api.js";

loadVKAPI().then(function() {
  return initVKAPI(51795832);
}).then(function() {
  return callVKAPI('friends.get', {});
}).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.error("Ошибка при выполнении VK API:", error);
});


const app = createApp(App)
registerPlugins(app)
app.use(store).mount('#app')
