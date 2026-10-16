# CI/CD Workflows 说明

主仓库 [YZhiJie/cross-framework-ui-design-component-lib](https://github.com/YZhiJie/cross-framework-ui-design-component-lib) 的 GitHub Actions 自动化总览。三个 workflow 分工：**CI** 做质量门禁，**Release** 负责 npm 发布，**Deploy Docs** 负责文档站上线。

## 总览

| Workflow | 文件 | 触发条件 | 职责 |
| --- | --- | --- | --- |
| CI | [ci.yml](./ci.yml) | push 到 `main` / `develop`；PR 到 `main` | 质量门禁：lint / 类型 / 测试 / 构建 / 体积 / 契约 |
| Release | [release.yml](./release.yml) | CI 在 `main` 上成功完成后（`workflow_run`） | changesets 版本管理 + npm 发布 |
| Deploy Docs | [docs-deploy.yml](./docs-deploy.yml) | push 到 `main` 且文档/组件源码变更；支持手动触发 | 构建文档站并推送至部署仓库上线 |

## 流水线关系

```
push main / PR ──> CI (quality)                         ── 失败即阻断
                     │ success (main only)
push main ───────────┴──> Release ──> changesets/action ── 有 changeset: 提 release PR
(apps/docs/** 或                                        ── 无 changeset: pnpm changeset publish → npm
 packages/**/src/**)
        └──────────> Deploy Docs ──> YZhiJie/xui-design-docs (main) ──> GitHub Pages
                     https://yzhijie.github.io/xui-design-docs/
```

Release 与 Deploy Docs 互不依赖：npm 发版不阻塞文档站更新，文档站也不等发版。

## 环境约定（三个 workflow 共用）

- **Node 22**（`actions/setup-node@v4`，`node-version: 22`）；仓库 `engines` 要求 `node >= 22.13.0`
- **pnpm 版本不显式指定**：`pnpm/action-setup@v4` 读取根 `package.json` 的 `packageManager: pnpm@11.7.0` 字段。⚠️ 双重指定（action 里写 `version` + packageManager 也有）会触发 `ERR_PNPM_BAD_PM_VERSION`
- 依赖安装统一 `pnpm install --frozen-lockfile`，CI 环境不允许松动 lockfile
- `setup-node` 的 `cache: pnpm` 复用 pnpm store 加速安装

---

## 1. CI（ci.yml）

### 触发

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

### Job: `quality`（单 job 顺序执行）

| 步骤 | 命令 | 说明 |
| --- | --- | --- |
| Lint | `pnpm lint` | turbo 跑各包 eslint / stylelint |
| Type check | `pnpm type-check` | turbo 跑各包 tsc / vue-tsc `--noEmit`，`dependsOn: ^build` 保证先出 dist |
| Test | `pnpm test:coverage` | vitest 全量 + 覆盖率（双端组件测试 + 核心逻辑测试） |
| Build | `pnpm build` | turbo 构建全部包，`^build` 拓扑排序 |
| Check bundle size | `pnpm exec tsx scripts/check-bundle-size.ts` | 体积预算门禁 |
| Contract test | `pnpm exec tsx scripts/contract-test.ts` | 双端契约对齐门禁 |
| Upload coverage | `codecov/codecov-action@v4` | 上传 `./coverage/lcov.info`，`fail_ci_if_error: false`（上传失败不阻断） |

### 体积预算（check-bundle-size.ts）

| 包 | 预算（gzip） |
| --- | --- |
| `@xui-design/shared` | < 50KB |
| `@xui-design/core` | < 30KB |
| `@xui-design/vue` | < 100KB（不含 vue） |
| `@xui-design/react` | < 100KB（不含 react） |
| `@xui-design/styles` | < 20KB |
| `@xui-design/icons` | < 50KB |

超预算即非零退出，CI 失败。

### 契约测试（contract-test.ts）

以 `@xui-design/core` 的运行时 spec 为唯一契约基准，校验：

1. 各包产物 ESM `import` / CJS `require` 均可加载
2. 类型声明文件存在
3. 包间依赖链可解析
4. Vue（运行时 props/emits 选项）与 React（源码静态解析）的 Props / 事件名 / 默认值三方一致——任何不一致即失败

---

## 2. Release（release.yml）

### 触发

```yaml
on:
  workflow_run:
    workflows: [CI]
    types: [completed]
    branches: [main]
```

`if: github.event.workflow_run.conclusion == 'success'` 兜底：只在 CI **成功**时执行，CI 失败/取消的 run 直接跳过。这样设计是为了避免每次 push 都空跑一次 Release。

### Job: `release`

前置步骤与 CI 相同（checkout `fetch-depth: 0` 取全量历史供 changelog 关联 commit、pnpm、Node、install、build），核心是最后一步 `changesets/action@v1`：

| 配置 | 值 | 说明 |
| --- | --- | --- |
| `version` | `pnpm changeset version` | 存在未消费 changeset 时：消费 `.changeset/*.md` → 升级版本号 → 更新各包 CHANGELOG → 自动提一个 `chore: release packages` PR |
| `publish` | `pnpm changeset publish` | 不存在 changeset 时（release PR 已合并）：把新版本发布到 npm |
| `commit` / `title` | `chore: release packages` | release PR 的提交信息与标题 |

### 版本联动规则

`.changeset/config.json` 中 6 个包配置为 **linked**（shared / core / vue / react / styles / icons）：任一包有变更，全组统一升级到其中的最高级别（如某次含 minor，则全组都升 minor）。changelog 由 `@changesets/changelog-github` 生成，条目自动关联 commit 链接（需 `GITHUB_TOKEN`，action 内置注入）。

### 必需的 Secrets / 权限

| 项 | 用途 | 要求 |
| --- | --- | --- |
| `secrets.GITHUB_TOKEN` | 提 release PR、写 changelog commit 链接 | 内置，无需配置 |
| `secrets.NPM_TOKEN` | npm 发布认证 | ⚠️ 必须是 **granular access token** 且**开启 bypass 2FA**，否则 CI 发布返回 403 |
| `permissions` | job 级 | `contents: write`（推送 release PR 分支）、`pull-requests: write`（建 PR）、`id-token: write` |

### 发布避坑（历史踩坑记录）

- **changesets/cli 必须 ≥ v3.0.0**：v2.31.1 存在发布流程崩溃 bug，会掩盖真实 npm 错误
- **scoped 包必须声明 `publishConfig.access: public`**：所有 `@xui-design/*` 包均已配置，缺失会被 npm 拒绝
- **npm 搜索索引延迟**：发布后 24-48 小时内 npmjs.com 搜索栏可能找不到新包，但包页面可直接访问、可正常安装，无需处理

---

## 3. Deploy Docs（docs-deploy.yml）

### 触发

```yaml
on:
  push:
    branches: [main]
    paths:
      - apps/docs/**
      - packages/**/src/**
      - .github/workflows/docs-deploy.yml
  workflow_dispatch:
```

paths 过滤的原因：文档站 demo 经 vite alias **直链组件包 src**（`core/vue/react/styles` → `packages/*/src`），组件或样式源码变更同样影响文档站产物。`workflow_dispatch` 支持在 Actions 页手动触发（如部署仓库被意外改动后的强制重建）。

### Job: `deploy`（步骤要点）

| 步骤 | 命令 / action | 关键设计 |
| --- | --- | --- |
| Build workspace dependencies | `pnpm --filter "@xui-design/docs^..." build` | `^...` = docs 的全部（含传递）workspace 依赖，pnpm 按拓扑序执行。必须跑：react/vue 源码引用的 `@xui-design/shared`、`@xui-design/icons` 经 node_modules 解析到 **dist** |
| Build docs with Pages base | `pnpm --filter @xui-design/docs build`，env `DOCS_BASE=/xui-design-docs/` | **刻意绕开 turbo 直接调 pnpm script**：turbo 只透传 `turbo.json` 中声明的 env 变量，`DOCS_BASE` 经 turbo 会丢失，base 回落 `/` 导致线上资源全部 404 |
| Verify base prefix | `grep -q '/xui-design-docs/' apps/docs/dist/index.html` | 前缀断言失败即中断，阻止错误产物上线 |
| Deploy | `peaceiris/actions-gh-pages@v4` | 推送 `apps/docs/dist` 到外部仓库 |

### Deploy 步骤配置

```yaml
personal_token: ${{ secrets.DOCS_DEPLOY_TOKEN }}
external_repository: YZhiJie/xui-design-docs
publish_branch: main
publish_dir: apps/docs/dist
commit_message: "deploy: docs ${{ github.sha }}"
```

- 目标仓库 [YZhiJie/xui-design-docs](https://github.com/YZhiJie/xui-design-docs) 的 Pages build type 为 **workflow（GitHub Actions 模式）**，push 到其 main 分支后由该仓库自身的 Pages workflow 上线
- `peaceiris/actions-gh-pages` **默认自动写入 `.nojekyll`**，禁用 Jekyll 处理，保证 Vite 产物（下划线开头的 assets 等）原样服务
- 部署后线上地址：https://yzhijie.github.io/xui-design-docs/

### DOCS_DEPLOY_TOKEN 配置（一次性手工步骤）

内置 `GITHUB_TOKEN` 只对当前仓库有效，推送外部仓库需要 PAT。完整生成与配置步骤见文末「[Secrets 配置指南](#secrets-配置指南新人上手)」第 2 节。

### 文档站部署避坑

- **⚠️ `keep_files: true` 与 `exclude_assets: ''` 缺一不可**（事故记录）：peaceiris/actions-gh-pages 的 `exclude_assets` 默认值为 `.github`，即使开了 `keep_files` 也会在拷贝产物前**主动删除目标仓库的 `.github` 目录**——曾两次把 `xui-design-docs/.github/workflows/deploy.yml`（Pages 上线流水线本身）删掉，导致「文件已同步但 Pages 不再部署」。恢复方式：从 git 历史找回该文件重新推送（`gh api ".../contents/.github/workflows/deploy.yml?ref=<旧sha>"`）
- **`DOCS_BASE` 必须与部署仓库名一致**（`/xui-design-docs/`），否则线上资源 404；构建后可用 `grep -o 'href="[^"]*"' apps/docs/dist/index.html` 本地验证（workflow 中已内置该断言）
- 本地 dev / preview 不受影响：`vite.config.ts` 中 `base: process.env.DOCS_BASE ?? '/'`，不传时为 `/`
- 并发控制 `concurrency.group: docs-deploy` 且 `cancel-in-progress: false`，避免两个部署任务交错推送同一分支

---

## Secrets 配置指南（新人上手）

> 前置权限：需要主仓库 `cross-framework-ui-design-component-lib` 的 **Admin** 权限才能读写 Secrets；生成 npm token 需要 npm 账号对 `@xui-design` scope 有发布权限。

| Secret | 所在仓库 | 用途 | 来源 |
| --- | --- | --- | --- |
| `NPM_TOKEN` | 主仓库 | Release 发布 npm | npmjs.com 手工生成 |
| `DOCS_DEPLOY_TOKEN` | 主仓库 | Deploy Docs 推送 xui-design-docs | GitHub 手工生成 |
| `GITHUB_TOKEN` | 各 workflow 自动注入 | release PR / changelog / Pages | 无需配置 |

### 1. NPM_TOKEN（npm 发布凭证）

**第一步：生成 granular access token**

1. 登录 [npmjs.com](https://www.npmjs.com) → 右上角头像 → **Access Tokens**
2. 点击 **Generate New Token** → 选择 **Granular Access Token**
3. 按以下值填写：
   - **Token name**：`xui-design-ci-release`（任意可识别名称）
   - **Expiration**：按需选择（最长 1 年，到期需轮换，见下文「Token 轮换」）
   - **Packages and scopes** → 选择 **@xui-design** scope → 权限选 **Read and write**
4. ⚠️ **必须勾选 "Bypass 2FA for automation"**：CI 是非交互环境，无法完成二次验证；不勾选会导致 `changeset publish` 返回 **403**（本项目历史踩坑，报错不提示真实原因）
5. 点击 **Generate token**，立即复制 `npm_xxxxxxxx` 开头的 token（只显示一次）

**第二步：写入 GitHub Secret**（见下文「通用：添加 Secret 的两种方式」）

**验证**：合并 release PR 后 Release workflow 的 publish 步骤退出码为 0；`npm view @xui-design/vue version` 显示新版本。

### 2. DOCS_DEPLOY_TOKEN（文档站部署凭证）

内置 `GITHUB_TOKEN` 只对当前仓库有效，推送外部仓库 `YZhiJie/xui-design-docs` 需要 Personal Access Token。使用 **fine-grained PAT**（最小权限，不推荐 classic PAT）。

**第一步：生成 fine-grained PAT**

1. GitHub → 右上角头像 → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. 按以下值填写：
   - **Token name**：`xui-design-docs-deploy`
   - **Expiration**：按需选择
   - **Repository access** → **Only select repositories** → 选择 `YZhiJie/xui-design-docs`（⚠️ 是部署仓库，不是主仓库）
   - **Permissions** → **Repository permissions** → **Contents: Read and write**（其余保持 No access）
3. 点击 **Generate token**，立即复制 `github_pat_xxxxxxxx` 开头的 token（只显示一次）

**第二步：写入 GitHub Secret**（见下文「通用：添加 Secret 的两种方式」）

**验证**：Actions 页手动触发 **Deploy Docs**（`workflow_dispatch`）→ run 成功；`curl -sL -o /dev/null -w "%{http_code}\n" https://yzhijie.github.io/xui-design-docs/` 返回 200。

### 3. 通用：添加 Secret 的两种方式

**方式 A：GitHub 网页**

1. 打开主仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. **Name** 必须与 workflow 中引用名逐字一致（`NPM_TOKEN` / `DOCS_DEPLOY_TOKEN`），**Secret** 粘贴 token 值
4. 点击 **Add secret**

**方式 B：gh CLI**（token 从 stdin 读入，不留在 shell 历史里）

```bash
gh secret set NPM_TOKEN --repo YZhiJie/cross-framework-ui-design-component-lib
gh secret set DOCS_DEPLOY_TOKEN --repo YZhiJie/cross-framework-ui-design-component-lib
```

**通用验证**：

```bash
gh secret list --repo YZhiJie/cross-framework-ui-design-component-lib
# 期望输出包含 NPM_TOKEN 与 DOCS_DEPLOY_TOKEN（只能看名称和更新时间，看不了值）
```

### 4. Token 轮换与故障处理

- **到期轮换**：token 到期前 GitHub 会邮件提醒。重新生成同名 token 后，用上面的命令覆盖同名 secret 即可（`gh secret set` 同名覆盖），无需改动 workflow
- **泄露处理**：立即在 npmjs.com / GitHub token 页面 **Revoke** 旧 token，再按上文流程生成新 token 覆盖 secret
- **发布 403**：优先怀疑 NPM_TOKEN 未勾选 bypass 2FA 或已过期，而非 changesets 配置问题
- **Deploy Docs 推送失败（403 / permission denied）**：确认 PAT 授权的仓库是 `YZhiJie/xui-design-docs` 且 Contents 权限为 Read and write

## 本地复现 CI 全流程

```bash
pnpm install --frozen-lockfile
pnpm lint && pnpm type-check && pnpm test:coverage && pnpm build
pnpm exec tsx scripts/check-bundle-size.ts
pnpm exec tsx scripts/contract-test.ts

# 文档站产物验证（等价于 Deploy Docs 的构建步骤）
pnpm --filter "@xui-design/docs^..." build
DOCS_BASE=/xui-design-docs/ pnpm --filter @xui-design/docs build
grep -o 'href="[^"]*"' apps/docs/dist/index.html   # 应全部带 /xui-design-docs/ 前缀
```

## 变更流程约定

1. 功能/修复开发 → `pnpm changeset` 记录变更（写明级别与描述）
2. 提交推送 → CI 全绿
3. Release 自动提 release PR（消费 changeset、升版本、更 changelog）
4. 合并 release PR → 自动发布 npm
5. 涉及 `apps/docs/**` 或 `packages/**/src/**` 的合并 → Deploy Docs 自动更新文档站
