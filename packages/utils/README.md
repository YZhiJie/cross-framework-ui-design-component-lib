# @xui/utils

跨框架组件库(Vue 3 + React 19)的**内部工程工具包**(私有,`private: true`)——为构建脚本、测试工具等提供 monorepo 内部共用的工程能力,不对外发布。

## 职责边界

- ✅ 提供:monorepo 内部构建 / 测试场景共用的工程工具(当前为版本常量占位,后续按需扩展)
- ✅ 保证:私有包,仅 workspace 内消费,不进入对外发布的产物
- ❌ 不提供:组件运行时工具(由 `@xui/shared` 提供,面向组件运行时)
- ❌ 不提供:面向应用消费方公开的 API(本包 `private: true`,禁止直接被外部依赖)

## 依赖关系

- 运行时依赖:无
- 构建配置:`vite` + `vite-plugin-dts`,`preserveModules` 保留模块结构
- 类型检查 / Lint:`tsc --noEmit` + ESLint
- 消费方:workspace 内的构建脚本、测试 fixture 等(通过 `./build/*`、`./test/*` 子路径引用)

## 模块 / 文件结构

```
packages/utils/
├── package.json           # private: true；exports 保留 . / ./build/* / ./test/*
├── vite.config.ts         # 入口 src/index.ts，preserveModules，dts 生成
├── tsconfig.json
└── src/
    └── index.ts           # 当前唯一源文件：导出 UTILS_VERSION
```

> 当前 `src/` 下仅有 `index.ts` 一个文件,`package.json` 的 `./build/*` 与 `./test/*` 子路径为**预留位**,尚无对应 `src/build/`、`src/test/` 源码,待后续按需补充构建 / 测试工具。

## 导出 / 子路径

`package.json` 的 `exports` 字段(包 `private: true`,仅 workspace 内可见):

| 子路径 | 解析目标 | 说明 |
| --- | --- | --- |
| `.` | `dist/index.mjs` / `dist/index.cjs`(+ `dist/types/index.d.ts`) | **当前唯一可用导出** |
| `./build/*` | `dist/build/*.{mjs,cjs}`(+ 类型) | 预留:构建工具子路径(尚无对应 src 源码) |
| `./test/*` | `dist/test/*.{mjs,cjs}`(+ 类型) | 预留:测试工具子路径(尚无对应 src 源码) |

`sideEffects: false`,可被 tree-shaking 安全移除。

## 完整导出 API

当前 `src/index.ts` 仅导出一个常量:

### `UTILS_VERSION: string`

工具包版本号常量,当前值 `'0.0.0'`。用于在构建脚本 / 测试中校验工具包版本一致性。

```ts
export const UTILS_VERSION = '0.0.0';
```

> `./build/*` 与 `./test/*` 子路径已预留,后续新增的构建 / 测试工具函数将按子路径分目录组织(如 `src/build/xxx.ts` → `@xui/utils/build/xxx`)。新增工具的函数签名须与源码逐字一致,并在本 README 补充。

## 使用示例

### 1. 在 workspace 内的构建脚本中引用版本

```ts
import { UTILS_VERSION } from '@xui/utils';

if (UTILS_VERSION !== expectedVersion) {
  throw new Error(`@xui/utils 版本不匹配:期望 ${expectedVersion},实际 ${UTILS_VERSION}`);
}
```

### 2. 预留子路径(未来扩展)

```ts
// 当前不可用,待 src/build/ 与 src/test/ 源码落地后启用:
// import { someBuildUtil } from '@xui/utils/build/some-build-util';
// import { someTestHelper } from '@xui/utils/test/some-test-helper';
```

## 关键约定

1. **私有包**:`package.json` 标记 `private: true`,仅 workspace 内消费,禁止被外部应用直接依赖,不进入对外发布产物。
2. **职责分离**:本包面向**工程场景**(构建 / 测试);组件**运行时**工具放在 `@xui/shared`,两者不混用。
3. **子路径分目录**:`./build/*` 与 `./test/*` 子路径对应 `src/build/`、`src/test/` 源码目录(预留),按场景分目录组织,避免单文件膨胀。
4. **tree-shaking 友好**:`sideEffects: false`,工具函数应保持纯函数风格,便于打包器按需裁剪。
5. **类型与 Lint 守护**:`type-check`(`tsc --noEmit`)与 `lint`(`eslint src/**/*.ts`)脚本必须通过,工具函数签名须与 `.d.ts` 一致。
