import { useState } from 'react';
import { TimeSlotPicker } from '@xui-design/react';
import { useIsZh } from '../../../i18n/use-docs-locale';

export default function TimeSlotPickerRectangleDemo() {
  const isZh = useIsZh();
  const [value, setValue] = useState<string[]>([
    '2026-10-06',
    '2026-10-07',
    '2026-10-13',
    '2026-10-14',
  ]);

  return (
    <div className="demo-column">
      <TimeSlotPicker
        value={value}
        onChange={setValue}
        granularity="month"
        referenceDate="2026-10-20"
      />
      <span className="demo-text">
        {isZh
          ? '按住鼠标左键拖拽：锚点与当前格子围成矩形，半透明预览，松开后一次性提交；从已选格子开始拖拽则批量取消。'
          : 'Hold and drag: the anchor and current cell form a rectangle (translucent preview), committed on release. Dragging from a selected cell deselects the rectangle.'}
      </span>
    </div>
  );
}
