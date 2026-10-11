import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import Input from '../Input.vue';

const getInputValue = (value?: string) => {
  const wrapper = mount(Input, value !== undefined ? { props: { value } } : {});
  return { wrapper, input: wrapper.find('input') };
};

describe('Input 组件（Vue 适配层）', () => {
  it('渲染根容器类名与原生 input 元素', () => {
    const { wrapper, input } = getInputValue();

    expect(wrapper.classes()).toContain('xui-input');
    expect(input.classes()).toContain('xui-input__inner');
  });

  it('type / placeholder / maxLength 属性透传到原生 input', () => {
    const wrapper = mount(Input, {
      props: { type: 'password', placeholder: '请输入', maxLength: 10 },
    });
    const input = wrapper.find('input');

    expect(input.attributes('type')).toBe('password');
    expect(input.attributes('placeholder')).toBe('请输入');
    expect(input.attributes('maxlength')).toBe('10');
  });

  it('v-model:value 双向绑定：输入触发 update:value 与 input 事件', async () => {
    const { wrapper, input } = getInputValue('a');

    await input.setValue('abc');

    expect(wrapper.emitted('update:value')).toEqual([['abc']]);
    expect(wrapper.emitted('input')).toEqual([['abc']]);
  });

  it('v-model:value 双向绑定：外部值变化同步到 input 元素', async () => {
    const { wrapper, input } = getInputValue('a');
    expect((input.element as HTMLInputElement).value).toBe('a');

    await wrapper.setProps({ value: 'xyz' });

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('xyz');
  });

  it('change 事件在提交时携带当前值', async () => {
    const { wrapper, input } = getInputValue('a');

    // 手动赋值 + input 事件：仅触发 input，不触发 change
    (input.element as HTMLInputElement).value = 'abc';
    await input.trigger('input');
    expect(wrapper.emitted('input')).toEqual([['abc']]);
    expect(wrapper.emitted('change')).toBeUndefined();

    await input.trigger('change');
    expect(wrapper.emitted('change')).toEqual([['abc']]);
  });

  it('disabled 时渲染禁用态且输入不生效', async () => {
    const wrapper = mount(Input, { props: { disabled: true, value: 'a' } });

    expect(wrapper.classes()).toContain('is-disabled');
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();

    await wrapper.find('input').setValue('abc');

    expect(wrapper.emitted('update:value')).toBeUndefined();
    expect(wrapper.emitted('input')).toBeUndefined();
  });

  it('readonly 时渲染只读态且输入不生效', async () => {
    const wrapper = mount(Input, { props: { readonly: true, value: 'a' } });

    expect(wrapper.classes()).toContain('is-readonly');
    expect(wrapper.find('input').attributes('readonly')).toBeDefined();

    await wrapper.find('input').setValue('abc');

    expect(wrapper.emitted('update:value')).toBeUndefined();
    expect(wrapper.emitted('input')).toBeUndefined();
  });

  it('聚焦时 emit focus 事件并渲染 is-focused 类', async () => {
    const { wrapper, input } = getInputValue();

    await input.trigger('focus');

    expect(wrapper.emitted('focus')).toHaveLength(1);
    expect(wrapper.emitted('focus')?.[0]?.[0]).toBeInstanceOf(Event);
    expect(wrapper.classes()).toContain('is-focused');
  });

  it('失焦时 emit blur 事件并移除 is-focused 类', async () => {
    const { wrapper, input } = getInputValue();

    await input.trigger('focus');
    await input.trigger('blur');

    expect(wrapper.emitted('blur')).toHaveLength(1);
    expect(wrapper.emitted('blur')?.[0]?.[0]).toBeInstanceOf(Event);
    expect(wrapper.classes()).not.toContain('is-focused');
  });

  it('clearable 且有值时渲染清除图标，点击后清空', async () => {
    const plainWrapper = mount(Input, { props: { value: 'abc' } });
    const clearableWrapper = mount(Input, { props: { clearable: true, value: 'abc' } });

    expect(plainWrapper.find('.xui-input__clear').exists()).toBe(false);
    expect(clearableWrapper.find('.xui-input__clear').exists()).toBe(true);

    await clearableWrapper.find('.xui-input__clear').trigger('click');

    expect(clearableWrapper.emitted('clear')).toHaveLength(1);
    expect(clearableWrapper.emitted('update:value')).toEqual([['']]);
    expect(clearableWrapper.emitted('input')).toEqual([['']]);
  });

  it('clearable 时 disabled / readonly / 无值均不渲染清除图标', () => {
    const emptyWrapper = mount(Input, { props: { clearable: true } });
    const disabledWrapper = mount(Input, {
      props: { clearable: true, value: 'a', disabled: true },
    });
    const readonlyWrapper = mount(Input, {
      props: { clearable: true, value: 'a', readonly: true },
    });

    expect(emptyWrapper.find('.xui-input__clear').exists()).toBe(false);
    expect(disabledWrapper.find('.xui-input__clear').exists()).toBe(false);
    expect(readonlyWrapper.find('.xui-input__clear').exists()).toBe(false);
  });

  it('defineExpose 暴露 focus / blur 方法', () => {
    // 真实 focus 需要元素挂在 document 中
    const wrapper = mount(Input, { attachTo: document.body });
    const input = wrapper.find('input');
    const vm = wrapper.vm as unknown as {
      focus: () => void;
      blur: () => void;
    };

    vm.focus();
    expect(document.activeElement).toBe(input.element);

    vm.blur();
    expect(document.activeElement).toBe(document.body);
  });

  it('defineExpose 暴露 clear 方法', () => {
    const { wrapper } = getInputValue('abc');
    const vm = wrapper.vm as unknown as { clear: () => void };

    vm.clear();

    expect(wrapper.emitted('clear')).toHaveLength(1);
    expect(wrapper.emitted('update:value')).toEqual([['']]);
    expect(wrapper.emitted('input')).toEqual([['']]);
  });

  it('渲染 prefix / suffix 插槽', () => {
    const wrapper = mount(Input, {
      slots: {
        prefix: '<span class="prefix-content">￥</span>',
        suffix: '<span class="suffix-content">元</span>',
      },
    });

    expect(wrapper.find('.xui-input__prefix .prefix-content').exists()).toBe(true);
    expect(wrapper.find('.xui-input__suffix .suffix-content').exists()).toBe(true);
  });

  it('className / style 透传到根元素', () => {
    const wrapper = mount(Input, { props: { className: 'my-x', style: { color: 'red' } } });

    expect(wrapper.classes()).toContain('my-x');
    expect(wrapper.classes()).toContain('xui-input');
    expect(wrapper.attributes('style')).toContain('color: red');
  });
});
