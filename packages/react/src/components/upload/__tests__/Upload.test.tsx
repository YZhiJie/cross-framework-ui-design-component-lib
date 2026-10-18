import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { Upload } from '../Upload';
import type { UploadFile } from '@xui-design/core';

afterEach(() => {
  cleanup();
});

function makeFile(name: string): File {
  return new File(['content'], name, { type: 'text/plain' }) as unknown as File;
}

describe('Upload (React)', () => {
  it('渲染上传按钮', () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    render(<Upload action="/upload" requestUpload={requestUpload} />);
    expect(screen.getByRole('button', { name: /上传/ })).toBeInTheDocument();
  });

  it('选择文件后显示文件列表项', async () => {
    let resolveUpload!: (v: { url: string }) => void;
    const requestUpload = vi.fn().mockReturnValue(
      new Promise<{ url: string }>((r) => {
        resolveUpload = r;
      }),
    );
    const onChange = vi.fn();

    render(<Upload action="/upload" requestUpload={requestUpload} onChange={onChange} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile('report.txt');
    Object.defineProperty(input, 'files', {
      value: [file],
      configurable: true,
    });
    fireEvent.change(input);

    // 等待异步 selectFiles
    await new Promise((r) => setTimeout(r, 50));

    expect(screen.getByText('report.txt')).toBeInTheDocument();
    resolveUpload({ url: 'http://x.com/report.txt' });
    await new Promise((r) => setTimeout(r, 50));
  });

  it('点击删除按钮移除文件', async () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const onRemove = vi.fn();

    render(<Upload action="/upload" requestUpload={requestUpload} onRemove={onRemove} />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    Object.defineProperty(input, 'files', {
      value: [makeFile('a.txt')],
      configurable: true,
    });
    fireEvent.change(input);
    await new Promise((r) => setTimeout(r, 50));

    const removeBtn = screen.getByLabelText('remove');
    fireEvent.click(removeBtn);

    expect(onRemove).toHaveBeenCalled();
  });

  it('disabled 时按钮不可点击', () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    render(<Upload action="/upload" requestUpload={requestUpload} disabled />);
    const btn = screen.getByRole('button', { name: /上传/ });
    expect(btn).toBeDisabled();
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
    render(<Upload action="/upload" requestUpload={requestUpload} value={controlled} />);
    expect(screen.getByText('controlled.txt')).toBeInTheDocument();
  });
});
