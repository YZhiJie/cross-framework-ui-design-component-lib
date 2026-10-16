---
"@xui-design/styles": patch
---

fix: 修复暗色主题下 Tooltip 气泡白字不可见的问题。气泡原先复用文本色 token 作背景（`background: var(--xui-color-text)`）并硬编码 `color: #fff`，暗色下 `--xui-color-text` 翻转为浅色 `#f3f4f6`，导致白字浅底完全看不见。现引入独立语义 token `--xui-color-tooltip-bg` / `--xui-color-tooltip-text`（浅色 `#1f2937` / `#fff`，暗色 `#374151` / `#f3f4f6`）成对使用，气泡外观随主题整体翻转；箭头沿用 `background-color: inherit` 自动跟随，无需额外改动。
