import { Waterfall, type WaterfallItem } from '@xui-design/react';

type DemoItem = WaterfallItem & { id: number; title: string; height: number };

const items: DemoItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  title: `卡片 ${i + 1}`,
  height: 80 + Math.floor(Math.random() * 200),
}));

const breakpoints = [
  { minWidth: 0, columns: 1 },
  { minWidth: 600, columns: 2 },
  { minWidth: 1000, columns: 3 },
];

export default function () {
  return (
    <div style={{ border: '1px dashed #ccc', padding: 12, borderRadius: 8 }}>
      <p style={{ color: '#888', fontSize: 12, margin: '0 0 12px 0' }}>
        提示：拖动浏览器窗口观察列数随容器宽度自动切换
      </p>
      <Waterfall
        items={items}
        rowKey="id"
        breakpoints={breakpoints}
        gutter={12}
        renderItem={(item) => {
          const { title, height } = item as DemoItem;
          return (
            <div
              style={{
                height: `${height}px`,
                width: '100%',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
              }}
            >
              {title}
            </div>
          );
        }}
      />
    </div>
  );
}
