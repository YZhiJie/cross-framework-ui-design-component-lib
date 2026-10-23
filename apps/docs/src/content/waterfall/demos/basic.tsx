import { Waterfall, type WaterfallItem } from '@xui-design/react';

type DemoItem = WaterfallItem & { id: number; title: string; height: number };

const items: DemoItem[] = [
  { id: 1, title: '卡片 A', height: 120 },
  { id: 2, title: '卡片 B', height: 240 },
  { id: 3, title: '卡片 C', height: 160 },
  { id: 4, title: '卡片 D', height: 80 },
  { id: 5, title: '卡片 E', height: 200 },
  { id: 6, title: '卡片 F', height: 140 },
  { id: 7, title: '卡片 G', height: 280 },
  { id: 8, title: '卡片 H', height: 100 },
];

export default function () {
  return (
    <Waterfall
      items={items}
      rowKey="id"
      columns={3}
      gutter={12}
      onItemClick={(item) => console.log('clicked', item)}
      renderItem={(item) => {
        const { title, height } = item as DemoItem;
        return (
          <div
            className="demo-card"
            style={{
              height: `${height}px`,
              width: '100%',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {title}
          </div>
        );
      }}
    />
  );
}
