import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import Modal from '../Modal.vue';

// Teleport 渲染到 body，测试结束后统一卸载、清理 teleport 内容
enableAutoUnmount(afterEach);

/** 在 document.body 上查找 teleport 后的元素 */
const query = <E extends Element = Element>(selector: string): E | null =>
  document.body.querySelector<E>(selector);

type OpenOptions = {
  props?: Record<string, unknown>;
  slots?: Record<string, string>;
};

/** 以 visible=false 挂载后通过 v-model 打开（走 watch 注册 keydown 的完整路径） */
const openModal = async ({ props = {}, slots }: OpenOptions = {}) => {
  const wrapper = mount(Modal, { props: { visible: false, ...props }, slots });
  await wrapper.setProps({ visible: true });
  await nextTick();
  return wrapper;
};

describe('Modal 组件（Vue 适配层）', () => {
  it('默认不可见：不渲染任何弹窗内容', () => {
    mount(Modal);

    expect(query('.xui-modal')).toBeNull();
  });

  it('visible 控制显隐（v-model:visible）', async () => {
    const wrapper = mount(Modal, { props: { visible: true } });
    await nextTick();

    expect(query('.xui-modal')).not.toBeNull();

    await wrapper.setProps({ visible: false });
    await nextTick();

    expect(query('.xui-modal')).toBeNull();
  });

  it('teleport 到 body：弹窗渲染在 document.body 下而非组件树内', async () => {
    const wrapper = await openModal();
    const modal = query('.xui-modal');

    expect(modal).not.toBeNull();
    expect(document.body.contains(modal)).toBe(true);
    expect(wrapper.element.contains(modal)).toBe(false);
  });

  it('遮罩点击关闭并 emit close / update:visible（close 无 source 载荷，与当前实现一致）', async () => {
    const wrapper = await openModal();

    query('.xui-modal__overlay')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('close')?.[0]).toHaveLength(0);
    expect(wrapper.emitted('update:visible')).toEqual([[false]]);
    expect(query('.xui-modal')).toBeNull();
  });

  it('maskClosable=false 时遮罩点击不关闭', async () => {
    const wrapper = await openModal({ props: { maskClosable: false } });

    query('.xui-modal__overlay')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(wrapper.emitted('close')).toBeUndefined();
    expect(query('.xui-modal')).not.toBeNull();
  });

  it('ESC 关闭：visible 打开后监听 document keydown', async () => {
    const wrapper = await openModal();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('update:visible')).toEqual([[false]]);
    expect(query('.xui-modal')).toBeNull();
  });

  it('closeOnEsc=false 时 ESC 不关闭', async () => {
    const wrapper = await openModal({ props: { closeOnEsc: false } });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(wrapper.emitted('close')).toBeUndefined();
    expect(query('.xui-modal')).not.toBeNull();
  });

  it('面板上按 ESC 也能触发关闭', async () => {
    const wrapper = await openModal();

    query<HTMLElement>('.xui-modal__panel')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('点击关闭按钮 emit close', async () => {
    const wrapper = await openModal();

    query<HTMLElement>('.xui-modal__close')!.click();
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(query('.xui-modal')).toBeNull();
  });

  it('closable=false 时不渲染关闭按钮', async () => {
    await openModal({ props: { closable: false } });

    expect(query('.xui-modal__close')).toBeNull();
  });

  it('默认 footer 渲染取消/确认按钮，点击确认 emit ok 并关闭', async () => {
    const wrapper = await openModal();
    const buttons = document.body.querySelectorAll('.xui-modal__footer button');

    expect(buttons).toHaveLength(2);

    (buttons[1] as HTMLElement).click();
    await nextTick();

    expect(wrapper.emitted('ok')).toHaveLength(1);
    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(query('.xui-modal')).toBeNull();
  });

  it('点击取消按钮 emit cancel 并关闭', async () => {
    const wrapper = await openModal();
    const buttons = document.body.querySelectorAll('.xui-modal__footer button');

    (buttons[0] as HTMLElement).click();
    await nextTick();

    expect(wrapper.emitted('cancel')).toHaveLength(1);
    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(query('.xui-modal')).toBeNull();
  });

  it('footer 插槽覆盖默认按钮', async () => {
    await openModal({
      slots: {
        footer: '<button class="custom-footer-btn">自定义操作</button>',
      },
    });

    expect(query('.custom-footer-btn')).not.toBeNull();
    expect(document.body.querySelectorAll('.xui-modal__footer button')).toHaveLength(1);
  });

  it('title 属性渲染默认标题', async () => {
    await openModal({ props: { title: '提示' } });

    expect(query('.xui-modal__title')?.textContent).toBe('提示');
  });

  it('title 插槽覆盖 title 属性', async () => {
    await openModal({
      props: { title: '提示' },
      slots: { title: '<b class="custom-title">自定义标题</b>' },
    });

    expect(query('.custom-title')?.textContent).toBe('自定义标题');
    expect(query('.xui-modal__title')).toBeNull();
  });

  it('default 插槽渲染正文内容', async () => {
    await openModal({ slots: { default: '<p class="body-content">正文内容</p>' } });

    expect(query('.body-content')?.textContent).toBe('正文内容');
  });

  it('width 为数字时按 px 渲染', async () => {
    await openModal({ props: { width: 400 } });

    expect(query<HTMLElement>('.xui-modal__panel')?.style.width).toBe('400px');
  });

  it('width 为字符串时原样渲染', async () => {
    await openModal({ props: { width: '80%' } });

    expect(query<HTMLElement>('.xui-modal__panel')?.style.width).toBe('80%');
  });

  it('关闭后内容被销毁（v-if 卸载，等效 destroyOnClose 行为）', async () => {
    const wrapper = await openModal({
      slots: { default: '<p class="modal-content">内容</p>' },
    });

    expect(query('.modal-content')).not.toBeNull();

    await wrapper.setProps({ visible: false });
    await nextTick();

    expect(query('.modal-content')).toBeNull();
  });

  it('ref 命令式 API：open/close 触发 open/close 事件（与 React ModalRef 对齐）', async () => {
    const wrapper = mount(Modal);

    expect(query('.xui-modal')).toBeNull();

    (wrapper.vm as unknown as { open: () => void }).open();
    await nextTick();

    expect(wrapper.emitted('open')).toHaveLength(1);
    expect(query('.xui-modal')).not.toBeNull();

    (wrapper.vm as unknown as { close: () => void }).close();
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(query('.xui-modal')).toBeNull();
  });
  it('okText / cancelText 自定义底部按钮文案', async () => {
    await openModal({ props: { okText: '好的', cancelText: '关闭' } });
    const buttons = document.body.querySelectorAll('.xui-modal__footer button');
    expect(buttons[0].textContent).toBe('关闭');
    expect(buttons[1].textContent).toBe('好的');
  });

  it('默认底部按钮文案为 取消/确认（向后兼容）', async () => {
    await openModal();
    const buttons = document.body.querySelectorAll('.xui-modal__footer button');
    expect(buttons[0].textContent).toBe('取消');
    expect(buttons[1].textContent).toBe('确认');
  });

  it('焦点陷阱：Tab 从最后一个可聚焦元素循环回第一个', async () => {
    await openModal();
    const panel = query<HTMLElement>('.xui-modal__panel')!;
    const closeBtn = query<HTMLElement>('.xui-modal__close')!;
    const footerButtons = document.body.querySelectorAll<HTMLElement>('.xui-modal__footer button');

    footerButtons[1].focus(); // 确认按钮（默认 footer 最后一个）
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(document.activeElement).toBe(closeBtn);
  });

  it('焦点陷阱：Shift+Tab 从第一个循环到最后一个', async () => {
    await openModal();
    const panel = query<HTMLElement>('.xui-modal__panel')!;
    const closeBtn = query<HTMLElement>('.xui-modal__close')!;
    const footerButtons = document.body.querySelectorAll<HTMLElement>('.xui-modal__footer button');

    closeBtn.focus();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true }));
    expect(document.activeElement).toBe(footerButtons[1]);
  });

  it('trapFocus=false 时不介入焦点循环', async () => {
    await openModal({ props: { trapFocus: false } });
    const panel = query<HTMLElement>('.xui-modal__panel')!;
    const footerButtons = document.body.querySelectorAll<HTMLElement>('.xui-modal__footer button');

    footerButtons[1].focus();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(document.activeElement).toBe(footerButtons[1]);
  });

  it('打开时聚焦面板，关闭后焦点恢复到打开前的元素', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const wrapper = await openModal();
    await nextTick();
    expect(query<HTMLElement>('.xui-modal__panel')?.contains(document.activeElement)).toBe(true);

    await wrapper.setProps({ visible: false });
    await nextTick();
    expect(document.activeElement).toBe(trigger);

    trigger.remove();
  });

  it('className / style 透传到对话框面板', async () => {
    await openModal({ props: { className: 'my-x', style: { color: 'red' } } });

    const panel = query<HTMLElement>('.xui-modal__panel')!;
    expect(panel.classList.contains('my-x')).toBe(true);
    expect(panel.style.color).toBe('red');
  });
});
