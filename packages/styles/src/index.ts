// @xui-design/styles 入口：唯一职责是把全部样式（reset + tokens + components）作为副作用引入。
// 消费方 `import '@xui-design/styles'` 即生效全部样式；JS 产物中对 index.css 的引用由
// vite.config.ts 的 xui-styles-inject-css-import 插件在构建后注入（Vite lib 模式抽取 CSS 后不回写引用）。
import './index.scss';
