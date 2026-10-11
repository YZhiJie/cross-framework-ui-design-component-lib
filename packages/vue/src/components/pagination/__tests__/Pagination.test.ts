import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from '../Pagination.vue';

const findPageButton = (wrapper: ReturnType<typeof mount>, page: number) =>
  wrapper.findAll('.xui-pagination__page').find((node) => node.text() === String(page))!;

describe('Pagination (vue)', () => {
  it('渲染页码按钮与当前页高亮（aria-current）', () => {
    const wrapper = mount(Pagination, { props: { total: 95, defaultValue: 2 } });
    const pages = wrapper.findAll('.xui-pagination__page');
    // pageCount=10：序列为 [1,2,3,4,5,'···',10]，数字按钮 6 个
    expect(pages).toHaveLength(6);
    const current = findPageButton(wrapper, 2);
    expect(current.classes()).toContain('is-active');
    expect(current.attributes('aria-current')).toBe('page');
  });

  it('点击页码触发 change 与 update:value', async () => {
    const wrapper = mount(Pagination, { props: { total: 95 } });
    await findPageButton(wrapper, 5).trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual([5]);
    expect(wrapper.emitted('update:value')?.[0]).toEqual([5]);
    expect(findPageButton(wrapper, 5).classes()).toContain('is-active');
  });

  it('prev / next 按钮在边界禁用，中间可用', async () => {
    const wrapper = mount(Pagination, { props: { total: 25 } });
    const prev = wrapper.find('.xui-pagination__nav');
    const next = wrapper.findAll('.xui-pagination__nav')[1];
    expect(prev.attributes('disabled')).toBeDefined();
    await next.trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual([2]);
    await wrapper.setProps({ value: 3 });
    expect(prev.attributes('disabled')).toBeUndefined();
  });

  it('总页数超过 7 时渲染省略号占位', () => {
    const wrapper = mount(Pagination, { props: { total: 200, defaultValue: 10 } });
    expect(wrapper.findAll('.xui-pagination__ellipsis')).toHaveLength(2);
  });

  it('受控模式：value 变更驱动当前页', async () => {
    const wrapper = mount(Pagination, { props: { total: 95, value: 1 } });
    await wrapper.setProps({ value: 3 });
    expect(findPageButton(wrapper, 3).classes()).toContain('is-active');
  });

  it('disabled 时全部按钮禁用且点击不触发 change', async () => {
    const onChange = vi.fn();
    const wrapper = mount(Pagination, { props: { total: 95, disabled: true, onChange } });
    await findPageButton(wrapper, 5).trigger('click');
    expect(onChange).not.toHaveBeenCalled();
    expect(wrapper.classes()).toContain('is-disabled');
    expect(wrapper.find('.xui-pagination__nav').attributes('disabled')).toBeDefined();
  });

  it('total/pageSize 变更重算页数', () => {
    const wrapper = mount(Pagination, { props: { total: 95 } });
    expect(wrapper.findAll('.xui-pagination__page')).toHaveLength(6);
    wrapper.unmount();
    const small = mount(Pagination, { props: { total: 95, pageSize: 50 } });
    expect(small.findAll('.xui-pagination__page')).toHaveLength(2);
  });

  it('className / style 透传到根节点', () => {
    const wrapper = mount(Pagination, {
      props: { total: 95, className: 'my-x', style: { color: 'red' } },
    });
    expect(wrapper.classes()).toContain('my-x');
    expect(wrapper.attributes('style')).toContain('color: red');
  });

  it('prevIcon 插槽替换上一页图标', () => {
    const wrapper = mount(Pagination, {
      props: { total: 95 },
      slots: { prevIcon: '<i class="my-prev-x">p</i>' },
    });
    const prev = wrapper.findAll('.xui-pagination__nav')[0];
    expect(prev.find('.my-prev-x').exists()).toBe(true);
    expect(prev.find('svg').exists()).toBe(false);
  });

  it('nextIcon 插槽替换下一页图标', () => {
    const wrapper = mount(Pagination, {
      props: { total: 95 },
      slots: { nextIcon: '<i class="my-next-x">n</i>' },
    });
    const next = wrapper.findAll('.xui-pagination__nav')[1];
    expect(next.find('.my-next-x').exists()).toBe(true);
    expect(next.find('svg').exists()).toBe(false);
  });
});
