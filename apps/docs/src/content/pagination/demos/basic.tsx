import { useState } from 'react';
import { Pagination } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function PaginationBasicDemo() {
  const isZh = useIsZh();
  const [page, setPage] = useState(3);

  return (
    <div className="demo-column">
      <Pagination value={page} onChange={setPage} total={285} />
      <p className="demo-text">
        {isZh
          ? `第 ${page} 页 / 共 29 页（每页 10 条，共 285 条）`
          : `Page ${page} / 29 pages (10 per page, 285 total)`}
      </p>
    </div>
  );
}
