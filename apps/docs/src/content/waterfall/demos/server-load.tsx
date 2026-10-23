import { useEffect, useRef, useState } from 'react';
import { Waterfall, type WaterfallItem } from '@xui-design/react';

type ImageItem = WaterfallItem & {
  id: number;
  url: string;
  width: number;
  height: number;
  title: string;
};

const PAGE_SIZE = 10;
const MAX_PAGES = 4;

/** 模拟从服务端拉取一页图片 */
function mockFetchImages(page: number): Promise<ImageItem[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const items: ImageItem[] = Array.from({ length: PAGE_SIZE }, (_, i) => {
        const w = 400;
        const h = 200 + Math.floor(Math.random() * 300); // 随机高度，产生瀑布流错落
        const seed = page * PAGE_SIZE + i + 1;
        return {
          id: seed,
          // picsum.photos 支持 seed，保证同一张图在多次渲染时稳定显示
          url: `https://picsum.photos/seed/waterfall-${seed}/${w}/${h}`,
          width: w,
          height: h,
          title: `图片 ${seed}`,
        };
      });
      resolve(items);
    }, 700); // 模拟网络耗时
  });
}

export default function () {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
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
      <p
        style={{
          color: '#888',
          fontSize: 12,
          margin: '0 0 12px 0',
          lineHeight: 1.5,
        }}
      >
        💡 滚动容器触底会触发 loadMore，从"服务端"拉取下一批图片；图片加载完成后瀑布流自动重排
      </p>

      <Waterfall
        items={items}
        rowKey="id"
        columns={3}
        gutter={12}
        height={420}
        loading={loading}
        finished={finished}
        onLoadMore={loadMore}
        renderItem={(item) => {
          const { url, title, width, height, id } = item as ImageItem;
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
                {/* 加载前的 shimmer 骨架屏 */}
                {!isLoaded && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(90deg, #eee 0%, #f5f5f5 50%, #eee 100%)',
                      backgroundSize: '200% 100%',
                      animation: 'server-load-shimmer 1.4s ease-in-out infinite',
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

      {finished && (
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
      )}

      {!finished && loading && (
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
              animation: 'server-load-spin 0.8s linear infinite',
            }}
          />
          加载中...
        </div>
      )}

      <style>{`
        @keyframes server-load-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes server-load-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
