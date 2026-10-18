import { describe, expect, it, vi } from 'vitest';

import { createUploadLogic } from '../create-upload-logic';
import type { UploadFile } from '../create-upload-logic';

function makeFile(overrides: Partial<File> = {}): File {
  return {
    name: 'test.txt',
    size: 1024,
    type: 'text/plain',
    lastModified: Date.now(),
    ...overrides,
  } as File;
}

describe('createUploadLogic', () => {
  it('初始化空文件列表', () => {
    const logic = createUploadLogic({ action: '/upload' });
    expect(logic.getState().fileList).toEqual([]);
  });

  it('setDragOver 管理拖拽悬停态，disabled 恒为 false', () => {
    const logic = createUploadLogic({ action: '/upload' });
    expect(logic.getState().dragOver).toBe(false);
    logic.setDragOver(true);
    expect(logic.getState().dragOver).toBe(true);
    logic.setDragOver(false);
    expect(logic.getState().dragOver).toBe(false);
    logic.updateOptions({ disabled: true });
    logic.setDragOver(true);
    expect(logic.getState().dragOver).toBe(false);
  });

  it('selectFiles 添加文件并进入 uploading 状态', async () => {
    let resolveUpload!: (v: { url: string }) => void;
    const requestUpload = vi.fn().mockReturnValue(
      new Promise<{ url: string }>((r) => {
        resolveUpload = r;
      }),
    );
    const logic = createUploadLogic({ action: '/upload', requestUpload });
    const file = makeFile();

    await logic.selectFiles([file]);

    const { fileList } = logic.getState();
    expect(fileList).toHaveLength(1);
    expect(fileList[0].name).toBe('test.txt');
    expect(fileList[0].status).toBe('uploading');
    expect(fileList[0].raw).toBe(file);

    // 完成上传
    resolveUpload({ url: 'http://x.com/a.txt' });
    await new Promise((r) => setTimeout(r, 10));
    expect(logic.getState().fileList[0].status).toBe('done');
  });

  it('上传成功后 status=done percent=100', async () => {
    const requestUpload = vi.fn().mockImplementation((_f, { onProgress }) => {
      onProgress(50);
      return Promise.resolve({ url: 'http://x.com/a.txt', response: { ok: true } });
    });
    const logic = createUploadLogic({ action: '/upload', requestUpload });

    await logic.selectFiles([makeFile()]);
    // 等待异步上传完成
    await new Promise((r) => setTimeout(r, 10));

    const { fileList } = logic.getState();
    expect(fileList[0].status).toBe('done');
    expect(fileList[0].percent).toBe(100);
    expect(fileList[0].url).toBe('http://x.com/a.txt');
  });

  it('上传失败后 status=error', async () => {
    const requestUpload = vi.fn().mockRejectedValue(new Error('network error'));
    const logic = createUploadLogic({ action: '/upload', requestUpload });

    await logic.selectFiles([makeFile()]);
    await new Promise((r) => setTimeout(r, 10));

    const { fileList } = logic.getState();
    expect(fileList[0].status).toBe('error');
  });

  it('maxCount 限制文件数量', async () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const logic = createUploadLogic({ action: '/upload', requestUpload, maxCount: 2 });

    await logic.selectFiles([
      makeFile({ name: 'a' }),
      makeFile({ name: 'b' }),
      makeFile({ name: 'c' }),
    ]);
    await new Promise((r) => setTimeout(r, 10));

    expect(logic.getState().fileList).toHaveLength(2);
  });

  it('maxSize 超限文件标记 error 不上传', async () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const logic = createUploadLogic({ action: '/upload', requestUpload, maxSize: 500 });

    await logic.selectFiles([makeFile({ size: 1000 })]);
    await new Promise((r) => setTimeout(r, 10));

    const { fileList } = logic.getState();
    expect(fileList[0].status).toBe('error');
    expect(requestUpload).not.toHaveBeenCalled();
  });

  it('beforeUpload 返回 false 则跳过', async () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const beforeUpload = vi.fn().mockReturnValue(false);
    const logic = createUploadLogic({ action: '/upload', requestUpload, beforeUpload });

    await logic.selectFiles([makeFile()]);

    expect(logic.getState().fileList).toHaveLength(0);
    expect(beforeUpload).toHaveBeenCalled();
    expect(requestUpload).not.toHaveBeenCalled();
  });

  it('beforeUpload 返回 Promise<false> 则跳过', async () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const beforeUpload = vi.fn().mockResolvedValue(false);
    const logic = createUploadLogic({ action: '/upload', requestUpload, beforeUpload });

    await logic.selectFiles([makeFile()]);
    await new Promise((r) => setTimeout(r, 10));

    expect(logic.getState().fileList).toHaveLength(0);
  });

  it('remove 删除文件并触发 onRemove', async () => {
    const onRemove = vi.fn();
    const requestUpload = vi.fn().mockResolvedValue({});
    const logic = createUploadLogic({ action: '/upload', requestUpload, onRemove });

    await logic.selectFiles([makeFile({ name: 'a' }), makeFile({ name: 'b' })]);
    await new Promise((r) => setTimeout(r, 10));

    const { fileList } = logic.getState();
    const firstUid = fileList[0].uid;
    logic.remove(firstUid);

    expect(logic.getState().fileList).toHaveLength(1);
    expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ uid: firstUid }));
  });

  it('clear 清空所有文件', async () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const logic = createUploadLogic({ action: '/upload', requestUpload });

    await logic.selectFiles([makeFile(), makeFile()]);
    await new Promise((r) => setTimeout(r, 10));

    expect(logic.getState().fileList).toHaveLength(2);
    logic.clear();
    expect(logic.getState().fileList).toHaveLength(0);
  });

  it('受控模式：selectFiles 仍更新内部列表以跟踪上传，并通过 onChange 通知外部', async () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const onChange = vi.fn();
    const controlled: UploadFile[] = [];
    const logic = createUploadLogic({
      action: '/upload',
      requestUpload,
      value: controlled,
      onChange,
    });

    await logic.selectFiles([makeFile()]);
    await new Promise((r) => setTimeout(r, 10));

    // 受控模式下内部列表会临时加入文件以跟踪上传状态
    expect(logic.getState().fileList.length).toBe(1);
    // onChange 被触发，外部据此同步 value
    expect(onChange).toHaveBeenCalled();
  });

  it('onChange 在文件列表变化时触发', async () => {
    const onChange = vi.fn();
    const requestUpload = vi.fn().mockResolvedValue({});
    const logic = createUploadLogic({ action: '/upload', requestUpload, onChange });

    await logic.selectFiles([makeFile()]);
    expect(onChange).toHaveBeenCalled();
  });

  it('disabled 时 selectFiles 无效', async () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const logic = createUploadLogic({ action: '/upload', requestUpload, disabled: true });

    await logic.selectFiles([makeFile()]);
    expect(logic.getState().fileList).toHaveLength(0);
    expect(requestUpload).not.toHaveBeenCalled();
  });

  it('autoUpload=false 时文件 pending，submit 后才发起上传', async () => {
    const requestUpload = vi.fn().mockResolvedValue({ url: 'http://x.com/a.txt' });
    const logic = createUploadLogic({ action: '/upload', autoUpload: false, requestUpload });

    await logic.selectFiles([makeFile()]);
    expect(logic.getState().fileList[0].status).toBe('pending');
    expect(requestUpload).not.toHaveBeenCalled();

    logic.submit();
    expect(requestUpload).toHaveBeenCalledTimes(1);
    await new Promise((r) => setTimeout(r, 10));
    expect(logic.getState().fileList[0].status).toBe('done');
  });

  it('submit 仅上传 pending 文件，disabled 时忽略', async () => {
    const requestUpload = vi.fn().mockResolvedValue({ url: 'http://x.com/a.txt' });
    const logic = createUploadLogic({ action: '/upload', autoUpload: false, requestUpload });

    await logic.selectFiles([makeFile({ name: 'a.txt' }), makeFile({ name: 'b.txt' })]);
    // 标记第一个为 done（模拟已上传），submit 只应上传第二个
    const firstUid = logic.getState().fileList[0].uid;
    logic.remove(firstUid);
    await logic.selectFiles([makeFile({ name: 'c.txt' })]);
    logic.submit();
    expect(requestUpload).toHaveBeenCalledTimes(2);

    const disabledLogic = createUploadLogic({
      action: '/upload',
      autoUpload: false,
      requestUpload,
      disabled: true,
    });
    disabledLogic.submit();
    expect(requestUpload).toHaveBeenCalledTimes(2);
  });

  it('cancel 中断上传：状态变为 cancelled，速率信息清空', async () => {
    let rejectUpload!: (err: unknown) => void;
    const requestUpload = vi.fn().mockReturnValue(
      new Promise<{ url: string }>((_resolve, reject) => {
        rejectUpload = reject;
      }),
    );
    const logic = createUploadLogic({ action: '/upload', requestUpload });

    await logic.selectFiles([makeFile()]);
    const uid = logic.getState().fileList[0].uid;
    expect(logic.getState().fileList[0].status).toBe('uploading');

    logic.cancel(uid);
    // 模拟 XHR abort 触发的 AbortError 拒绝
    rejectUpload(new DOMException('The user aborted a request.', 'AbortError'));
    await new Promise((r) => setTimeout(r, 10));

    const file = logic.getState().fileList[0];
    expect(file.status).toBe('cancelled');
    expect(file.speed).toBeUndefined();
    expect(file.remainingTime).toBeUndefined();
  });

  it('cancel 对非 uploading 状态或未知 uid 忽略', async () => {
    const requestUpload = vi.fn().mockResolvedValue({ url: 'http://x.com/a.txt' });
    const logic = createUploadLogic({ action: '/upload', requestUpload });

    await logic.selectFiles([makeFile()]);
    await new Promise((r) => setTimeout(r, 10));
    const uid = logic.getState().fileList[0].uid;
    expect(logic.getState().fileList[0].status).toBe('done');

    // done 状态取消无效
    logic.cancel(uid);
    expect(logic.getState().fileList[0].status).toBe('done');
    // 未知 uid 不抛错
    logic.cancel('not-exists');
  });

  it('move 排序交换文件顺序，越界与未知 uid 忽略', async () => {
    const requestUpload = vi.fn().mockResolvedValue({});
    const logic = createUploadLogic({ action: '/upload', autoUpload: false, requestUpload });

    await logic.selectFiles([
      makeFile({ name: 'a.txt' }),
      makeFile({ name: 'b.txt' }),
      makeFile({ name: 'c.txt' }),
    ]);
    const names = () => logic.getState().fileList.map((f) => f.name);
    const uidOf = (i: number) => logic.getState().fileList[i].uid;

    logic.move(uidOf(0), 1);
    expect(names()).toEqual(['b.txt', 'a.txt', 'c.txt']);

    logic.move(uidOf(2), -1);
    expect(names()).toEqual(['b.txt', 'c.txt', 'a.txt']);

    // 越界忽略
    logic.move(uidOf(0), -1);
    expect(names()).toEqual(['b.txt', 'c.txt', 'a.txt']);
    logic.move(uidOf(2), 1);
    expect(names()).toEqual(['b.txt', 'c.txt', 'a.txt']);
    // 未知 uid 不抛错
    logic.move('not-exists', 1);
    expect(names()).toEqual(['b.txt', 'c.txt', 'a.txt']);
  });

  it('上传进度回调计算速率与剩余时间', async () => {
    const nowSpy = vi.spyOn(Date, 'now');
    let t = 1_000;
    nowSpy.mockImplementation(() => t);

    let resolveUpload!: (v: { url: string }) => void;
    const requestUpload = vi.fn().mockImplementation((_f, { onProgress }) => {
      // 第 1 秒：25%（256/1024 B）
      onProgress(25);
      // 第 3 秒：75%（2 秒传了 512B → 256B/s，剩余 256B → 1s）
      t += 2_000;
      onProgress(75);
      // 保持悬置，断言中途进度后再手动解决
      return new Promise<{ url: string }>((r) => {
        resolveUpload = r;
      });
    });
    const logic = createUploadLogic({ action: '/upload', requestUpload });

    await logic.selectFiles([makeFile({ size: 1024 })]);
    const file = logic.getState().fileList[0];
    expect(file.percent).toBe(75);
    expect(file.speed).toBe(256);
    expect(file.remainingTime).toBe(1);

    resolveUpload({ url: 'http://x.com/a.txt' });
    await new Promise((r) => setTimeout(r, 10));
    // 完成后速率信息清空
    expect(logic.getState().fileList[0].speed).toBeUndefined();
    nowSpy.mockRestore();
  });
});
