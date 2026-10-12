import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from './pages/HomePage.vue';
import ThemePage from './pages/ThemePage.vue';
import ComponentPage from './pages/ComponentPage.vue';

export const router = createRouter({
  // hash 历史：静态产物任意路径 / file:// 打开均可工作，无需服务端 fallback
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/theme', name: 'theme', component: ThemePage },
    { path: '/components/:slug', name: 'component', component: ComponentPage },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});
