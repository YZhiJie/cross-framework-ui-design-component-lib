/**
 * useLogicState - 将 @xui/shared 的逻辑实例状态桥接到 React
 *
 * 关键点：logic.getState() 每次返回新的对象引用（浅拷贝），
 * 直接用于 useSyncExternalStore 的 getSnapshot 会因 Object.is 比较失败
 * 触发无限重渲染。这里通过 ref 缓存最新快照，仅在 subscribe 回调
 * 收到新状态时更新缓存并触发 React 重新读取，保证引用稳定。
 */

import { useCallback, useRef, useSyncExternalStore } from 'react';
import type { StateListener, Unsubscribe } from '@xui/shared';

export function useLogicState<S extends object>(
  subscribe: (listener: StateListener<S>) => Unsubscribe,
  getState: () => S,
): S {
  const cachedRef = useRef<S | null>(null);
  if (cachedRef.current === null) {
    cachedRef.current = getState();
  }

  const wrappedSubscribe = useCallback(
    (onStoreChange: () => void) => {
      return subscribe((next) => {
        cachedRef.current = next;
        onStoreChange();
      });
    },
    [subscribe],
  );

  const getSnapshot = useCallback(() => cachedRef.current as S, []);

  return useSyncExternalStore(wrappedSubscribe, getSnapshot, getSnapshot);
}
