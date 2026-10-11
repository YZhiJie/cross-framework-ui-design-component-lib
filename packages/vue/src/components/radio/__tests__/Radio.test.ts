import { describe, expect, it } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Radio from '../Radio.vue';
import RadioGroup from '../../radio-group/RadioGroup.vue';

describe('Radio (vue)', () => {
  it('渲染结构与 BEM 类名', () => {
    const wrapper = mount(Radio, { props: { value: 'x' }, slots: { default: '选项' } });
    expect(wrapper.classes()).toContain('xui-radio');
    expect(wrapper.find('.xui-radio__dot').exists()).toBe(true);
    expect(wrapper.text()).toContain('选项');
  });

  it('组外渲染作兜底：点击后保持永不选中', async () => {
    const wrapper = mount(Radio, { props: { value: 'x' } });
    const input = wrapper.find('input');
    await input.setValue();
    expect((input.element as HTMLInputElement).checked).toBe(false);
  });

  it('组内渲染（组合挂载）：随组值选中、点击后互斥切换', async () => {
    const wrapper = mount(RadioGroup, {
      props: { defaultValue: 'x' },
      global: { components: { Radio } },
      slots: { default: '<Radio value="x">X</Radio><Radio value="y">Y</Radio>' },
    });
    const inputs = wrapper.findAll('input[type="radio"]');
    expect((inputs[0].element as HTMLInputElement).checked).toBe(true);
    expect((inputs[1].element as HTMLInputElement).checked).toBe(false);

    await inputs[1].setValue();
    expect((inputs[0].element as HTMLInputElement).checked).toBe(false);
    expect((inputs[1].element as HTMLInputElement).checked).toBe(true);
  });

  it('disabled 渲染禁用类名', () => {
    const wrapper = mount(Radio, { props: { value: 'x', disabled: true } });
    expect(wrapper.classes()).toContain('is-disabled');
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true);
  });

  it('组内禁用项：程序化 change 不触发组 change 且保持未选中', async () => {
    const wrapper = mount(RadioGroup, {
      props: { defaultValue: 'y' },
      global: { components: { Radio } },
      slots: { default: '<Radio value="x" disabled>X</Radio><Radio value="y">Y</Radio>' },
    });
    const inputs = wrapper.findAll('input[type="radio"]');
    // VTU trigger 会跳过 disabled 元素（模拟浏览器），手动派发以覆盖程序化触发场景
    // （与 React 测试的 fireEvent.click 同类路径，均绕过原生 disabled 行为）
    inputs[0].element.dispatchEvent(new Event('change'));
    await nextTick();
    expect(wrapper.emitted('change')).toBeUndefined();
    expect((inputs[0].element as HTMLInputElement).checked).toBe(false);
    expect((inputs[1].element as HTMLInputElement).checked).toBe(true);
  });
});
