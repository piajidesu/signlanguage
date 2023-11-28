import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus' //全局引入
import 'element-plus/dist/index.css'
import router from "./router/index";
import store from "./store/index";

router.beforeEach((to, from, next) => {
	store.commit("change_bgc_url", to.path === "/home");
	next();
});

createApp(App).use(router).use(store).use(ElementPlus).mount("#app");
