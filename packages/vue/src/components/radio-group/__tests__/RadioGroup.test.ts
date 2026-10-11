import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import RadioGroup from '../RadioGroup.vue';
import Radio from '../../radio/Radio.vue';

const options = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
  { label: 'C', value: 'c', disabled: true },
];

const getInputs = (wrapper: VueWrapper) => wrapper.findAll('input[type="radio"]');
const checkedOf = (wrapper: VueWrapper, index: number) =>
  (getInputs(wrapper)[index].element as HTMLInputElement).checked;

describe('RadioGroup (vue)', () => {
  it('渲染 role="radiogroup" 与 options 选项', () => {
    const wrapper = mount(RadioGroup, { props: { options } });
    expect(wrapper.classes()).toContain('xui-radio-group');
    expect(wrapper.attributes('role')).toBe('radiogroup');
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(3);
    expect(wrapper.text()).toContain('A');
  });

  it('defaultValue 提供非受控初始选中', () => {
    const wrapper = mount(RadioGroup, { props: { options, defaultValue: 'b' } });
    expect(checkedOf(wrapper, 1)).toBe(true);
  });

  it('非受控模式：点击选项触发 change 与 update:value', async () => {
    const wrapper = mount(RadioGroup, { props: { options } });
    await getInputs(wrapper)[1].setValue();
    expect(wrapper.emitted('change')![0]).toEqual(['b']);
    expect(wrapper.emitted('update:value')![0]).toEqual(['b']);
    expect(checkedOf(wrapper, 1)).toBe(true);
  });

  it('受控模式：value 驱动选中态', async () => {
    const wrapper = mount(RadioGroup, { props: { options: options.slice(0, 2), value: 'a' } });
    expect(checkedOf(wrapper, 0)).toBe(true);

    // 外部未回写：视觉随组值回退（严格受控语义）
    await getInputs(wrapper)[1].setValue();
    expect(checkedOf(wrapper, 1)).toBe(false);

    await wrapper.setProps({ value: 'b' });
    expect(checkedOf(wrapper, 1)).toBe(true);
  });

  it('disabled 整组禁用：点击不触发 change', async () => {
    const wrapper = mount(RadioGroup, { props: { options: options.slice(0, 2), disabled: true } });
    await getInputs(wrapper)[1].setValue();
    expect(wrapper.emitted('change')).toBeUndefined();
  });

  it('options 中的单项 disabled 透传', () => {
    const wrapper = mount(RadioGroup, { props: { options } });
    expect((getInputs(wrapper)[2].element as HTMLInputElement).disabled).toBe(true);
    expect((getInputs(wrapper)[0].element as HTMLInputElement).disabled).toBe(false);
  });

  it('default 插槽渲染 Radio 子项', async () => {
    const wrapper = mount(RadioGroup, {
      global: { components: { Radio } },
      slots: { default: '<Radio value="x">X</Radio><Radio value="y">Y</Radio>' },
    });
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(2);
    await getInputs(wrapper)[0].setValue();
    expect(wrapper.emitted('change')![0]).toEqual(['x']);
  });
});
