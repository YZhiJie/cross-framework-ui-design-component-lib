/**
 * useLocaleData - 订阅当前语言包（Vue 适配层）
 *
 * 返回响应式 ref：初始取 getLocaleData()，subscribeLocale 通知时
 * 更新引用触发依赖它的 computed / 模板重渲染。
 * 在 setup / effect 作用域内调用时随作用域销毁自动退订；
 * 作用域外调用立即退订，避免监听器泄漏。
 */

import { getCurrentScope, onScopeDispose, ref } from 'vue';
import type { Ref } from 'vue';
import { getLocaleData, subscribeLocale } from '@xui-design/shared';
import type { XuiLocaleData } from '@xui-design/shared';

export function useLocaleData(): Ref<XuiLocaleData> {
  const data = ref(getLocaleData()) as Ref<XuiLocaleData>;
  const unsubscribe = subscribeLocale((next) => {
    data.value = next;
  });
  if (getCurrentScope()) {
    onScopeDispose(unsubscribe);
  } else {
    unsubscribe();
  }
  return data;
}
