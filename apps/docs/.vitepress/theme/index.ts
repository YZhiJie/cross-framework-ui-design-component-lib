/**
 * XUI 文档站自定义主题
 *
 * - extends 默认主题：保留侧边栏 / 目录 / 搜索 / 上一页下一页 / 移动端导航全部能力
 * - 覆盖全局 Content 组件实现页面切换过渡（VP 在 enhanceApp 之前注册 Content，此处覆盖生效）
 * - 注册 md 页面直接使用的全局组件：ComponentDemo / ComponentApi / GuideDemo / GuideApi / ComponentOverview
 * - 全局样式：组件库 tokens（demo 实时预览依赖）+ 文档站自定义样式
 */
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';

import XuiLayout from './Layout.vue';
import PageContent from './components/PageContent.vue';
import ComponentDemo from './components/ComponentDemo.vue';
import ComponentApi from './components/ComponentApi.vue';
import GuideDemo from './components/GuideDemo.vue';
import GuideApi from './components/GuideApi.vue';
import ComponentOverview from './components/ComponentOverview.vue';

// 组件库样式（BEM + CSS 变量单一来源），demo 实时预览依赖
import '@xui-design/styles';
// 文档站自身样式（VP 变量品牌化覆盖 + 移植的组件样式）
import './styles/custom.css';

export default {
  extends: DefaultTheme,
  Layout: () => h(XuiLayout),
  enhanceApp({ app }) {
    // 页面内容过渡：Content 以 relativePath 为 key，路由切换时触发过渡
    // VP 在 enhanceApp 之前已注册默认 Content，先注销避免 Vue 重复注册警告
    delete (app._context.components as Record<string, unknown>).Content;
    app.component('Content', PageContent);
    // md 页面直接使用的组件（kebab-case / PascalCase 均可解析）
    app.component('ComponentDemo', ComponentDemo);
    app.component('ComponentApi', ComponentApi);
    app.component('GuideDemo', GuideDemo);
    app.component('GuideApi', GuideApi);
    app.component('ComponentOverview', ComponentOverview);
  },
} satisfies Theme;
