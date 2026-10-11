import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Tabs from '../Tabs.vue';

const ITEMS = [
  { label: '标签一', value: 'a' },
  { label: '标签二', value: 'b', disabled: true },
  { label: '标签三', value: 'c' },
];

describe('Tabs (vue)', () => {
  it('渲染全部 tab，默认无激活面板', () => {
    const wrapper = mount(Tabs, { props: { items: ITEMS } });
    expect(wrapper.findAll('[role="tab"]')).toHaveLength(3);
    expect(wrapper.find('[role="tabpanel"]').exists()).toBe(false);
  });

  it('defaultValue 激活对应项与面板（ARIA 关联）', () => {
    const wrapper = mount(Tabs, { props: { items: ITEMS, defaultValue: 'a' } });
    const tabs = wrapper.findAll('[role="tab"]');
    expect(tabs[0].classes()).toContain('is-active');
    expect(tabs[0].attributes('aria-selected')).toBe('true');
    const panel = wrapper.find('[role="tabpanel"]');
    expect(panel.attributes('aria-labelledby')).toContain('-tab-a');
    expect(panel.text()).toBe('标签一');
  });

  it('作用域插槽渲染激活面板内容', () => {
    const wrapper = mount(Tabs, {
      props: { items: ITEMS, defaultValue: 'a' },
      slots: {
        default: '<template #item="{ item }">面板内容：{{ item.label }}</template>',
      },
    });
    expect(wrapper.find('[role="tabpanel"]').text()).toBe('面板内容：标签一');
  });

  it('点击 tab 切换并触发 change / update:value', async () => {
    const wrapper = mount(Tabs, { props: { items: ITEMS, defaultValue: 'a' } });
    await wrapper.findAll('[role="tab"]')[2].trigger('click');
    expect(wrapper.emitted('change')).toEqual([['c']]);
    expect(wrapper.emitted('update:value')).toEqual([['c']]);
    expect(wrapper.find('[role="tabpanel"]').text()).toBe('标签三');
  });

  it('禁用 tab 点击忽略且标记 aria-disabled', async () => {
    const wrapper = mount(Tabs, { props: { items: ITEMS, defaultValue: 'a' } });
    await wrapper.findAll('[role="tab"]')[1].trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.findAll('[role="tab"]')[1].attributes('aria-disabled')).toBe('true');
  });

  it('键盘 ArrowRight 跳过禁用项、ArrowLeft 循环', async () => {
    const wrapper = mount(Tabs, { props: { items: ITEMS, defaultValue: 'a' } });
    const list = wrapper.find('[role="tablist"]');
    await list.trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('change')?.[0]).toEqual(['c']);
    await list.trigger('keydown', { key: 'ArrowLeft' });
    expect(wrapper.emitted('change')?.[1]).toEqual(['a']);
  });

  it('受控模式：点击仅触发回调，外部 value 同步显示', async () => {
    const wrapper = mount(Tabs, { props: { items: ITEMS, value: 'a' } });
    await wrapper.findAll('[role="tab"]')[2].trigger('click');
    expect(wrapper.emitted('change')).toEqual([['c']]);
    // 受控：内部值未变
    expect(wrapper.findAll('[role="tab"]')[0].classes()).toContain('is-active');
    await wrapper.setProps({ value: 'c' });
    await nextTick();
    expect(wrapper.findAll('[role="tab"]')[2].classes()).toContain('is-active');
    expect(wrapper.find('[role="tabpanel"]').text()).toBe('标签三');
  });
});
