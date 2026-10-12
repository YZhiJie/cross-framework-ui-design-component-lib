# 跨框架通用组件库落地方案（Vue + React）

> 一套完整的设计方案，旨在构建同时适配 Vue 3 与 React 17/18/19 的通用组件库，通过 **共享核心逻辑 + 框架层包装** 的架构策略，实现"一次编写、双端运行"。

## 项目背景

在现代前端生态中，Vue 和 React 占据了绝大部分市场份额。企业内部不同业务线可能采用不同技术栈，导致同一套 UI 组件需要分别用 Vue 和 React 实现两次，带来巨大的重复开发和维护成本。本方案旨在通过架构设计，让组件的 **核心逻辑只写一次**，在 Vue 和 React 两端各做一层薄包装，即可同时服务两个生态。

## 核心目标

| 目标 | 指标 |
|------|------|
| 代码复用率 | 核心逻辑复用率 ≥ 85% |
| 双端 API 一致性 | Props / Events / Slots 命名与语义 100% 对齐 |
| 类型安全 | 全量 TypeScript，类型定义自动生成 |
| 按需加载 | 支持 ESM Tree Shaking，单组件按需引入 |
| 性能开销 | 框架包装层额外运行时开销 < 1KB gzip / 组件 |
| 测试覆盖 | 核心逻辑层 ≥ 90%，适配层 ≥ 80% |

## 在线文档

文档站已部署至 GitHub Pages：**https://yzhijie.github.io/xui-design-docs/**

包含 24 个组件的交互式文档（Vue / React 双端 demo 实时切换）、主题定制（/theme）、国际化（/i18n）、浮层视口避让（/floating）等指南页。本地预览：`pnpm --filter @xui-design/docs dev`（端口 5175）。

## npm 安装

组件库已发布至 npm（scope：`@xui-design`，public access），按端安装对应适配层包即可：

```bash
# Vue 项目
pnpm add @xui-design/vue @xui-design/styles

# React 项目（需 React ≥ 19）
pnpm add @xui-design/react @xui-design/styles
```

| 包 | 说明 |
|------|------|
| `@xui-design/vue` | Vue 3 适配层（peer: vue ≥ 3.5） |
| `@xui-design/react` | React 适配层（peer: react / react-dom ≥ 19） |
| `@xui-design/core` | 框架无关契约层（Props / Events / Slots 定义） |
| `@xui-design/shared` | 纯逻辑核心层（状态 / 交互 / locale / theme / floating / virtual-list） |
| `@xui-design/styles` | 共享样式包（BEM + CSS 变量主题，双端单一来源） |
| `@xui-design/icons` | 图标包（双端共用 SVG 数据源） |

## 文档目录

| 序号 | 文档 | 内容概述 |
|------|------|----------|
| 01 | [技术路线对比分析](docs/01-技术路线对比分析.md) | 四种跨框架方案的深度对比、优劣势、适用场景与性能开销 |
| 02 | [分层架构设计](docs/02-分层架构设计.md) | 核心层 / 抽象层 / Vue 适配层 / React 适配层的职责边界与通信机制 |
| 03 | [统一组件规范](docs/03-统一组件规范.md) | Props 约定、事件处理、插槽映射、生命周期对应、样式隔离 |
| 04 | [工程化实现细节](docs/04-工程化实现细节.md) | Monorepo 结构、双框架构建、类型生成、按需加载、Tree Shaking |
| 05 | [兼容性与质量保障](docs/05-兼容性与质量保障.md) | 版本兼容、单元测试、Demo 预览、打包体积优化指标 |
| 06 | [避坑指南](docs/06-避坑指南.md) | 响应式差异、虚拟 DOM 差异、生命周期时序、依赖冲突等痛点 |
| 07 | [可执行实施步骤](docs/07-可执行实施步骤.md) | 从核心抽离到双端适配再到发布验证的完整流程 |
| 08 | [项目依赖清单](docs/08-项目依赖清单.md) | 全部包的 dependencies / peerDependencies / devDependencies |

## 架构总览图

```
┌─────────────────────────────────────────────────────┐
│              Consumer App (Vue / React)              │
└──────────────────┬──────────────────────────────────┘
                   │ import
     ┌─────────────┴─────────────┐
     ▼                           ▼
┌───────────┐             ┌───────────────┐
│ @xui-design/vue  │             │  @xui-design/react  │
│  适配层    │             │    适配层     │
└─────┬─────┘             └──────┬────────┘
      │                          │
      └──────────┬───────────────┘
                 │
         ┌───────┴───────┐
         │  @xui-design/core    │
         │ 框架无关抽象层  │
         │ (Props/Events │
         │   契约定义)    │
         └───────┬───────┘
                 │
         ┌───────┴───────┐
         │ @xui-design/shared   │
         │  纯逻辑核心层  │
         │ (状态/工具/   │
         │  交互逻辑)     │
         └───────────────┘
```

## 技术栈选型

| 领域 | 选型 | 理由 |
|------|------|------|
| 语言 | TypeScript 5.x | 全量类型安全，类型可自动推导生成 |
| 包管理 | pnpm workspace | 原生 Monorepo 支持，硬链接节省磁盘 |
| 构建工具 | Vite + Rollup | 开发期 HMR + 生产期打包，双 format 输出 |
| 测试 | Vitest + @testing-library | 与 Vite 零配置集成，双端 DOM 测试 |
| 文档/预览 | Storybook 7+ | 同时支持 Vue/React 插件，组件可视化预览 |
| 代码规范 | ESLint + Prettier + Stylelint | 统一 Lint 规则，pre-commit 自动修复 |
| CI/CD | GitHub Actions | 自动构建、测试、发布 |
| 发布 | Changesets | 版本管理 + Changelog 自动生成 |

## 快速导航

- 新成员入门 → 从 [07-可执行实施步骤](docs/07-可执行实施步骤.md) 开始
- 架构理解 → 从 [02-分层架构设计](docs/02-分层架构设计.md) 开始
- 遇到问题 → 查看 [06-避坑指南](docs/06-避坑指南.md)
- 贡献组件 → 阅读 [03-统一组件规范](docs/03-统一组件规范.md)

## 发布与部署

### 组件库发版（Changesets + GitHub Actions）

```bash
pnpm changeset          # 1. 记录变更（选择包与 semver 级别，生成 .changeset/*.md）
git push origin main    # 2. 推送后自动执行后续流程
```

后续流程全自动：CI（build / test / lint / type-check / 契约测试）成功后触发 Release workflow（`changesets/action`）——存在 changeset 时创建 Version Packages PR，合并后自动 `changeset publish` 发版；无 changeset 时直接检查并发布未发布版本。

发布相关配置要点：

- 6 个发布包均声明 `publishConfig.access: public`（scoped 包必需）
- 版本联动：`.changeset/config.json` 中 `linked` 组保证 6 包同版本发布
- GitHub Secret `NPM_TOKEN` 需使用 **Granular Access Token**（勾选 bypass 2FA，经典 token 在开启 2FA 的账号下无法发布）
- `@changesets/cli` 使用 v3：v2 的 `isAlreadyPublishedError` 对无 `.message` 的错误对象会崩溃（`Cannot read properties of undefined (reading 'includes')`），掩盖真实发布错误

### 文档站部署（GitHub Pages）

文档站通过独立仓库 [YZhiJie/xui-design-docs](https://github.com/YZhiJie/xui-design-docs) 部署，内容为构建产物 + Pages workflow，push 后 Actions 自动发布。

更新流程：

```bash
cd apps/docs
DOCS_BASE=/xui-design-docs/ pnpm build   # 产物 base 前缀必须与仓库名一致
# 将 dist/ 全部内容推送至 xui-design-docs 仓库 main 分支
```

说明：`DOCS_BASE` 环境变量注入 Vite `base`（本地 dev 默认为 `/`，不受影响）；路由使用 hash 模式，GitHub Pages 无需额外 rewrite 规则；`.nojekyll` 已随产物提交以禁用 Jekyll 处理。

## License

MIT
