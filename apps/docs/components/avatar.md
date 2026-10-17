---
title: 头像 Avatar
---

# 头像 <span class="page-head__en">Avatar</span> <span class="doc-tag">数据展示</span>

展示用户或事物的图片 / 文字头像，支持三种尺寸、圆形方形与图片失败回退。

## 功能特性

- size 支持 sm / md / lg，shape 支持 circle / square
- 内容优先级：加载成功的图片 ＞ 默认插槽 / children（文字图标）＞ 默认图标
- src 加载失败自动回退并触发 error 事件

### 使用场景

- 用户信息、评论列表、导航栏账号入口等需要形象标识的场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 图片 / 文字 / 尺寸

src 为图片地址；无图时显示插槽文字；size 控制三档尺寸。

<ComponentDemo slug="avatar" demo-id="basic" />

### 形状与失败回退

shape 切换方形 / 圆形；图片加载失败时回退为插槽内容或默认图标。

<ComponentDemo slug="avatar" demo-id="shape" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="avatar" kind="props" />

### Events / 回调

<ComponentApi slug="avatar" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="avatar" kind="slots" />

## 注意事项

- 同时提供 src 与插槽内容时，图片加载成功只显示图片；失败后才显示插槽回退内容。

## 无障碍

- 提供 alt 时图片具备替代文本；纯装饰头像建议省略 alt，由读屏跳过。
