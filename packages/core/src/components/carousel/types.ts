/** Carousel 契约类型
 *
 * Props / Events / Slots / State / Logic
 * 使用 type 别名（而非 interface）以保证与 Record 约束的结构兼容性。
 *
 * 契约约定：
 * - value 为当前轮播索引（0 起），提供即受控；内部动画位置（position）
 *   与归一化索引（value）分离，环绕时瞬时指向首尾克隆位再回跳收敛；
 * - 默认复刻「三图轮播」效果：中心项放大高亮、两侧项缩小变暗并部分露出，
 *   loop 开启无限循环，autoplay 默认开启且悬停暂停；
 * - skewed 开启倾斜变体（幻灯片平行四边形裁切、内容反向矫正）；
 * - onChange 由箭头 / 指示点 / 命令式 API / 自动播放触发。
 */

import type { LogicInstance } from '../../types';

/** 轮播项（与 Carousel 组件 items 元素结构一致） */
export type CarouselItem = {
  /** 轮播项唯一标识 */
  key: string;
  /** 图片地址 */
  image: string;
  /** 图片替代文本（可访问性描述） */
  alt?: string;
};

/** Carousel Props（Vue 与 React 共用） */
export type CarouselProps = {
  /** 轮播数据 */
  items: CarouselItem[];
  /** 受控当前索引（提供即受控，0 起） */
  value?: number;
  /** 非受控初始索引 */
  defaultValue?: number;
  /** 自动播放（悬停 / 页面隐藏时暂停） */
  autoplay?: boolean;
  /** 自动播放间隔（ms） */
  interval?: number;
  /** 无限循环（首尾克隆实现无缝环绕） */
  loop?: boolean;
  /** 切换动画时长（ms，逻辑层按此时长收敛回跳） */
  duration?: number;
  /** 显示前后箭头 */
  showArrows?: boolean;
  /** 显示指示点 */
  showDots?: boolean;
  /** 悬停暂停自动播放 */
  pauseOnHover?: boolean;
  /** 倾斜变体（幻灯片平行四边形裁切，对应「有倾斜」版本效果） */
  skewed?: boolean;
  /** 附加到根节点的自定义类名 */
  className?: string;
  /** 附加到根节点的内联样式（支持 CSS 自定义属性） */
  style?: Record<string, string>;
  /** 当前索引变更回调（契约事件；箭头 / 指示点 / 命令式 API / 自动播放触发） */
  onChange?: (index: number) => void;
};

/** Carousel 事件契约 */
export type CarouselEvents = {
  change: (index: number) => void;
};

/** Carousel 插槽契约 */
export type CarouselSlots = Record<string, never>;

/** Carousel 状态快照（由逻辑层暴露） */
export type CarouselState = {
  /** 归一化当前索引（0 起，指示点 / 受控基准） */
  value: number;
  /** 轨道动画位置（含首尾克隆虚拟位，切换动画期间可能为 -1 或 count） */
  position: number;
  /** 本次位置变更是否带过渡动画（回跳收敛帧为 false） */
  animate: boolean;
  /** 自动播放定时器是否进行中 */
  playing: boolean;
};

/** Carousel 逻辑实例（通用接口 + 交互方法） */
export type CarouselLogic = LogicInstance<CarouselProps, CarouselState> & {
  /** 切换到上一张（非循环且在首位时 no-op；动画进行中丢弃） */
  prev: () => void;
  /** 切换到下一张（非循环且在末位时 no-op；动画进行中丢弃） */
  next: () => void;
  /** 切换到指定索引（越界钳制；动画进行中丢弃） */
  goTo: (index: number) => void;
  /** 启动自动播放（autoplay 关闭 / 只有单张 / 悬停暂停中时 no-op） */
  play: () => void;
  /** 停止自动播放 */
  stop: () => void;
  /** 悬停状态同步（pauseOnHover 开启时控制自动播放暂停） */
  setHovered: (hovered: boolean) => void;
};
