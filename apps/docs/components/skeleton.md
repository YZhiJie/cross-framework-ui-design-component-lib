---
title: 骨架屏 Skeleton
---

# 骨架屏 <span class="page-head__en">Skeleton</span> <span class="doc-tag">数据展示</span>

数据加载中的占位屏，在内容就绪前提供结构感知，支持头像占位与自定义行数。

## 功能特性

- loading 控制骨架 / 真实内容切换，false 时渲染默认插槽内容
- avatar 显示头部头像占位，rows 配置段落行数（收敛为正整数，默认 3）

### 使用场景

- 卡片 / 列表 / 详情页首次加载、弱网等待数据等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 加载切换

loading=true 显示骨架，false 渲染插槽中的真实内容。

<ComponentDemo slug="skeleton" demo-id="basic" />

### 头像占位与行数

avatar 渲染圆形头像占位；rows 控制文本段落条数。

<ComponentDemo slug="skeleton" demo-id="variants" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="skeleton" kind="props" />

### Slots / 渲染回调

<ComponentApi slug="skeleton" kind="slots" />

## 注意事项

- rows 传入 0 或负数等非法值会收敛为 1，保证至少渲染一行。

## 无障碍

- 骨架区域标记为忙碌状态（aria-busy），读屏可感知内容正在加载。
