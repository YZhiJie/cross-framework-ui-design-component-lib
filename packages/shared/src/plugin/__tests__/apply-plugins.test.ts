import { describe, expect, it, vi } from 'vitest';
import { createTableLogic } from '../../components/table/create-table-logic';
import type {
  TableLogicOptions,
  TableState,
  TableRow,
} from '../../components/table/create-table-logic';
import { applyPlugins } from '../apply-plugins';
import type { XuiPlugin } from '../types';

const rows: TableRow[] = [
  { id: 1, name: '张三' },
  { id: 2, name: '李四' },
];

describe('applyPlugins', () => {
  it('零插件：直通原实例，原方法可用，dispose 幂等', () => {
    const logic = createTableLogic({ dataSource: rows });
    const enhanced = applyPlugins(logic, []);

    logic.toggleSort('id');
    expect(enhanced.getState().sortOrder).toBe('asc');
    expect(enhanced.toggleSort).toBe(logic.toggleSort);
    expect(() => {
      enhanced.dispose();
      enhanced.dispose();
    }).not.toThrow();
  });

  it('install 钩子执行一次，setMethod 注入的方法可调用', () => {
    const install = vi.fn();
    const plugin: XuiPlugin<TableLogicOptions, TableState> = {
      name: 'test-methods',
      install(ctx) {
        install();
        ctx.setMethod('rowCount', () => ctx.logic.getState().sortedData.length);
      },
    };

    const enhanced = applyPlugins(createTableLogic({ dataSource: rows }), [plugin]);

    expect(install).toHaveBeenCalledTimes(1);
    expect((enhanced as unknown as { rowCount: () => number }).rowCount()).toBe(2);
  });

  it('onStateChange 钩子始终活跃（无需外部订阅）', () => {
    const seen: TableState[] = [];
    const plugin: XuiPlugin<TableLogicOptions, TableState> = {
      name: 'state-hook',
      onStateChange: (state) => seen.push(state),
    };

    const enhanced = applyPlugins(createTableLogic({ dataSource: rows }), [plugin]);
    enhanced.toggleSort('id');

    expect(seen.length).toBe(1);
    expect(seen[0].sortOrder).toBe('asc');
  });

  it('外部 subscribe 仍正常工作，退订后不再收到', () => {
    const listener = vi.fn();
    const enhanced = applyPlugins(createTableLogic({ dataSource: rows }), [{ name: 'noop' }]);

    const unsubscribe = enhanced.subscribe(listener);
    enhanced.toggleSort('id');
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    enhanced.toggleSort('id');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('beforeUpdateOptions 可拦截并替换配置入参', () => {
    const plugin: XuiPlugin<TableLogicOptions, TableState> = {
      name: 'interceptor',
      beforeUpdateOptions: (options) => ({ ...options, dataSource: rows }),
    };

    const enhanced = applyPlugins(createTableLogic({ dataSource: [] }), [plugin]);
    enhanced.updateOptions({ dataSource: [{ id: 99, name: '被拦截' }] });

    expect(enhanced.getState().sortedData).toEqual(rows);
  });

  it('afterUpdateOptions 在配置应用后收到本次入参', () => {
    const received: TableLogicOptions[] = [];
    const plugin: XuiPlugin<TableLogicOptions, TableState> = {
      name: 'after-hook',
      afterUpdateOptions: (options) => received.push(options),
    };

    const next: TableRow[] = [{ id: 3, name: '王五' }];
    const enhanced = applyPlugins(createTableLogic({ dataSource: [] }), [plugin]);
    enhanced.updateOptions({ dataSource: next });

    expect(received).toEqual([{ dataSource: next }]);
  });

  it('dispose 触发 destroy 且幂等', () => {
    const destroy = vi.fn();
    const enhanced = applyPlugins(createTableLogic({ dataSource: rows }), [
      { name: 'destroyable', destroy },
    ]);

    enhanced.dispose();
    enhanced.dispose();
    expect(destroy).toHaveBeenCalledTimes(1);
  });

  it('同名插件按名去重（保留首个）', () => {
    const first = vi.fn();
    const second = vi.fn();
    const enhanced = applyPlugins(createTableLogic({ dataSource: rows }), [
      { name: 'dup', onStateChange: () => first() },
      { name: 'dup', onStateChange: () => second() },
    ]);

    enhanced.toggleSort('id');
    expect(first).toHaveBeenCalledTimes(1);
    expect(second).not.toHaveBeenCalled();
  });

  it('插件钩子抛错被隔离，不影响组件核心功能', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const plugin: XuiPlugin<TableLogicOptions, TableState> = {
      name: 'broken',
      onStateChange: () => {
        throw new Error('插件故障');
      },
      beforeUpdateOptions: () => {
        throw new Error('插件故障');
      },
      destroy: () => {
        throw new Error('插件故障');
      },
    };

    const enhanced = applyPlugins(createTableLogic({ dataSource: [] }), [plugin]);

    // 核心功能不受影响：配置更新与排序均正常
    expect(() => enhanced.updateOptions({ dataSource: rows })).not.toThrow();
    expect(() => enhanced.toggleSort('id')).not.toThrow();
    expect(enhanced.getState().sortOrder).toBe('asc');
    expect(() => enhanced.dispose()).not.toThrow();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  it('同名注入方法覆盖原方法', () => {
    const enhanced = applyPlugins(createTableLogic({ dataSource: rows }), [
      {
        name: 'override',
        install: (ctx) => ctx.setMethod('toggleSort', () => 'injected'),
      },
    ]);

    expect((enhanced as unknown as { toggleSort: () => string }).toggleSort()).toBe('injected');
  });
});
