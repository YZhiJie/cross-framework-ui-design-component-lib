import { useState } from 'react';
import { Waterfall, type WaterfallItem } from '@xui-design/react';

type ImageItem = WaterfallItem & {
  id: number;
  url: string;
  width: number;
  height: number;
  title: string;
};

/** 生成一组宽度、高度都不同的图片数据（宽度即卡片实际宽度） */
function createItems(): ImageItem[] {
  return Array.from({ length: 20 }, (_, i) => {
    const width = 140 + Math.floor(Math.random() * 60); // 140 ~ 200
    const height = Math.round(width * (0.6 + Math.random() * 0.4)); // 高宽比 0.6 ~ 1.0
    const seed = `horizontal-waterfall-${i + 1}`;
    return {
      id: i,
      url: `https://picsum.photos/seed/${seed}/${width}/${height}`,
      width,
      height,
      title: `图片 ${i + 1}`,
    };
  });
}

export default function () {
  const [items] = useState<ImageItem[]>(createItems);
  // 按图片 id 记录加载状态，用于控制骨架屏 / 图片淡入
  const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());

  const handleImageLoaded = (id: number) => {
    setLoadedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <p style={{ color: '#888', fontSize: 12, margin: 0, lineHeight: 1.5 }}>
          💡 卡片按最短行分配，行内自左向右排列；内容超出宽度后容器横向滚动（共 2 行）
        </p>
        <span
          style={{
            flex: 'none',
            padding: '2px 8px',
            borderRadius: 999,
            background: '#f2f3f5',
            color: '#666',
            fontSize: 12,
            whiteSpace: 'nowrap',
          }}
        >
          ← 左右滚动 →
        </span>
      </div>

      <Waterfall
        items={items}
        rowKey="id"
        direction="horizontal"
        rows={2}
        gutter={12}
        height={480}
        renderItem={(item) => {
          const { id, url, title, width, height } = item as ImageItem;
          const isLoaded = loadedIds.has(id);
          return (
            <div
              style={{
                flex: 'none',
                width,
                borderRadius: 8,
                overflow: 'hidden',
                background: '#f6f6f6',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              {/* 用 aspect-ratio 按图片真实宽高占位，避免加载前布局跳动 */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  background: '#eee',
                  overflow: 'hidden',
                  aspectRatio: `${width} / ${height}`,
                }}
              >
                {!isLoaded && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, #eee 0%, #f5f5f5 50%, #eee 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'horizontal-waterfall-shimmer 1.4s ease-in-out infinite',
                    }}
                  />
                )}
                <img
                  src={url}
                  alt={title}
                  loading="lazy"
                  onLoad={() => handleImageLoaded(id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                  }}
                />
              </div>
              <div
                style={{
                  padding: '6px 10px',
                  fontSize: 12,
                  color: '#555',
                  background: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {title}
              </div>
            </div>
          );
        }}
      />

      <style>{`
        @keyframes horizontal-waterfall-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
