import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Waterfall from '../Waterfall.vue';

function makeItems(n: number) {
  return Array.from({ length: n }, (_, i) => ({ id: i, title: `item-${i}` }));
}

describe('Waterfall (vue)', () => {
  it('基础渲染：传入 items 正确分多列', () => {
    const wrapper = mount(Waterfall, {
      props: { items: makeItems(6), columns: 3 },
    });

    // 根节点 BEM 类名
    expect(wrapper.find('.xui-waterfall').exists()).toBe(true);

    // 列数 = columns prop
    const columns = wrapper.findAll('.xui-waterfall__column');
    expect(columns).toHaveLength(3);

    // 总 item 数正确
    const items = wrapper.findAll('.xui-waterfall__item');
    expect(items).toHaveLength(6);
  });

  it('空数据态渲染 empty slot', () => {
    const wrapper = mount(Waterfall, {
      props: { items: [] },
      slots: { empty: '<span data-testid="empty">no data</span>' },
    });
    expect(wrapper.find('[data-testid="empty"]').exists()).toBe(true);
    expect(wrapper.find('.xui-waterfall--empty').exists()).toBe(true);
  });

  it('columns prop 变化 → 列数变化', async () => {
    const wrapper = mount(Waterfall, {
      props: { items: makeItems(6), columns: 2 },
    });
    expect(wrapper.findAll('.xui-waterfall__column')).toHaveLength(2);

    await wrapper.setProps({ columns: 3 });
    expect(wrapper.findAll('.xui-waterfall__column')).toHaveLength(3);
  });

  it('item 点击 → itemClick 事件触发', async () => {
    const onItemClick = vi.fn();
    const wrapper = mount(Waterfall, {
      props: { items: makeItems(4), columns: 2 },
      emits: { itemClick: onItemClick },
    });

    const item = wrapper.find('.xui-waterfall__item');
    await item.trigger('click');

    expect(onItemClick).toHaveBeenCalledTimes(1);
    // 事件载荷：item 对象 + index
    const callArg = onItemClick.mock.calls[0][0];
    expect(callArg.id).toBeDefined();
    expect(callArg.title).toBeDefined();
  });

  it('自定义 rowKey 正确工作', () => {
    const wrapper = mount(Waterfall, {
      props: {
        items: [{ uid: 'a' }, { uid: 'b' }],
        rowKey: 'uid',
        columns: 2,
      },
    });
    expect(wrapper.findAll('.xui-waterfall__item')).toHaveLength(2);
  });

  it('gutter CSS 变量正确注入', () => {
    const wrapper = mount(Waterfall, {
      props: { items: makeItems(2), columns: 2, gutter: 24 },
    });
    const rootEl = wrapper.find('.xui-waterfall').element as HTMLElement;
    expect(rootEl.style.getPropertyValue('--xui-waterfall-gutter')).toBe('24px');
  });
});
