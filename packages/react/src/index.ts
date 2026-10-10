/**
 * @xui/react - React 17/18/19 适配层
 *
 * 将 @xui/shared 核心逻辑桥接到 React 状态系统。
 * - React 19+：ref-as-prop（无需 forwardRef）
 * - React 17/18：forwardRef + useSyncExternalStore
 *
 * 运行时自动检测 React 版本，选择对应代码路径。
 */

export const REACT_VERSION = '0.0.0';
