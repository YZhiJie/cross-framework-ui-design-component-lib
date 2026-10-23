# @xui-design/icons

## 0.5.0

### Patch Changes

- Updated dependencies [[`3ad9a7b`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/3ad9a7bb9fc7c06b63c0231da7960bfb87747639)]:
  - @xui-design/styles@0.5.0

## 0.4.2

### Patch Changes

- Updated dependencies [[`144dda7`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/144dda7136044f640c1c56a9e72ca75470016602)]:
  - @xui-design/styles@0.4.2

## 0.4.1

### Patch Changes

- Updated dependencies [[`8bf2605`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/8bf260593de4c4cb8f847ae3a00002e93cb374fb)]:
  - @xui-design/styles@0.4.1

## 0.4.0

### Minor Changes

- [`bb7d766`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/bb7d766586da04925308657c9f458046d7cd4e77) - ⚠️ **Breaking（exports 收窄）**：移除各包 `exports` 中指向不存在产物的子路径——core 的 `./components/*` `./spec` `./types`、shared 的 `./components/*` `./hooks` `./utils`、vue / react / icons 的 `./components/*`、styles 的 `./theme/*` `./components/*` `./reset.css`，统一收敛为仅根导出 `.`。这些子路径声明的目标文件在 dist 中从未存在，正常消费方不可能正在使用，实际影响面为零；但若构建工具对未声明子路径的报错策略不同，请在升级后检查是否存在相关深路径引用。0.x 阶段按 minor 发布（semver 0.x 约定 minor 可含 breaking），组件与样式的根导出 API 无任何变化。

### Patch Changes

- Updated dependencies [[`bb7d766`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/bb7d766586da04925308657c9f458046d7cd4e77)]:
  - @xui-design/styles@0.4.0

## 0.3.0

### Patch Changes

- Updated dependencies [[`a8852b3`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/a8852b36ae59d7d0577f8146d8455527a19679a1)]:
  - @xui-design/styles@0.3.0

## 0.2.1

### Patch Changes

- [`4b3dfbf`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/4b3dfbfabfb831fa56113443abe511e4d13cf9fe) - 补齐 publishConfig.access: public 配置，修复 CI 自动发布时 scoped 包被拒绝的问题。
- Updated dependencies [[`4b3dfbf`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/4b3dfbfabfb831fa56113443abe511e4d13cf9fe)]:
  - @xui-design/styles@0.2.1

## 0.2.0

### Patch Changes

- Updated dependencies [[`6844824`](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/commit/68448246ac455d6e5c1ceb5f33e96496127512ba)]:
  - @xui-design/styles@0.2.0

## 0.1.0

### Minor Changes

- 首个预发布版本：跨框架组件库基础设施（core 契约 + shared 纯逻辑 + Vue3/React19 双端适配层），含 Button / Input / Modal 三组件、统一图标包与样式单一来源，双端 184 测试用例与契约测试全绿。

### Patch Changes

- Updated dependencies []:
  - @xui-design/styles@0.1.0
