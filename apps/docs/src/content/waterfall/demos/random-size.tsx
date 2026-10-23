import { useState } from 'react';
import { Waterfall, type WaterfallItem } from '@xui-design/react';

type ImageItem = WaterfallItem & {
  id: number;
  url: string;
  width: number;
  height: number;
  title: string;
};

const COUNT = 18;

/** 生成宽高完全随机的图片数据 */
function createRandomItems(): ImageItem[] {
  return Array.from({ length: COUNT }, (_, i) => {
    const width = 200 + Math.floor(Math.random() * 440); // 200 ~ 640
    const height = 200 + Math.floor(Math.random() * 600); // 200 ~ 800
    const seed = `random-size-${Date.now()}-${i}`;
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
  const [items, setItems] = useState<ImageItem[]>(createRandomItems);
  // 按图片 id 记录加载状态，用于控制骨架屏 / 图片淡入
  const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());

  const handleImageLoaded = (id: number) => {
    setLoadedIds((prev) => new Set(prev).add(id));
  };

  const refresh = () => {
    setLoadedIds(new Set());
    setItems(createRandomItems());
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
          💡 每张图片的宽高都在 200~800px 之间随机生成，瀑布流按最短列自动排布
        </p>
        <button
          type="button"
          onClick={refresh}
          style={{
            flex: 'none',
            padding: '4px 12px',
            border: '1px solid #dcdfe6',
            borderRadius: 6,
            background: '#fff',
            color: '#555',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          换一批
        </button>
      </div>

      <Waterfall
        items={items}
        rowKey="id"
        columns={3}
        gutter={12}
        renderItem={(item) => {
          const { id, url, title, width, height } = item as ImageItem;
          const isLoaded = loadedIds.has(id);
          return (
            <div
              style={{
                width: '100%',
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
                      animation: 'random-size-shimmer 1.4s ease-in-out infinite',
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
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 10px',
                  fontSize: 12,
                  color: '#555',
                  background: '#fff',
                }}
              >
                <span>{title}</span>
                <span style={{ color: '#aaa', fontSize: 11 }}>
                  {width}×{height}
                </span>
              </div>
            </div>
          );
        }}
      />

      <style>{`
        @keyframes random-size-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
