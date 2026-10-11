/**
 * @xui/vue - Vue 3 适配层
 *
 * 将 @xui/shared 核心逻辑桥接到 Vue 响应式系统。
 * 使用 <script setup> + reactive props destructure + defineModel + watchEffect 连接核心层状态。
 *
 * 样式由 @xui/styles 统一提供（组件样式单一来源），导入 '@xui/styles' 即可获得全部样式。
 */

import type { App } from 'vue';
import { Button } from './components/button';
import { Input } from './components/input';
import { Modal } from './components/modal';

export { Button, Input, Modal };

export const VUE_VERSION = '0.0.0';

export default {
  install(app: App) {
    app.component(Button.name ?? 'Button', Button);
    app.component(Input.name ?? 'Input', Input);
    app.component(Modal.name ?? 'Modal', Modal);
  },
};
