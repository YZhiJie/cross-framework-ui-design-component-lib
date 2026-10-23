/**
 * @xui-design/react - React 19 适配层
 *
 * 将 @xui-design/shared 核心逻辑桥接到 React 状态系统。
 * - React 19+：ref-as-prop（无需 forwardRef）
 * - useSyncExternalStore：订阅逻辑层状态，保证引用稳定
 *
 * 类型契约来自 @xui-design/core，纯逻辑来自 @xui-design/shared。
 * 样式由 @xui-design/styles 统一提供（组件样式单一来源），导入 '@xui-design/styles' 即可获得全部样式。
 */

export { Switch } from './components/switch';
export type { SwitchRef } from './components/switch';

export { Checkbox } from './components/checkbox';
export type { CheckboxRef } from './components/checkbox';

export { Tag } from './components/tag';

export { Alert } from './components/alert';

export { RadioGroup } from './components/radio-group';
export { Radio } from './components/radio';
export { Progress } from './components/progress';
export { Badge } from './components/badge';
export { Avatar } from './components/avatar';
export { Empty } from './components/empty';
export { Select } from './components/select';
export { Tabs } from './components/tabs';
export { message } from './components/message';
export { Tooltip } from './components/tooltip';
export { Pagination } from './components/pagination';
export { DatePicker } from './components/date-picker';
export { Table } from './components/table';
export { Spin } from './components/spin';
export { Breadcrumb } from './components/breadcrumb';
export { Skeleton } from './components/skeleton';
export { InputNumber } from './components/input-number';
export { Popconfirm } from './components/popconfirm';
export { Tree } from './components/tree';
export type { TreeRef } from './components/tree';
export { Drawer } from './components/drawer';
export type { DrawerRef } from './components/drawer';
export { Dropdown } from './components/dropdown';
export type { DropdownRef } from './components/dropdown';
export { TreeSelect } from './components/tree-select';
export type { TreeSelectRef } from './components/tree-select';
export { Steps } from './components/steps';
export type { StepsRef } from './components/steps';
export { Carousel } from './components/carousel';
export type { CarouselRef } from './components/carousel';
export { Waterfall } from './components/waterfall';
export type {
  WaterfallItem,
  WaterfallEvents,
  WaterfallSlots,
  WaterfallState,
} from './components/waterfall';
export { Button } from './components/button';

export type { SelectRef } from './components/select';

export type { TooltipRef } from './components/tooltip';

export type { DatePickerRef } from './components/date-picker';

export type { InputNumberRef } from './components/input-number';
export type { PopconfirmRef } from './components/popconfirm';
export type { ButtonRef } from './components/button';

export { Input } from './components/input';
export type { InputRef } from './components/input';

export { Modal } from './components/modal';
export type { ModalRef } from './components/modal';

export { Form, FormItem, useFormContext } from './components/form';
export type { FormContextValue, FormRef, FormItemRef } from './components/form';

export { TimePicker } from './components/time-picker';
export type { TimePickerRef } from './components/time-picker';

export { Cascader } from './components/cascader';
export type { CascaderRef } from './components/cascader';

export { Upload } from './components/upload';
export type { UploadRef } from './components/upload';

export { TimeSlotPicker } from './components/time-slot-picker';
export type { TimeSlotPickerRef } from './components/time-slot-picker';

// 组件契约 Props 类型（re-export 自 @xui-design/core，与 Vue 端导出名称逐字一致）
export type {
  SwitchProps,
  CheckboxProps,
  TagProps,
  AlertProps,
  RadioGroupProps,
  RadioProps,
  ProgressProps,
  BadgeProps,
  AvatarProps,
  EmptyProps,
  SelectProps,
  TabsProps,
  TooltipProps,
  PaginationProps,
  DatePickerProps,
  TableProps,
  SpinProps,
  BreadcrumbProps,
  SkeletonProps,
  InputNumberProps,
  PopconfirmProps,
  TreeProps,
  TreeNode,
  DrawerProps,
  DrawerPlacement,
  DropdownProps,
  DropdownOption,
  DropdownTrigger,
  DropdownPlacement,
  ButtonProps,
  InputProps,
  ModalProps,
  FormProps,
  FormItemProps,
  TimePickerProps,
  CascaderProps,
  TreeSelectProps,
  TreeSelectValue,
  StepsProps,
  CarouselProps,
  UploadProps,
  UploadFile,
  TimeSlotPickerProps,
  TimeSlotGranularity,
  WaterfallProps,
  WaterfallBreakpoint,
  WaterfallLayoutPayload,
} from '@xui-design/core';

export { useLogicState } from './hooks/use-logic-state';
export { cn } from './utils/cn';

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

export const REACT_VERSION = '0.0.0';
