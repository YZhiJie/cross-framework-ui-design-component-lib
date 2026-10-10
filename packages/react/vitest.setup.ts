import '@testing-library/jest-dom/vitest';

// @vitejs/plugin-react 4.0 在 transform 时注入 fast-refresh preamble 检查：
// vitest 环境下 import.meta.hot 存在但不会注入 preamble，这里手动安装以通过检查。
const globalWindow = window as unknown as Record<string, unknown>;
globalWindow.__vite_plugin_react_preamble_installed__ = true;
globalWindow.$RefreshReg$ = () => {};
globalWindow.$RefreshSig$ = () => (type: unknown) => type;
