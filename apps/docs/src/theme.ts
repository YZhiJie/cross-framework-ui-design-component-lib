/**
 * 文档站主题模式（明亮 / 暗黑 / 跟随系统）
 *
 * - 复用组件库主题体系：最终生效主题经 @xui-design/vue 的 setTheme 写入 <html data-theme>，
 *   组件 demo（消费 --xui-color-* 变量）与文档站自身样式（[data-theme='dark'] 覆盖 --docs-*）同步切换
 * - system 模式监听 matchMedia('(prefers-color-scheme: dark)') change 实时跟随
 * - localStorage 持久化模式选择，刷新后保持
 */
import { computed, reactive, readonly } from 'vue';
import { setTheme } from '@xui-design/vue';

/** 主题模式：system 表示跟随操作系统 */
export type DocsThemeMode = 'light' | 'dark' | 'system';

/** 实际生效主题（system 解析后的结果） */
export type EffectiveTheme = 'light' | 'dark';

const STORAGE_KEY = 'xui-docs-theme-mode';

const media = window.matchMedia('(prefers-color-scheme: dark)');

const state = reactive<{ mode: DocsThemeMode }>({ mode: 'system' });

/** 当前主题模式（响应式只读） */
export const docsThemeMode = readonly(state);

/** system 解析 + 模式映射后的实际生效主题 */
export const effectiveTheme = computed<EffectiveTheme>(() =>
  state.mode === 'system' ? (media.matches ? 'dark' : 'light') : state.mode,
);

/** 把实际生效主题写入 <html data-theme>（组件库与文档站样式共用此属性） */
const applyTheme = (): void => {
  setTheme(effectiveTheme.value);
};

/** 系统主题变化时跟随（media 非响应式，不走 effectiveTheme 缓存，直接按当前系统状态写入） */
const onMediaChange = (): void => {
  if (state.mode === 'system') setTheme(media.matches ? 'dark' : 'light');
};

/** 切换主题模式（持久化 + 应用） */
export const setDocsThemeMode = (mode: DocsThemeMode): void => {
  state.mode = mode;
  localStorage.setItem(STORAGE_KEY, mode);
  applyTheme();
};

/** 初始化：读取持久化模式 + 挂系统主题监听（入口调用一次） */
export const initDocsTheme = (): void => {
  const saved = localStorage.getItem(STORAGE_KEY);
  state.mode = saved === 'light' || saved === 'dark' ? saved : 'system';
  media.addEventListener('change', onMediaChange);
  applyTheme();
};
