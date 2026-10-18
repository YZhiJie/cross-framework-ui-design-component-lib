import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import Upload from '../Upload.vue';
import type { UploadFile } from '@xui-design/core';

function makeFile(name: string): File {
  return new File(['content'], name, { type: 'text/plain' }) as unknown as File;
}

describe('Upload (Vue)', () => {
  it('渲染上传按钮', () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const wrapper = mount(Upload, { props: { action: '/upload', requestUpload } });
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('选择文件后显示文件列表项', async () => {
    let resolveUpload!: (v: { url: string }) => void;
    const requestUpload = vi.fn().mockReturnValue(
      new Promise<{ url: string }>((r) => {
        resolveUpload = r;
      }),
    );
    const wrapper = mount(Upload, { props: { action: '/upload', requestUpload } });

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', {
      value: [makeFile('report.txt')],
      configurable: true,
    });
    await input.trigger('change');
    await new Promise((r) => setTimeout(r, 50));

    expect(wrapper.text()).toContain('report.txt');
    resolveUpload({ url: 'http://x.com/report.txt' });
    await new Promise((r) => setTimeout(r, 50));
  });

  it('点击删除按钮移除文件', async () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const wrapper = mount(Upload, { props: { action: '/upload', requestUpload } });

    const input = wrapper.find('input[type="file"]');
    Object.defineProperty(input.element, 'files', {
      value: [makeFile('a.txt')],
      configurable: true,
    });
    await input.trigger('change');
    await new Promise((r) => setTimeout(r, 50));

    await wrapper.find('.xui-upload__remove').trigger('click');
    expect(wrapper.emitted('remove')).toBeTruthy();
  });

  it('disabled 时按钮禁用', () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const wrapper = mount(Upload, {
      props: { action: '/upload', requestUpload, disabled: true },
    });
    expect(wrapper.find('button').attributes('disabled')).toBe('');
  });

  it('受控 value 控制文件列表', () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const controlled: UploadFile[] = [
      {
        uid: '1',
        name: 'controlled.txt',
        size: 100,
        type: 'text/plain',
        status: 'done',
        percent: 100,
      },
    ];
    const wrapper = mount(Upload, {
      props: { action: '/upload', requestUpload, value: controlled },
    });
    expect(wrapper.text()).toContain('controlled.txt');
  });

  it('drag 形态：drop 事件收集文件并高亮悬停态', async () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const wrapper = mount(Upload, {
      props: { action: '/upload', requestUpload, drag: true, autoUpload: false },
    });
    const dropzone = wrapper.find('.xui-upload__drag');
    expect(dropzone.exists()).toBe(true);

    const file = new File(['a'], 'dropped.txt', { type: 'text/plain' });
    await dropzone.trigger('dragenter', {});
    expect(dropzone.classes()).toContain('is-dragover');

    await dropzone.trigger('drop', { dataTransfer: { files: [file] } });
    expect(wrapper.find('.xui-upload__drag').classes()).not.toContain('is-dragover');
    expect(wrapper.text()).toContain('dropped.txt');
  });

  it('drag 形态：默认文案与自定义 trigger 插槽', () => {
    const wrapper = mount(Upload, {
      props: { action: '/upload' },
      slots: { trigger: '<div class="my-trigger">自定义</div>' },
    });
    expect(wrapper.find('.xui-upload__drag').exists()).toBe(false);
    expect(wrapper.find('.my-trigger').exists()).toBe(true);
  });
});
