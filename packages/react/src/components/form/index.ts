export { Form } from './Form';
export { useFormContext } from './Form';
export type { FormComponentProps, FormContextValue } from './Form';

export { FormItem } from './FormItem';
export type { FormItemComponentProps } from './FormItem';

// 契约类型从 core re-export（适配层不重复定义契约类型）
export type { FormRef, FormItemRef } from '@xui-design/core';
