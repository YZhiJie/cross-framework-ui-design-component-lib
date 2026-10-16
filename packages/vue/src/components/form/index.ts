export type { FormProps, FormItemProps } from '@xui-design/core';

export { default as Form } from './Form.vue';
export { default as FormItem } from './FormItem.vue';

// 契约类型从 core re-export（适配层不重复定义契约类型）
export type { FormRef, FormItemRef } from '@xui-design/core';
