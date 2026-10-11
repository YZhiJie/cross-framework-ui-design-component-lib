import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import InputNumber from '../InputNumber.vue';

/** 提交辅助：设置输入文本并触发 change（真实浏览器 blur 时派发 change） */
async function commitInput(wrapper: ReturnType<typeof mount>, text: string) {
  const input = wrapper.find('input');
  await input.setValue(text);
  await input.trigger('change');
}

describe('InputNumber (vue)', () => {
  it('渲染 spinbutton + 上下步进按钮，空值无 aria-valuenow', () => {
    const wrapper = mount(InputNumber);
    const input = wrapper.find('input');
    expect(input.attributes('role')).toBe('spinbutton');
    expect(input.attributes('aria-valuenow')).toBeUndefined();
    const btns = wrapper.findAll('.xui-input-number__btn');
    expect(btns).toHaveLength(2);
  });

  it('defaultValue 显示初始值', () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 5 } });
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('5');
    expect(wrapper.find('input').attributes('aria-valuenow')).toBe('5');
  });

  it('输入合法数字提交：change 载荷 + 显示对齐', async () => {
    const wrapper = mount(InputNumber);
    await commitInput(wrapper, '42');
    expect(wrapper.emitted('change')?.[0]).toEqual([42]);
    expect(wrapper.emitted('update:value')?.[0]).toEqual([42]);
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('42');
  });

  it('非法输入提交回退 null（显示清空）', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 5 } });
    await commitInput(wrapper, 'abc');
    expect(wrapper.emitted('change')?.[0]).toEqual([null]);
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('');
  });

  it('清空提交 change(null)', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 5 } });
    await commitInput(wrapper, '');
    expect(wrapper.emitted('change')?.[0]).toEqual([null]);
  });

  it('上按钮步进 + change 事件', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 5 } });
    await wrapper.findAll('.xui-input-number__btn')[0].trigger('click');
    expect(wrapper.emitted('change')?.[0]).toEqual([6]);
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('6');
  });

  it('键盘 ArrowUp / ArrowDown 步进', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 5 } });
    await wrapper.find('input').trigger('keydown.up');
    expect(wrapper.emitted('change')?.[0]).toEqual([6]);
    await wrapper.find('input').trigger('keydown.down');
    expect(wrapper.emitted('change')?.[1]).toEqual([5]);
  });

  it('越界 clamp：到边界后重复步进不再触发 change', async () => {
    const wrapper = mount(InputNumber, { props: { defaultValue: 9, max: 10 } });
    await wrapper.findAll('.xui-input-number__btn')[0].trigger('click');
    expect(wrapper.emitted('change')).toHaveLength(1);
    await wrapper.findAll('.xui-input-number__btn')[0].trigger('click');
    expect(wrapper.emitted('change')).toHaveLength(1);
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('10');
  });

  it('precision 显示固定小数位', async () => {
    const wrapper = mount(InputNumber, { props: { precision: 2 } });
    await commitInput(wrapper, '3.1');
    expect(wrapper.emitted('change')?.[0]).toEqual([3.1]);
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('3.10');
  });

  it('disabled：输入与按钮禁用，步进无效', async () => {
    const wrapper = mount(InputNumber, {
      props: { defaultValue: 5, disabled: true },
    });
    expect(wrapper.find('.xui-input-number').classes()).toContain('is-disabled');
    expect(wrapper.find('input').attributes('disabled')).toBeDefined();
    await wrapper.findAll('.xui-input-number__btn')[0].trigger('click');
    expect(wrapper.emitted('change')).toBeUndefined();
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('5');
  });

  it('受控模式：提交仅回调，props 更新驱动显示', async () => {
    const wrapper = mount(InputNumber, { props: { value: 5 } });
    await commitInput(wrapper, '7');
    expect(wrapper.emitted('change')?.[0]).toEqual([7]);
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('5');
    await wrapper.setProps({ value: 7 });
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('7');
  });

  it('placeholder 生效', () => {
    const wrapper = mount(InputNumber, { props: { placeholder: '请输入数量' } });
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入数量');
  });

  it('className / style 透传到根节点', () => {
    const wrapper = mount(InputNumber, {
      props: { className: 'my-x', style: { color: 'red' } },
    });
    expect(wrapper.find('.xui-input-number').classes()).toContain('my-x');
    expect(wrapper.find('.xui-input-number').attributes('style')).toContain('color: red');
  });
});
