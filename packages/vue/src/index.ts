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
import { Switch } from './components/switch';
import { Checkbox } from './components/checkbox';
import { Tag } from './components/tag';
import { Alert } from './components/alert';
import { RadioGroup } from './components/radio-group';
import { Radio } from './components/radio';
import { Progress } from './components/progress';
import { Badge } from './components/badge';
import { Avatar } from './components/avatar';
import { Empty } from './components/empty';
import { Select } from './components/select';
import { Tabs } from './components/tabs';
import { message } from './components/message';
import { Tooltip } from './components/tooltip';
import { Pagination } from './components/pagination';
import { DatePicker } from './components/date-picker';
import { Table } from './components/table';
import { Spin } from './components/spin';
import { Breadcrumb } from './components/breadcrumb';
import { Skeleton } from './components/skeleton';
import { InputNumber } from './components/input-number';
import { Popconfirm } from './components/popconfirm';
import { Modal } from './components/modal';

export { Switch, Checkbox, Tag, Alert };
export { RadioGroup };
export { Radio };
export { Progress };
export { Badge };
export { Avatar };
export { Empty };
export { Select };
export { Tabs };
export { message };
export { Tooltip };
export { Pagination };
export { DatePicker };
export { Table };
export { Spin };
export { Breadcrumb };
export { Skeleton };
export { InputNumber };
export { Popconfirm };
export { Button, Input, Modal };

// 基础设施：主题运行时 API / 插件系统 / 虚拟滚动原语（re-export 自 @xui/shared）
export {
  clearThemeTokens,
  getTheme,
  setTheme,
  setThemeTokens,
  subscribeTheme,
  toggleTheme,
} from '@xui/shared';
export { applyPlugins } from '@xui/shared';
export { createVirtualListLogic } from '@xui/shared';
export type { XuiTheme } from '@xui/shared';
export type { XuiPlugin, PluginInstallContext } from '@xui/shared';
export type { VirtualListLogicInstance, VirtualListOptions, VirtualListState } from '@xui/shared';

// 基础设施：国际化运行时 API（re-export 自 @xui/shared）
export {
  DEFAULT_LOCALE,
  getLocale,
  getLocaleData,
  registerLocale,
  setLocale,
  subscribeLocale,
} from '@xui/shared';
export { useLocaleData } from './hooks/use-locale';
export type { LocaleListener, XuiLocaleData, XuiLocaleInput } from '@xui/shared';

export const VUE_VERSION = '0.0.0';

export default {
  install(app: App) {
    app.component(Button.name ?? 'Button', Button);
    app.component(Input.name ?? 'Input', Input);
    app.component(Switch.name ?? 'Switch', Switch);
    app.component(Checkbox.name ?? 'Checkbox', Checkbox);
    app.component(Tag.name ?? 'Tag', Tag);
    app.component(Alert.name ?? 'Alert', Alert);
    app.component(RadioGroup.name ?? 'RadioGroup', RadioGroup);
    app.component(Radio.name ?? 'Radio', Radio);
    app.component(Progress.name ?? 'Progress', Progress);
    app.component(Badge.name ?? 'Badge', Badge);
    app.component(Avatar.name ?? 'Avatar', Avatar);
    app.component(Empty.name ?? 'Empty', Empty);
    app.component(Select.name ?? 'Select', Select);
    app.component(Tabs.name ?? 'Tabs', Tabs);
    app.component(Tooltip.name ?? 'Tooltip', Tooltip);
    app.component(Pagination.name ?? 'Pagination', Pagination);
    app.component(DatePicker.name ?? 'DatePicker', DatePicker);
    app.component(Table.name ?? 'Table', Table);
    app.component(Spin.name ?? 'Spin', Spin);
    app.component(Breadcrumb.name ?? 'Breadcrumb', Breadcrumb);
    app.component(Skeleton.name ?? 'Skeleton', Skeleton);
    app.component(InputNumber.name ?? 'InputNumber', InputNumber);
    app.component(Popconfirm.name ?? 'Popconfirm', Popconfirm);
    app.component(Modal.name ?? 'Modal', Modal);
  },
};
