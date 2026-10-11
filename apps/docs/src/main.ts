import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
// 组件库样式（BEM + CSS 变量单一来源），demo 实时预览依赖
import '@xui/styles';
// 文档站自身样式
import './styles/docs.scss';

createApp(App).use(router).mount('#app');
