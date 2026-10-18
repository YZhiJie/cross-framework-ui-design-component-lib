import { useState } from 'react';
import { Upload } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function UploadDragDemo() {
  const isZh = useIsZh();
  const [doneCount, setDoneCount] = useState(0);

  const requestUpload = (file: { name: string }) =>
    new Promise<{ url: string }>((resolve) => {
      setTimeout(() => resolve({ url: `/mock/${encodeURIComponent(file.name)}` }), 600);
    });

  return (
    <div className="demo-column">
      <Upload
        action="/upload"
        requestUpload={requestUpload}
        drag
        multiple
        accept="image/*,.pdf"
        onChange={() => setDoneCount((v) => v + 1)}
      />
      <p className="demo-text">
        {isZh
          ? `已完成上传：${doneCount} 个文件（accept 限定图片与 PDF）`
          : `Uploaded: ${doneCount} (images and PDF only)`}
      </p>
    </div>
  );
}
