---
"@xui-design/core": minor
"@xui-design/shared": minor
"@xui-design/vue": minor
"@xui-design/react": minor
"@xui-design/styles": minor
"@xui-design/icons": minor
---

⚠️ **Breaking（exports 收窄）**：移除各包 `exports` 中指向不存在产物的子路径——core 的 `./components/*` `./spec` `./types`、shared 的 `./components/*` `./hooks` `./utils`、vue / react / icons 的 `./components/*`、styles 的 `./theme/*` `./components/*` `./reset.css`，统一收敛为仅根导出 `.`。这些子路径声明的目标文件在 dist 中从未存在，正常消费方不可能正在使用，实际影响面为零；但若构建工具对未声明子路径的报错策略不同，请在升级后检查是否存在相关深路径引用。0.x 阶段按 minor 发布（semver 0.x 约定 minor 可含 breaking），组件与样式的根导出 API 无任何变化。
