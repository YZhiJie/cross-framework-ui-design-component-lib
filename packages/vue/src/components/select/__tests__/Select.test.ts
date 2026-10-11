import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Select from '../Select.vue';

const OPTIONS = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai', disabled: true },
  { label: '广州', value: 'guangzhou' },
];

describe('Select (vue)', () => {
  it('未选中时渲染 placeholder', () => {
    const wrapper = mount(Select, { props: { options: OPTIONS, placeholder: '请选择城市' } });
    expect(wrapper.find('.xui-select__placeholder').text()).toBe('请选择城市');
  });

  it('defaultValue 渲染选中项 label', () => {
    const wrapper = mount(Select, { props: { options: OPTIONS, defaultValue: 'beijing' } });
    expect(wrapper.find('.xui-select__value').text()).toBe('北京');
  });

  it('点击 trigger 展开面板并渲染选项（ARIA）', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    const trigger = wrapper.find('.xui-select__trigger');
    expect(trigger.attributes('role')).toBe('combobox');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(3);
    expect(options[1].classes()).toContain('is-disabled');
    // 展开时高亮第一个可用项
    expect(options[0].classes()).toContain('is-active');
  });

  it('点击选项：更新选中值、收起面板、触发 change / update:value', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    await wrapper.findAll('[role="option"]')[2].trigger('click');
    expect(wrapper.find('.xui-select__value').text()).toBe('广州');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
    expect(wrapper.emitted('change')).toEqual([['guangzhou']]);
    expect(wrapper.emitted('update:value')).toEqual([['guangzhou']]);
  });

  it('禁用项点击忽略（面板保持展开）', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    await wrapper.findAll('[role="option"]')[1].trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
  });

  it('clearable：选中后显示清除图标，点击触发 clear 并置空', async () => {
    const wrapper = mount(Select, {
      props: { options: OPTIONS, defaultValue: 'beijing', clearable: true },
    });
    const clear = wrapper.find('.xui-select__clear');
    expect(clear.exists()).toBe(true);
    await clear.trigger('click');
    expect(wrapper.find('.xui-select__placeholder').exists()).toBe(true);
    expect(wrapper.emitted('clear')).toHaveLength(1);
  });

  it('disabled：点击不展开且标记 aria-disabled', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS, disabled: true } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
    expect(wrapper.find('.xui-select__trigger').attributes('aria-disabled')).toBe('true');
  });

  it('键盘：Enter 展开、ArrowDown 跳过禁用项、Enter 确认', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS } });
    const trigger = wrapper.find('.xui-select__trigger');
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    await trigger.trigger('keydown', { key: 'ArrowDown' });
    await trigger.trigger('keydown', { key: 'Enter' });
    // 高亮从北京跳过禁用的上海到广州
    expect(wrapper.emitted('change')).toEqual([['guangzhou']]);
  });

  it('键盘 Escape 收起面板', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    await wrapper.find('.xui-select__trigger').trigger('keydown', { key: 'Escape' });
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
  });

  it('受控模式：select 仅触发回调，外部 value 同步显示', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS, value: 'beijing' } });
    await wrapper.find('.xui-select__trigger').trigger('click');
    await wrapper.findAll('[role="option"]')[2].trigger('click');
    expect(wrapper.emitted('change')).toEqual([['guangzhou']]);
    // 受控：内部值未变，显示仍是北京
    expect(wrapper.find('.xui-select__value').text()).toBe('北京');
    await wrapper.setProps({ value: 'guangzhou' });
    await nextTick();
    expect(wrapper.find('.xui-select__value').text()).toBe('广州');
  });

  it('点击组件外部收起面板', async () => {
    const wrapper = mount(Select, { props: { options: OPTIONS }, attachTo: document.body });
    await wrapper.find('.xui-select__trigger').trigger('click');
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true);
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false);
    wrapper.unmount();
  });
});
