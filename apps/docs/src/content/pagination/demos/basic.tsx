import { useState } from 'react';
import { Pagination } from '@xui/react';

export default function PaginationBasicDemo() {
  const [page, setPage] = useState(3);

  return (
    <div className="demo-column">
      <Pagination value={page} onChange={setPage} total={285} />
      <p className="demo-text">第 {page} 页 / 共 29 页（每页 10 条，共 285 条）</p>
    </div>
  );
}
