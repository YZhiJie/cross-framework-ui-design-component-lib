import { nextTick } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { enableAutoUnmount, mount } from '@vue/test-utils';
import { DRAWER_TRANSITION_DURATION } from '@xui-design/shared';
import Drawer from '../Drawer.vue';

// Teleport 渲染到 body，测试结束后统一卸载、清理 teleport 内容
enableAutoUnmount(afterEach);

/** 等待退场动画播完、DOM 真正卸载 */
const flushLeave = async () => {
  await new Promise((resolve) => setTimeout(resolve, DRAWER_TRANSITION_DURATION + 16));
  await nextTick();
};

/** 在 document.body 上查找 teleport 后的元素 */
const query = <E extends Element = Element>(selector: string): E | null =>
  document.body.querySelector<E>(selector);

type OpenOptions = {
  props?: Record<string, unknown>;
  slots?: Record<string, string>;
};

/** 以 visible=false 挂载后通过 v-model 打开（走 watch 注册 keydown 的完整路径） */
const openDrawer = async ({ props = {}, slots }: OpenOptions = {}) => {
  const wrapper = mount(Drawer, { props: { visible: false, ...props }, slots });
  await wrapper.setProps({ visible: true });
  await nextTick();
  return wrapper;
};

describe('Drawer 组件（Vue 适配层）', () => {
  it('默认不可见：不渲染任何抽屉内容', () => {
    mount(Drawer);

    expect(query('.xui-drawer')).toBeNull();
  });

  it('visible 控制显隐（v-model:visible）', async () => {
    const wrapper = mount(Drawer, { props: { visible: true } });
    await nextTick();

    expect(query('.xui-drawer')).not.toBeNull();

    await wrapper.setProps({ visible: false });
    await nextTick();

    // 先播放退场动画，动画结束后才卸载
    expect(query('.xui-drawer')?.classList.contains('is-leaving')).toBe(true);

    await flushLeave();
    expect(query('.xui-drawer')).toBeNull();
  });

  it('退场动画期间重新打开会取消卸载', async () => {
    const wrapper = mount(Drawer, { props: { visible: true } });
    await nextTick();

    await wrapper.setProps({ visible: false });
    await nextTick();
    expect(query('.xui-drawer')?.classList.contains('is-leaving')).toBe(true);

    await wrapper.setProps({ visible: true });
    await nextTick();
    expect(query('.xui-drawer')?.classList.contains('is-leaving')).toBe(false);

    await flushLeave();
    expect(query('.xui-drawer')).not.toBeNull();
  });

  it('teleport 到 body：抽屉渲染在 document.body 下而非组件树内', async () => {
    const wrapper = await openDrawer();
    const drawer = query('.xui-drawer');

    expect(drawer).not.toBeNull();
    expect(document.body.contains(drawer)).toBe(true);
    expect(wrapper.element.contains(drawer)).toBe(false);
  });

  it('placement 渲染对应方向类名，默认 right', async () => {
    await openDrawer();
    expect(query('.xui-drawer--right')).not.toBeNull();

    await openDrawer({ props: { placement: 'left' } });
    expect(query('.xui-drawer--left')).not.toBeNull();

    await openDrawer({ props: { placement: 'top' } });
    expect(query('.xui-drawer--top')).not.toBeNull();

    await openDrawer({ props: { placement: 'bottom' } });
    expect(query('.xui-drawer--bottom')).not.toBeNull();
  });

  it('size 数字按 px 渲染：左右方向为宽度', async () => {
    await openDrawer({ props: { size: 400 } });

    expect(query<HTMLElement>('.xui-drawer__panel')?.style.width).toBe('400px');
  });

  it('size 字符串原样渲染：上下方向为高度', async () => {
    await openDrawer({ props: { placement: 'top', size: '50%' } });

    expect(query<HTMLElement>('.xui-drawer__panel')?.style.height).toBe('50%');
  });

  it('默认 size 为 378', async () => {
    await openDrawer();

    expect(query<HTMLElement>('.xui-drawer__panel')?.style.width).toBe('378px');
  });

  it('遮罩点击关闭并 emit close / update:visible', async () => {
    const wrapper = await openDrawer();

    query('.xui-drawer__overlay')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('update:visible')).toEqual([[false]]);
    await flushLeave();
    expect(query('.xui-drawer')).toBeNull();
  });

  it('maskClosable=false 时遮罩点击不关闭', async () => {
    const wrapper = await openDrawer({ props: { maskClosable: false } });

    query('.xui-drawer__overlay')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(wrapper.emitted('close')).toBeUndefined();
    expect(query('.xui-drawer')).not.toBeNull();
  });

  it('mask=false 时不渲染遮罩', async () => {
    await openDrawer({ props: { mask: false } });

    expect(query('.xui-drawer__overlay')).toBeNull();
    expect(query('.xui-drawer__panel')).not.toBeNull();
  });

  it('ESC 关闭：visible 打开后监听 document keydown', async () => {
    const wrapper = await openDrawer();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('update:visible')).toEqual([[false]]);
    await flushLeave();
    expect(query('.xui-drawer')).toBeNull();
  });

  it('closeOnEsc=false 时 ESC 不关闭', async () => {
    const wrapper = await openDrawer({ props: { closeOnEsc: false } });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await nextTick();

    expect(wrapper.emitted('close')).toBeUndefined();
    expect(query('.xui-drawer')).not.toBeNull();
  });

  it('面板上按 ESC 也能触发关闭', async () => {
    const wrapper = await openDrawer();

    query<HTMLElement>('.xui-drawer__panel')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('点击关闭按钮 emit close', async () => {
    const wrapper = await openDrawer();

    query<HTMLElement>('.xui-drawer__close')!.click();
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
    await flushLeave();
    expect(query('.xui-drawer')).toBeNull();
  });

  it('closable=false 时不渲染关闭按钮', async () => {
    await openDrawer({ props: { closable: false } });

    expect(query('.xui-drawer__close')).toBeNull();
  });

  it('title 属性渲染默认标题', async () => {
    await openDrawer({ props: { title: '详情' } });

    expect(query('.xui-drawer__title')?.textContent).toBe('详情');
  });

  it('title 插槽覆盖 title 属性', async () => {
    await openDrawer({
      props: { title: '详情' },
      slots: { title: '<b class="custom-title">自定义标题</b>' },
    });

    expect(query('.custom-title')?.textContent).toBe('自定义标题');
    expect(query('.xui-drawer__title')).toBeNull();
  });

  it('default 插槽渲染正文内容', async () => {
    await openDrawer({ slots: { default: '<p class="body-content">正文内容</p>' } });

    expect(query('.body-content')?.textContent).toBe('正文内容');
  });

  it('footer 插槽渲染底部操作区，未提供时不渲染 footer 容器', async () => {
    await openDrawer();
    expect(query('.xui-drawer__footer')).toBeNull();

    await openDrawer({
      slots: { footer: '<button class="custom-footer-btn">提交</button>' },
    });
    expect(query('.xui-drawer__footer')).not.toBeNull();
    expect(query('.custom-footer-btn')?.textContent).toBe('提交');
  });

  it('关闭后内容被销毁（v-if 卸载）', async () => {
    const wrapper = await openDrawer({
      slots: { default: '<p class="drawer-content">内容</p>' },
    });

    expect(query('.drawer-content')).not.toBeNull();

    await wrapper.setProps({ visible: false });
    await nextTick();
    await flushLeave();

    expect(query('.drawer-content')).toBeNull();
  });

  it('ref 命令式 API：open/close/toggle 触发 open/close 事件（与 React DrawerRef 对齐）', async () => {
    const wrapper = mount(Drawer);

    expect(query('.xui-drawer')).toBeNull();

    (wrapper.vm as unknown as { open: () => void }).open();
    await nextTick();

    expect(wrapper.emitted('open')).toHaveLength(1);
    expect(query('.xui-drawer')).not.toBeNull();

    (wrapper.vm as unknown as { toggle: () => void }).toggle();
    await nextTick();

    expect(wrapper.emitted('close')).toHaveLength(1);
    await flushLeave();
    expect(query('.xui-drawer')).toBeNull();
  });

  it('焦点陷阱：Tab 从最后一个可聚焦元素循环回第一个', async () => {
    await openDrawer({
      slots: { footer: '<button class="f-btn">提交</button>' },
    });
    const panel = query<HTMLElement>('.xui-drawer__panel')!;
    const closeBtn = query<HTMLElement>('.xui-drawer__close')!;
    const footerBtn = query<HTMLElement>('.f-btn')!;

    footerBtn.focus();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(document.activeElement).toBe(closeBtn);
  });

  it('trapFocus=false 时不介入焦点循环', async () => {
    await openDrawer({
      props: { trapFocus: false },
      slots: { footer: '<button class="f-btn">提交</button>' },
    });
    const panel = query<HTMLElement>('.xui-drawer__panel')!;
    const footerBtn = query<HTMLElement>('.f-btn')!;

    footerBtn.focus();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
    expect(document.activeElement).toBe(footerBtn);
  });

  it('打开时聚焦面板，关闭后焦点恢复到打开前的元素', async () => {
    const trigger = document.createElement('button');
    document.body.appendChild(trigger);
    trigger.focus();

    const wrapper = await openDrawer();
    await nextTick();
    expect(query<HTMLElement>('.xui-drawer__panel')?.contains(document.activeElement)).toBe(true);

    await wrapper.setProps({ visible: false });
    await nextTick();
    expect(document.activeElement).toBe(trigger);

    trigger.remove();
  });

  it('className / style 透传到抽屉面板', async () => {
    await openDrawer({ props: { className: 'my-x', style: { color: 'red' } } });

    const panel = query<HTMLElement>('.xui-drawer__panel')!;
    expect(panel.classList.contains('my-x')).toBe(true);
    expect(panel.style.color).toBe('red');
  });

  it('closeIcon 插槽替换内置关闭图标', async () => {
    await openDrawer({ slots: { closeIcon: '<i class="my-close-x">x</i>' } });

    const close = query<HTMLElement>('.xui-drawer__close')!;
    expect(close.querySelector('.my-close-x')).not.toBeNull();
    expect(close.querySelector('svg')).toBeNull();
  });
});
