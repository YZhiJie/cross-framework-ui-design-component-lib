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
      percent += 25;
      options.onProgress(Math.min(percent, 100));
      if (percent >= 100) {
        clearInterval(timer);
        resolve({ url: `https://example.com/${file.name}` });
      }
    }, 200);
  });

// 仅允许图片类型
const beforeUpload = (file: File) => file.type.startsWith('image/');

export default function UploadStateDemo() {
  const isZh = useIsZh();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  return (
    <div className="demo-column">
      <Upload
        value={fileList}
        onChange={setFileList}
        action="/upload"
        requestUpload={mockRequest}
        listType="picture"
        accept="image/*"
        maxCount={3}
        beforeUpload={beforeUpload}
      />
      <p className="demo-text">
        {isZh
          ? 'listType="picture" 图片列表；accept 限制图片；maxCount=3；beforeUpload 校验类型'
          : 'listType="picture" image list; accept restricts to images; maxCount=3; beforeUpload validates type'}
      </p>
    </div>
  );
}
