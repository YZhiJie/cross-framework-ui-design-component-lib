import { Skeleton } from '@xui/react';

export default function SkeletonVariantsDemo() {
  return (
    <div className="demo-column">
      <Skeleton avatar rows={2} />
      <Skeleton rows={5} />
    </div>
  );
}
