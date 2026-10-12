import { Pagination } from '@xui-design/react';

export default function PaginationVariantsDemo() {
  return (
    <div className="demo-column">
      <Pagination defaultValue={1} total={80} pageSize={20} />
      <Pagination defaultValue={2} total={50} disabled />
    </div>
  );
}
