import { useState } from 'react';
import { Upload } from '@xui-design/react';
import type { UploadFile } from '@xui-design/core';

// 模拟上传：随机进度，80% 成功
const mockRequest = (
  file: UploadFile,
  options: { onProgress: (p: number) => void; signal?: AbortSignal },
) =>
  new Promise<{ url?: string; response?: unknown }>((resolve, reject) => {
    let percent = 0;
    const timer = setInterval(() => {
      if (options.signal?.aborted) {
        clearInterval(timer);
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      percent += Math.random() * 20 + 5;
      if (percent >= 100) {
        clearInterval(timer);
        if (Math.random() > 0.2) {
          resolve({ url: `https://example.com/${file.name}`, response: { ok: true } });
        } else {
          reject(new Error('模拟上传失败'));
        }
      }
      options.onProgress(Math.min(Math.round(percent), 100));
    }, 300);
  });

export default function UploadManualDemo() {
  const [value, setValue] = useState<UploadFile[]>([]);

  return (
    <div className="demo-column">
      <Upload
        value={value}
        onChange={setValue}
        action="/upload"
        multiple
        autoUpload={false}
        requestUpload={mockRequest}
      />
      <p className="demo-text">
        autoUpload=false：选中文件后进入「待上传」状态，点击「开始上传」手动触发。
      </p>
    </div>
  );
}
