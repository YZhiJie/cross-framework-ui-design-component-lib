import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { initDocsLocale } from './i18n';
import { initDocsTheme } from './theme';
// 组件库样式（BEM + CSS 变量单一来源），demo 实时预览依赖
import '@xui-design/styles';
// 文档站自身样式
import './styles/docs.scss';

// 先恢复语言 / 主题（读 localStorage、写 <html lang> 与 data-theme），再挂载应用
initDocsLocale();
initDocsTheme();

createApp(App).use(router).mount('#app');
