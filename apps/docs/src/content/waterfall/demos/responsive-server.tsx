import { useEffect, useRef, useState } from 'react';
import { Waterfall, type WaterfallItem } from '@xui-design/react';

type ImageItem = WaterfallItem & {
  id: number;
  url: string;
  width: number;
  height: number;
  title: string;
};

const PAGE_SIZE = 8;
const MAX_PAGES = 4;

const breakpoints = [
  { minWidth: 0, columns: 2 },
  { minWidth: 560, columns: 3 },
  { minWidth: 880, columns: 4 },
];

// 服务端返回的图片尺寸各不相同（宽、高都随机），用于演示不等高重排
const WIDTH_POOL = [320, 400, 480, 560];

/** 模拟从服务端拉取一页不同尺寸的图片 */
function mockFetchImages(page: number): Promise<ImageItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items: ImageItem[] = Array.from({ length: PAGE_SIZE }, (_, i) => {
        const seed = (page - 1) * PAGE_SIZE + i + 1;
        const width = WIDTH_POOL[seed % WIDTH_POOL.length];
        const height = Math.round(width * (0.6 + Math.random() * 1.1));
        return {
          id: seed,
          url: `https://picsum.photos/seed/responsive-waterfall-${seed}/${width}/${height}`,
          width,
          height,
          title: `图片 ${seed}`,
        };
      });
      resolve(items);
    }, 600); // 模拟网络耗时
  });
}

export default function () {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [columnCount, setColumnCount] = useState(breakpoints[0].columns);
  // 按图片 id 记录加载状态，用于控制骨架屏 / 图片淡入
  const [loadedIds, setLoadedIds] = useState<Set<number>>(new Set());
  const pageCounter = useRef(0);

  const handleImageLoaded = (id: number) => {
    setLoadedIds((prev) => new Set(prev).add(id));
  };

  async function loadMore() {
    if (loading || finished) return;
    setLoading(true);
    try {
      pageCounter.current += 1;
      const newItems = await mockFetchImages(pageCounter.current);
      setItems((prev) => [...prev, ...newItems]);
      if (pageCounter.current >= MAX_PAGES) setFinished(true);
    } finally {
      setLoading(false);
    }
  }

  // 首次挂载加载第一页
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        border: '1px solid #eee',
        borderRadius: 8,
        padding: 12,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <p
          style={{
            color: '#888',
            fontSize: 12,
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          💡 服务端分页返回不同宽高的图片，滚动触底继续加载；拖动窗口宽度观察断点自动切换列数
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
          当前列数 {columnCount}
        </span>
      </div>

      <Waterfall
        items={items}
        rowKey="id"
        breakpoints={breakpoints}
        gutter={12}
        height={420}
        loading={loading}
        finished={finished}
        onLoadMore={loadMore}
        onLayoutChange={(payload) => setColumnCount(payload.columnCount)}
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
                      animation: 'responsive-server-shimmer 1.4s ease-in-out infinite',
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

      {finished ? (
        <div
          style={{
            textAlign: 'center',
            padding: '10px 0 4px',
            fontSize: 12,
            color: '#aaa',
          }}
        >
          已加载全部 {MAX_PAGES * PAGE_SIZE} 张图片
        </div>
      ) : (
        loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 6,
              padding: '10px 0 4px',
              fontSize: 12,
              color: '#aaa',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                border: '2px solid #ddd',
                borderTopColor: '#888',
                borderRadius: '50%',
                animation: 'responsive-server-spin 0.8s linear infinite',
              }}
            />
            加载中...
          </div>
        )
      )}

      <style>{`
        @keyframes responsive-server-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes responsive-server-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
