import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';
import Form from '../Form.vue';
import FormItem from '../FormItem.vue';
import Input from '../../input/Input.vue';

const createDemo = () =>
  defineComponent({
    components: { Form, FormItem, Input },
    setup() {
      const formRef = ref<InstanceType<typeof Form> | null>(null);
      return { formRef };
    },
    template: `
      <Form ref="formRef" :initial-values="{ email: '' }">
        <FormItem name="email" label="Email">
          <Input placeholder="Enter email" />
        </FormItem>
      </Form>
    `,
  });

describe('FormItem 组件（Vue 适配层）', () => {
  it('输入值写入表单状态并触发 valuesChange', async () => {
    const wrapper = mount(createDemo(), { attachTo: document.body });
    const input = wrapper.find('input');

    await input.setValue('abc');

    expect(wrapper.findComponent(Form).emitted('valuesChange')).toBeTruthy();
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('abc');
    wrapper.unmount();
  });

  it('输入过程中 input 元素不被重建且焦点不丢失', async () => {
    const wrapper = mount(createDemo(), { attachTo: document.body });
    const el = wrapper.find('input').element as HTMLInputElement;

    el.focus();
    expect(document.activeElement).toBe(el);

    await wrapper.find('input').setValue('a');

    // 受控值回灌不应重挂载子树：元素引用不变、焦点保留
    expect(wrapper.find('input').element).toBe(el);
    expect(document.activeElement).toBe(el);
    wrapper.unmount();
  });

  it('外部 setFieldValue 同步更新输入框显示值', async () => {
    const wrapper = mount(createDemo(), { attachTo: document.body });

    wrapper.vm.formRef?.setFieldValue('email', 'xyz');
    await nextTick();

    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('xyz');
    wrapper.unmount();
  });
});
