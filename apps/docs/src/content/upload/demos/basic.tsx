import { useState } from 'react';
import { Upload } from '@xui-design/react';
import type { UploadFile } from '@xui-design/core';
import { useIsZh } from '../../../i18n/use-docs-locale';

const mockRequest = (
  file: UploadFile,
  options: { action: string; onProgress: (percent: number) => void },
) =>
  new Promise<{ url: string }>((resolve) => {
    let percent = 0;
    const timer = setInterval(() => {
      percent += 20;
      options.onProgress(Math.min(percent, 100));
      if (percent >= 100) {
        clearInterval(timer);
        resolve({ url: `https://example.com/${file.name}` });
      }
    }, 200);
  });

export default function UploadBasicDemo() {
  const isZh = useIsZh();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  return (
    <div className="demo-column">
      <Upload
        value={fileList}
        onChange={setFileList}
        action="/upload"
        requestUpload={mockRequest}
        multiple
      />
      <p className="demo-text">
        {isZh ? `文件数：${fileList.length}` : `File count: ${fileList.length}`}
      </p>
    </div>
  );
}
