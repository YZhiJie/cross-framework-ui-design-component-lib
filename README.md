# XUI Design —— Vue 3 / React 19 双端同构组件库

[![CI](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/actions/workflows/ci.yml/badge.svg)](https://github.com/YZhiJie/cross-framework-ui-design-component-lib/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@xui-design/vue)](https://www.npmjs.com/org/xui-design)
[![docs](https://img.shields.io/badge/docs-GitHub%20Pages-blue)](https://yzhijie.github.io/xui-design-docs/)

一套以 **ComponentSpec 契约驱动** 的跨框架组件库：组件的 Props / 事件 / 默认值在 `@xui-design/core` 中定义为唯一契约，校验、虚拟滚动、浮层避让、国际化等核心逻辑全部沉淀在框架无关层 `@xui-design/shared`，Vue 3 与 React 19 适配层只做渲染桥接，样式由 `@xui-design/styles` 单一来源输出——从架构机制上保证双端行为与视觉**零漂移**。

## 目录

- [特性](#特性)
- [在线资源](#在线资源)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [组件总览](#组件总览)
- [使用指南](#使用指南)
- [运行时 API 参考](#运行时-api-参考)
- [常见问题](#常见问题)
- [本地开发](#本地开发)
- [发布与部署](#发布与部署)
- [贡献指南](#贡献指南)
- [设计文档](#设计文档)
- [License](#license)

## 特性

- **契约驱动架构**：`core` 层 ComponentSpec 为双端唯一契约，适配层不得新增契约外 Props/事件；三方契约对齐测试（core ↔ Vue ↔ React）在 CI 中机器化强制
- **逻辑框架无关复用**：表单校验引擎、虚拟滚动窗口计算、浮层翻转/钳制、主题与国际化运行时均位于 `shared` 层，双端不重复实现
- **双端原生开发体验**：Vue 端 `v-model` / 具名插槽 / SFC，React 端受控 Props / render 回调 / `ref` 命令式句柄，各端用法遵循各自生态习惯
- **完整工程闭环**：pnpm monorepo + Turbo 编排、Vitest 双端 570+ 单元测试、ESLint/Stylelint/Prettier、Changesets 版本管理与自动发布、GitHub Actions CI/CD
- **主题与国际化内置**：明亮/暗黑主题 + 三层 token 定制；组件内置文案接入语言包（zh-CN / en-US），支持注册自定义语言
- **自研交互式文档站**：25 个组件页同一份 demo 双端实时切换对比，中英双语、三态主题

## 在线资源

| 资源 | 地址 |
|------|------|
| 源码仓库（GitHub） | https://github.com/YZhiJie/cross-framework-ui-design-component-lib |
| 文档站部署仓库（GitHub Pages） | https://github.com/YZhiJie/xui-design-docs |
| 文档站线上地址（组件 demo / API 表格 / 指南） | https://yzhijie.github.io/xui-design-docs/ |
| npm 组织 | https://www.npmjs.com/org/xui-design |

## 环境要求

| 依赖 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | ≥ 22.13.0 | 仓库 `engines` 强制校验 |
| pnpm | ≥ 11.0.0 | 仅支持 pnpm（workspace 依赖协议 `workspace:*`） |
| Vue | ≥ 3.5.0 | 使用 Vue 端时的 peer 依赖（依赖 3.5 响应式 props 解构） |
| React / ReactDOM | ≥ 19.0.0 | 使用 React 端时的 peer 依赖（**不支持 React 18 及以下**） |

## 快速开始

### 安装

```bash
# Vue 3 项目
pnpm add @xui-design/vue @xui-design/styles

# React 19 项目
pnpm add @xui-design/react @xui-design/styles
```

### Vue 3 最小示例

```ts
// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import '@xui-design/styles'; // 必须：引入全部组件样式（单一来源）

createApp(App).mount('#app');
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Input, message } from '@xui-design/vue';

const name = ref('');
</script>

<template>
  <Input v-model:value="name" placeholder="请输入姓名" />
  <Button type="primary" @click="message.success(`你好，${name.value}`)">提交</Button>
</template>
```

也可以全量注册（适合原型开发）：

```ts
import XuiVue from '@xui-design/vue';
createApp(App).use(XuiVue).mount('#app');
```

### React 19 最小示例

```tsx
// main.tsx
import { createRoot } from 'react-dom/client';
import '@xui-design/styles'; // 必须：引入全部组件样式
import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
```

```tsx
// App.tsx
import { useState } from 'react';
import { Button, Input, message } from '@xui-design/react';

export function App() {
  const [name, setName] = useState('');
  return (
    <>
      <Input value={name} onValueChange={setName} placeholder="请输入姓名" />
      <Button type="primary" onClick={() => message.success(`你好，${name}`)}>提交</Button>
    </>
  );
}
```

> 受控约定双端统一为 `value + onValueChange`（Vue 编译为 `v-model:value`），默认值只定义在 core 层。

到这里已经完成最小可用接入（通常 < 5 分钟）。完整组件用法见[文档站](https://yzhijie.github.io/xui-design-docs/)。

## 组件总览

共 **25 个组件**，全部双端可用（文档站每页均可切换 Vue / React 实时预览）：

| 分组 | 组件 |
|------|------|
| 通用 | Button、Tag、Alert、Message（命令式） |
| 数据录入 | Input、InputNumber、Select、Switch、Checkbox、Radio（含 RadioGroup）、DatePicker、Form（含 FormItem） |
| 数据展示 | Table、Tabs、Badge、Avatar、Progress、Skeleton、Empty、Tooltip |
| 导航 | Breadcrumb、Pagination |
| 反馈 | Modal、Popconfirm、Spin |

## 使用指南

### 主题定制（三层，优先级从低到高）

```ts
import { setTheme, setThemeTokens, clearThemeTokens } from '@xui-design/vue'; // React 端同签名

// 1) 全局预设主题：写入 <html data-theme>，light 为默认
setTheme('dark');

// 2) 全局 token 覆盖：在预设之上微调（非法输入静默忽略，可精确回收）
setThemeTokens({ '--xui-color-primary': '#7c3aed' });
clearThemeTokens();
```

3) 组件级覆盖：所有声明式组件根元素支持 `className` / `style` 透传，CSS 变量只作用于当前组件子树：

```vue
<Button :style="{ '--xui-color-primary': '#16a34a' }">仅此按钮变绿</Button>
```

详见文档站 [/theme](https://yzhijie.github.io/xui-design-docs/#/theme) 指南页。

### 国际化

内置 `zh-CN`（默认）与 `en-US`，8 个含内置文案的组件（Modal / Popconfirm / Table / Pagination / DatePicker / Select / Skeleton / Breadcrumb）已接入：

```ts
import { setLocale, registerLocale } from '@xui-design/vue'; // React 端同签名

setLocale('en-US');

// 注册自定义语言：按组浅合并（只需给出要覆盖的文案）
registerLocale('fr-FR', { modal: { okText: 'OK' } });
setLocale('fr-FR');
```

文案类 Props（如 `okText`）不写死默认值：显式传入优先，否则取当前语言包。详见 [/i18n](https://yzhijie.github.io/xui-design-docs/#/i18n)。

### 命令式 Message

无需在模板中声明，双端惰性挂载容器：

```ts
import { message } from '@xui-design/vue'; // 或 '@xui-design/react'

message.info('提示');
message.success('成功', { duration: 5000 });   // 第二参数：{ duration?, closable? }
message.warning('警告');
message.error('失败');
message.closeAll();
```

默认值：`duration: 3000`（`0` 表示不自动关闭）、`closable: false`、`type: 'info'`。

### 浮层视口避让（自动）

Tooltip / Popconfirm / Select 等浮层组件内置视口避让：首选方位空间不足**且**对侧更充足时才翻转（避免边界抖动），交叉轴钳制保留 8px 安全区，滚动与 resize 时 rAF 合并重算。无需配置，逻辑双端共用。详见 [/floating](https://yzhijie.github.io/xui-design-docs/#/floating)。

## 运行时 API 参考

以下 API 由 `@xui-design/shared` 实现，双端适配层原样 re-export，签名与默认值双端一致：

### 主题

| API | 签名 | 默认/取值 | 说明 |
|-----|------|-----------|------|
| `getTheme` | `() => XuiTheme` | 无 `data-theme` 时为 `'light'` | 读取当前主题 |
| `setTheme` | `(theme: XuiTheme) => void` | `'light' \| 'dark'` | 写入 `<html data-theme>` |
| `toggleTheme` | `() => XuiTheme` | — | 切换并返回新主题 |
| `subscribeTheme` | `(listener: (t: XuiTheme) => void) => () => void` | — | 订阅变化，返回取消订阅函数 |
| `setThemeTokens` | `(tokens: Record<string, string>) => void` | — | 全局 token 覆盖，非法输入静默忽略 |
| `clearThemeTokens` | `() => void` | — | 精确回收已覆盖 token |

### 国际化

| API | 签名 | 默认/取值 | 说明 |
|-----|------|-----------|------|
| `getLocale` | `() => string` | `'zh-CN'` | 当前语言 key |
| `setLocale` | `(key: string) => void` | `'zh-CN' \| 'en-US'` 或已注册 key | 切换语言，通知全部订阅者 |
| `registerLocale` | `(key: string, partial: XuiLocaleInput) => void` | — | 注册语言包，按组浅合并 |
| `getLocaleData` | `() => XuiLocaleData` | — | 当前语言完整文案 |
| `subscribeLocale` | `(listener: LocaleListener) => () => void` | — | 订阅变化，返回取消订阅函数 |
| `useLocaleData` | 组合式函数 / Hook | — | 组件内响应式获取语言包 |

## 常见问题

**Q1：React 18 项目能用吗？**
不能。React 适配层 peer 要求 `react` / `react-dom` ≥ 19（内部依赖 `useSyncExternalStore` 快照缓存等 19 语义），Vue 端要求 Vue ≥ 3.5（依赖响应式 props 解构）。

**Q2：组件渲染出来没有样式？**
确认入口文件执行了 `import '@xui-design/styles'`。组件包自身不携带样式，样式由 `@xui-design/styles` 单一来源输出。

**Q3：点击表单里的按钮意外触发了提交/校验？**
库内 `Button` 渲染的原生 `<button>` 固定为 `type="button"`，不会触发表单提交；提交统一走 `Form` 实例的 `formRef.submit()` 命令式调用（输入框内回车提交同样受支持）。若你在表单内使用了**原生** `<button>`，请自行加 `type="button"`。

**Q4：切换暗黑主题后部分组件颜色没变？**
只有消费语义 token（`var(--xui-color-*)`）的属性会随主题变化；自定义样式请避免硬编码色值，改用 CSS 变量或组件级 token 覆盖。

**Q5：为什么校验提示没有出现在受控输入时？**
Form 校验按 trigger 分级：`change` / `blur` 规则在用户交互时触发，`submit` 规则仅在提交时触发；`resetFields()` 只恢复初始值并清空错误，不会触发校验（符合语义预期）。

**Q6：TypeScript 报找不到模块或类型？**
消费方请确保安装的是同一版本的 `@xui-design/*` 全家桶（版本联动发布）；仓库内开发请先 `pnpm build`（适配层 tsconfig 指向兄弟包的 `dist/types`）。

## 本地开发

### 仓库结构

```
packages/
  core/     框架无关契约层：ComponentSpec（Props/事件/默认值/插槽唯一来源）
  shared/   框架无关逻辑层：校验、虚拟滚动、浮层避让、locale、theme、插件系统
  styles/   样式单一来源：BEM + CSS 变量主题，双端共用类名
  icons/    SVG 图标数据源，双端共用
  utils/    通用工具
  vue/      Vue 3 适配层（peer: vue ≥ 3.5）
  react/    React 适配层（peer: react/react-dom ≥ 19）
apps/
  docs/             自研文档站（Vue SPA，dev 端口 5175）
  playground-vue/   Vue 联调环境
  playground-react/ React 联调环境
scripts/
  create-component.ts  组件四层骨架脚手架
  contract-test.ts     双端契约对齐校验（CI 强制）
  check-bundle-size.ts 产物体积检查
```

### 常用命令（仓库根目录）

| 命令 | 作用 |
|------|------|
| `pnpm install` | 安装依赖（需 Node ≥ 22.13、pnpm ≥ 11） |
| `pnpm dev` | 全部包并行 watch 构建（Turbo 编排，依赖前置） |
| `pnpm build` | 全部包生产构建 |
| `pnpm test` | 双端单元测试（Vitest，Vue 289 + React 288） |
| `pnpm lint` / `pnpm type-check` | ESLint + Stylelint / TS + vue-tsc 类型检查 |
| `pnpm gate` | 统一门禁：lint + type-check + knip + test + 契约对齐 + 体积检查（提交前必跑） |
| `pnpm knip` | 未使用文件 / 导出 / 类型 / 依赖检查（公开 API 已按目录白名单，见 `knip.json`） |
| `pnpm test:coverage` | 单测覆盖率报告 |
| `pnpm e2e` / `pnpm e2e:update-visual` | Playwright E2E 与视觉回归快照更新 |
| `pnpm changeset` | 交互式记录变更（选择包与 semver 级别，生成 `.changeset/*.md`） |
| `pnpm changeset status` | 预览待发布包与版本 bump 级别（不修改文件） |
| `pnpm changeset version` | 消费 changeset：bump 各包版本并生成 CHANGELOG（会删除 changeset 文件） |
| `pnpm release` | 本地构建 + `changeset publish`（CI 实际用 `pnpm -r publish` 顺序发布） |
| `pnpm exec tsx scripts/contract-test.ts` | core ↔ Vue ↔ React 三方契约对齐校验 |
| `pnpm exec tsx scripts/create-component.ts <Name>` | 一键生成组件四层骨架（core 契约 → shared 逻辑 → 双端适配） |
| `pnpm --filter @xui-design/docs dev` | 启动文档站（5175，占用顺延 5176） |

### 未使用代码检查（knip）

`tsc` 的 `noUnusedLocals` / ESLint 的 `no-unused-vars` 只检查文件内局部成员，export 一律豁免；跨文件的死导出、死类型与死文件由 [knip](https://knip.dev) 负责。`pnpm knip` 在 `pnpm gate` 中是**阻断项**（配置见根目录 `knip.json`）。

常用配置字段：

| 字段 | 作用 | 本仓库取值 |
|------|------|-----------|
| `workspaces.<name>.project` | 参与分析的文件 | 各包 `src/**/*.{ts,tsx}`，`packages/vue` 额外含 `src/**/*.vue` |
| `workspaces.<name>.entry` | 入口，未被入口引用的文件即视为未使用 | 各包显式 `src/index.ts` |
| `includeEntryExports` | 是否连入口文件自身的导出一起检查 | `true` |
| `rules` | 各规则级别（`error` / `warn` / `off`） | `exports`、`types`、`duplicates` 为 `error`；`enumMembers` 为 `off` |
| `ignoreIssues` | 按文件/目录忽略指定规则 | 各包公共 API 面（见下） |
| `ignoreDependencies` | 忽略误报的依赖 | `@xui-design/styles`、`autoprefixer`、`husky`、`rollup` |

关键约定：

- **entry 必须显式写 `src/index.ts`**：包 `package.json` 的 `exports` 指向 `dist/types/index.d.ts`，省略后 knip 会把构建产物当入口，导致零发现（等价于失效）。knip 提示的 `Remove redundant entry pattern` 在本仓库属误报，保留即可。
- **公共 API 用目录级白名单**：`shared` / `vue` / `react` / `styles` / `icons` / `utils` 的 `src/**`、`core/src/components/**`、`core/src/index.ts`、`core/src/spec.ts` 忽略 `exports` / `types`（这些是包对外契约）。`packages/core/src/types.ts` 故意**不在**白名单内，契约层新增的未使用成员会被门禁捕获。
- **单点豁免用 JSDoc `@public`**：导出确实对外、但静态分析无法识别时（如 `THEME_ATTRIBUTE`、被动态 import 的 `messagesMap`、经对象成员暴露的 `message.open`），加 `@public` 标注而非放宽整目录。
- **白名单是渐进式的**：后续可按文件逐个收窄，让包内部死导出重新进入告警。

### 新增组件流程

1. `pnpm exec tsx scripts/create-component.ts <Name>` 生成四层骨架
2. 在 `core` 定义 ComponentSpec（props/事件/默认值/插槽）
3. 在 `shared` 实现 `createXxxLogic` 核心逻辑并编写核心层单测
4. 双端适配层桥接渲染，编写双端组件测试
5. 跑通 `pnpm test` + `pnpm exec tsx scripts/contract-test.ts`
6. 文档站注册组件（`apps/docs/src/content/<slug>/` + `registry.ts`），提交 PR

关键约定（违反会被 CI/契约测试拦截）：

- 适配层不得新增契约外 Props/事件；Vue `defineProps` 引用含 `onXxx` 回调的类型时必须 `Omit` 剔除
- 文案类默认值一律不写硬编码，渲染时 `prop ?? locale`
- 新增颜色必须消费语义 token（`var(--xui-color-*)`），禁止硬编码色值
- `shared` 层不得 `import @xui-design/core`（类型在 shared 本地定义，core 复用对齐）

## 发布与部署

### 组件库发版（Changesets + GitHub Actions，全自动）

```bash
pnpm changeset          # 1. 记录变更（选择包与 semver 级别，生成 .changeset/*.md）
git push origin main    # 2. 推送后自动执行后续流程
```

CI（build / test / lint / type-check / 契约测试）通过后触发 Release workflow：存在 changeset 时创建 Version Packages PR，合并后自动 `changeset publish` 发版。配置要点：

- 6 个发布包均声明 `publishConfig.access: public`（scoped 包必需）
- `.changeset/config.json` 的 `linked` 组保证 6 包同版本联动
- GitHub Secret `NPM_TOKEN` 需为 **Granular Access Token** 并勾选 bypass 2FA
- 使用 `@changesets/cli` v3（v2.31.1 会掩盖真实发布错误）

### 文档站部署（GitHub Pages）

文档站经独立仓库 [YZhiJie/xui-design-docs](https://github.com/YZhiJie/xui-design-docs) 发布，push 构建产物后 Actions 自动上线：

```bash
cd apps/docs
DOCS_BASE=/xui-design-docs/ pnpm build   # base 前缀必须与仓库名一致
# 将 dist/ 全部内容推送至 xui-design-docs 仓库 main 分支（保留 .nojekyll）
```

路由为 hash 模式，GitHub Pages 无需 rewrite 规则。完整步骤与回滚方法见 [apps/docs/README.md](apps/docs/README.md)。

## 贡献指南

1. Fork 并克隆仓库，确保 Node ≥ 22.13、pnpm ≥ 11
2. `pnpm install && pnpm build` 初始化（先生成各包 `dist/types`，否则类型解析报错）
3. 新建功能分支，按[新增组件流程](#新增组件流程)开发
4. 提交前本地跑通：`pnpm test && pnpm lint && pnpm type-check && pnpm exec tsx scripts/contract-test.ts`
5. 提交 PR（commit message 遵循 Conventional Commits，husky 钩子会校验）

## 设计文档

架构决策与规范的完整论述（方案起源文档，实现以本 README 与源码为准）：

| 序号 | 文档 | 内容概述 |
|------|------|----------|
| 01 | [技术路线对比分析](docs/01-技术路线对比分析.md) | 四种跨框架方案的深度对比、优劣势、适用场景 |
| 02 | [分层架构设计](docs/02-分层架构设计.md) | 核心层 / 抽象层 / 双端适配层的职责边界与通信机制 |
| 03 | [统一组件规范](docs/03-统一组件规范.md) | Props 约定、事件处理、插槽映射、样式隔离 |
| 04 | [工程化实现细节](docs/04-工程化实现细节.md) | Monorepo 结构、双框架构建、类型生成、按需加载 |
| 05 | [兼容性与质量保障](docs/05-兼容性与质量保障.md) | 版本兼容、单元测试、打包体积优化 |
| 06 | [避坑指南](docs/06-避坑指南.md) | 响应式差异、虚拟 DOM 差异、生命周期时序等痛点 |
| 07 | [可执行实施步骤](docs/07-可执行实施步骤.md) | 从核心抽离到双端适配再到发布验证的完整流程 |
| 08 | [项目依赖清单](docs/08-项目依赖清单.md) | 全部包的 dependencies / peerDependencies |

## License

MIT
