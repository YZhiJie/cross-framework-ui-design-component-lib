/**
 * applyPlugins —— 逻辑实例插件包装器
 *
 * 在不修改组件核心代码的前提下为逻辑实例接入插件生命周期钩子：
 * - onStateChange 始终活跃（内部常驻订阅分发，不依赖外部是否订阅）
 * - beforeUpdateOptions 可拦截并替换每次 updateOptions 的入参
 * - install 可注入自定义方法到增强实例（渲染扩展 / 功能扩展）
 * - dispose 触发插件 destroy，适配层卸载时调用
 *
 * 稳定性保障：所有插件钩子经 try/catch 隔离，插件抛错不影响组件核心功能；
 * 同名插件按名去重（保留首个）。零插件时直通原实例（仅附加空 dispose，零包装开销）。
 */

import type { LogicInstance, StateListener, Subscribe } from '../types';
import type { PluginInstallContext, XuiPlugin } from './types';

/** 按插件名去重（保留首个出现的插件） */
function dedupePlugins<P extends Record<string, unknown>, S, T extends LogicInstance<P, S>>(
  plugins: ReadonlyArray<XuiPlugin<P, S, T>>,
): XuiPlugin<P, S, T>[] {
  const seen = new Set<string>();
  const result: XuiPlugin<P, S, T>[] = [];
  for (const plugin of plugins) {
    if (seen.has(plugin.name)) continue;
    seen.add(plugin.name);
    result.push(plugin);
  }
  return result;
}

/** 安全调用插件钩子：插件抛错仅记录，不中断组件核心流程 */
function safeCall(fn: () => void, pluginName: string, hook: string): void {
  try {
    fn();
  } catch (error) {
    console.error(`[xui-plugin] 插件 "${pluginName}" 的 ${hook} 钩子抛出异常:`, error);
  }
}

export function applyPlugins<P extends Record<string, unknown>, S, T extends LogicInstance<P, S>>(
  logic: T,
  plugins: ReadonlyArray<XuiPlugin<P, S, T>>,
): T & { dispose: () => void } {
  const activePlugins = dedupePlugins(plugins);

  if (activePlugins.length === 0) {
    return Object.assign(logic, { dispose: () => {} });
  }

  // ---- 状态分发：内部常驻订阅原实例，插件钩子始终活跃 ----
  const externalListeners = new Set<StateListener<S>>();
  const stateHooks = activePlugins.filter((plugin) => plugin.onStateChange !== undefined);

  logic.subscribe((state) => {
    for (const plugin of stateHooks) {
      safeCall(() => plugin.onStateChange?.(state), plugin.name, 'onStateChange');
    }
    externalListeners.forEach((listener) => listener(state));
  });

  const wrappedSubscribe: Subscribe<S> = (listener) => {
    externalListeners.add(listener);
    return () => {
      externalListeners.delete(listener);
    };
  };

  // ---- 配置更新拦截 ----
  const wrappedUpdateOptions = (next: Partial<P>): void => {
    let effective = next;
    for (const plugin of activePlugins) {
      if (plugin.beforeUpdateOptions === undefined) continue;
      safeCall(
        () => {
          const modified = plugin.beforeUpdateOptions?.(effective);
          if (modified) effective = modified;
        },
        plugin.name,
        'beforeUpdateOptions',
      );
    }

    logic.updateOptions(effective);

    for (const plugin of activePlugins) {
      if (plugin.afterUpdateOptions === undefined) continue;
      safeCall(() => plugin.afterUpdateOptions?.(effective), plugin.name, 'afterUpdateOptions');
    }
  };

  // ---- install：注入自定义方法 ----
  const injectedMethods: Record<string, unknown> = {};
  const installCtx: PluginInstallContext<P, S, T> = {
    logic,
    setMethod: (name, fn) => {
      injectedMethods[name] = fn;
    },
    onStateChange: (listener) => logic.subscribe(listener),
  };

  for (const plugin of activePlugins) {
    safeCall(() => plugin.install?.(installCtx), plugin.name, 'install');
  }

  // ---- dispose：插件销毁（幂等） ----
  let disposed = false;
  const dispose = (): void => {
    if (disposed) return;
    disposed = true;
    for (const plugin of activePlugins) {
      if (plugin.destroy === undefined) continue;
      safeCall(() => plugin.destroy?.(), plugin.name, 'destroy');
    }
  };

  return Object.assign({}, logic, injectedMethods, {
    subscribe: wrappedSubscribe,
    updateOptions: wrappedUpdateOptions,
    dispose,
  }) as T & { dispose: () => void };
}
