/**
 * @xui-design/vue - Vue 3 适配层
 *
 * 将 @xui-design/shared 核心逻辑桥接到 Vue 响应式系统。
 * 使用 <script setup> + reactive props destructure + defineModel + watchEffect 连接核心层状态。
 *
 * 样式由 @xui-design/styles 统一提供（组件样式单一来源），导入 '@xui-design/styles' 即可获得全部样式。
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
import { Tree } from './components/tree';
import { Drawer } from './components/drawer';
import { Dropdown } from './components/dropdown';
import { TreeSelect } from './components/tree-select';
import { Steps } from './components/steps';
import { Carousel } from './components/carousel';
import { Modal } from './components/modal';
import { Form, FormItem } from './components/form';
import { TimePicker } from './components/time-picker';
import { Cascader } from './components/cascader';
import { Upload } from './components/upload';
import { TimeSlotPicker } from './components/time-slot-picker';

export { Switch, Checkbox, Tag, Alert };
export type { SwitchProps, SwitchRef } from './components/switch';
export type { CheckboxProps, CheckboxRef } from './components/checkbox';
export type { TagProps } from './components/tag';
export type { AlertProps } from './components/alert';

export { RadioGroup };
export type { RadioGroupProps } from './components/radio-group';
export { Radio };
export type { RadioProps } from './components/radio';
export { Progress };
export type { ProgressProps } from './components/progress';
export { Badge };
export type { BadgeProps } from './components/badge';
export { Avatar };
export type { AvatarProps } from './components/avatar';
export { Empty };
export type { EmptyProps } from './components/empty';
export { Select };
export type { SelectProps, SelectRef } from './components/select';
export { Tabs };
export type { TabsProps } from './components/tabs';
export { message };
export { Tooltip };
export type { TooltipProps, TooltipRef } from './components/tooltip';
export { Pagination };
export type { PaginationProps } from './components/pagination';
export { DatePicker };
export type { DatePickerProps, DatePickerRef } from './components/date-picker';
export { Table };
export type { TableProps } from './components/table';
export { Spin };
export type { SpinProps } from './components/spin';
export { Breadcrumb };
export type { BreadcrumbProps } from './components/breadcrumb';
export { Skeleton };
export type { SkeletonProps } from './components/skeleton';
export { InputNumber };
export type { InputNumberProps, InputNumberRef } from './components/input-number';
export { Popconfirm };
export type { PopconfirmProps, PopconfirmRef } from './components/popconfirm';
export { Tree };
export { Drawer };
export type { DrawerPlacement, DrawerProps, DrawerRef } from './components/drawer';
export { Dropdown };
export { TreeSelect };
export type { TreeSelectProps, TreeSelectRef } from './components/tree-select';
export { Steps };
export type { StepsProps, StepsRef } from './components/steps';
export { Carousel };
export type { CarouselProps, CarouselRef } from './components/carousel';
export { Button, Input, Modal };
export type { ButtonProps, ButtonRef } from './components/button';
export type { InputProps, InputRef } from './components/input';
export type { ModalProps, ModalRef } from './components/modal';
export { Form, FormItem };
export type { FormProps, FormItemProps, FormRef, FormItemRef } from './components/form';
export { TimePicker };
export type { TimePickerProps, TimePickerRef } from './components/time-picker';
export { Cascader };
export type { CascaderProps, CascaderRef } from './components/cascader';
export { Upload };
export type { UploadProps, UploadFile } from './components/upload';
export { TimeSlotPicker };
export type {
  TimeSlotGranularity,
  TimeSlotPickerProps,
  TimeSlotPickerRef,
} from './components/time-slot-picker';
export type { TreeProps, TreeNode, TreeRef } from './components/tree';

// 基础设施：主题运行时 API / 插件系统 / 虚拟滚动原语（re-export 自 @xui-design/shared）
export {
  clearThemeTokens,
  getTheme,
  setTheme,
  setThemeTokens,
  subscribeTheme,
  toggleTheme,
} from '@xui-design/shared';
export { applyPlugins } from '@xui-design/shared';
export { createVirtualListLogic } from '@xui-design/shared';
export type { XuiTheme } from '@xui-design/shared';
export type { XuiPlugin, PluginInstallContext } from '@xui-design/shared';
export type {
  VirtualListLogicInstance,
  VirtualListOptions,
  VirtualListState,
} from '@xui-design/shared';

// 基础设施：国际化运行时 API（re-export 自 @xui-design/shared）
export {
  DEFAULT_LOCALE,
  getLocale,
  getLocaleData,
  registerLocale,
  setLocale,
  subscribeLocale,
} from '@xui-design/shared';
export { useLocaleData } from './hooks/use-locale';
export type { LocaleListener, XuiLocaleData, XuiLocaleInput } from '@xui-design/shared';

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
    app.component(Tree.name ?? 'Tree', Tree);
    app.component(Drawer.name ?? 'Drawer', Drawer);
    app.component(Dropdown.name ?? 'Dropdown', Dropdown);
    app.component(TreeSelect.name ?? 'TreeSelect', TreeSelect);
    app.component(Steps.name ?? 'Steps', Steps);
    app.component(Carousel.name ?? 'Carousel', Carousel);
    app.component(Modal.name ?? 'Modal', Modal);
    app.component(Form.name ?? 'Form', Form);
    app.component(FormItem.name ?? 'FormItem', FormItem);
    app.component(TimePicker.name ?? 'TimePicker', TimePicker);
    app.component(Cascader.name ?? 'Cascader', Cascader);
    app.component(Upload.name ?? 'Upload', Upload);
    app.component(TimeSlotPicker.name ?? 'TimeSlotPicker', TimeSlotPicker);
  },
};
