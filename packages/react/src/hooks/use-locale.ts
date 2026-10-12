/**
 * useLocaleData - 订阅当前语言包（React 适配层）
 *
 * 复用 useLogicState 的快照缓存基座：@xui-design/shared 的 getLocaleData()
 * 返回稳定引用（仅语言切换 / 当前包重新注册时更换），notify 时把新包
 * 引用写入缓存并触发重渲染，满足 useSyncExternalStore 的 Object.is 语义。
 */

import { useLogicState } from './use-logic-state';
import { getLocaleData, subscribeLocale } from '@xui-design/shared';
import type { XuiLocaleData } from '@xui-design/shared';

export function useLocaleData(): XuiLocaleData {
  return useLogicState(subscribeLocale, getLocaleData);
}
