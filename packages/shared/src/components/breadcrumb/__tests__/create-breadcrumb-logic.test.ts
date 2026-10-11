import { describe, expect, it, vi } from 'vitest';
import { createBreadcrumbLogic } from '../create-breadcrumb-logic';

const ITEMS = [
  { label: '首页', href: '/home' },
  { label: '列表', href: '/list' },
  { label: '详情' },
];

describe('createBreadcrumbLogic', () => {
  it('初始状态正确（空列表 + 默认分隔符）', () => {
    const logic = createBreadcrumbLogic();
    expect(logic.getState()).toEqual({ items: [], separator: '/' });
  });

  it('items 与自定义 separator 生效', () => {
    const logic = createBreadcrumbLogic({ items: ITEMS, separator: '>' });
    expect(logic.getState()).toEqual({ items: ITEMS, separator: '>' });
  });

  it('separator 空串回退默认值', () => {
    const logic = createBreadcrumbLogic({ separator: '' });
    expect(logic.getState().separator).toBe('/');
  });

  it('items 缺省回退空数组', () => {
    expect(createBreadcrumbLogic({}).getState().items).toEqual([]);
  });

  it('selectItem 可导航项触发回调并携带 item 与 index', () => {
    const onItemClick = vi.fn();
    const logic = createBreadcrumbLogic({ items: ITEMS, onItemClick });
    logic.selectItem(0);
    expect(onItemClick).toHaveBeenCalledWith(ITEMS[0], 0);
  });

  it('selectItem 末项静默忽略', () => {
    const onItemClick = vi.fn();
    const logic = createBreadcrumbLogic({ items: ITEMS, onItemClick });
    logic.selectItem(2);
    expect(onItemClick).not.toHaveBeenCalled();
  });

  it('selectItem disabled 项静默忽略', () => {
    const onItemClick = vi.fn();
    const items = [{ label: 'A', href: '/a' }, { label: 'B', disabled: true }, { label: 'C' }];
    const logic = createBreadcrumbLogic({ items, onItemClick });
    logic.selectItem(1);
    expect(onItemClick).not.toHaveBeenCalled();
  });

  it('selectItem 越界索引静默忽略', () => {
    const onItemClick = vi.fn();
    const logic = createBreadcrumbLogic({ items: ITEMS, onItemClick });
    logic.selectItem(9);
    logic.selectItem(-1);
    expect(onItemClick).not.toHaveBeenCalled();
  });

  it('updateOptions 变更 items / separator 并通知', () => {
    const listener = vi.fn();
    const logic = createBreadcrumbLogic({ items: ITEMS });
    logic.subscribe(listener);
    logic.updateOptions({ items: [{ label: '新项' }], separator: '-' });
    expect(logic.getState()).toEqual({ items: [{ label: '新项' }], separator: '-' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('updateOptions 无变化不通知', () => {
    const listener = vi.fn();
    const logic = createBreadcrumbLogic({ items: ITEMS });
    logic.subscribe(listener);
    logic.updateOptions({ items: ITEMS, separator: '/' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('getState 返回快照，内部状态修改不影响快照', () => {
    const logic = createBreadcrumbLogic({ items: ITEMS });
    const snapshot = logic.getState();
    logic.updateOptions({ items: [] });
    expect(snapshot.items).toEqual(ITEMS);
  });
});
