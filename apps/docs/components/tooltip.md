---
title: 文字提示 Tooltip
---

# 文字提示 <span class="page-head__en">Tooltip</span> <span class="doc-tag">反馈提示</span>

鼠标悬停或聚焦时展示的简单文字气泡，CSS 包裹定位（非 portal），支持四方位与两种触发。

## 功能特性

- placement 支持 top / bottom / left / right 四个方位
- trigger 支持 hover（默认）与 focus；disabled 后不再响应触发
- content 属性或 content 插槽 / renderContent 自定义提示内容

### 使用场景

- 图标按钮说明、字段含义解释、快捷操作提示等轻量辅助说明场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 四个方位

鼠标悬停（或键盘聚焦）触发元素查看对应方位的气泡。

<ComponentDemo slug="tooltip" demo-id="basic" />

### focus 触发与禁用

trigger="focus" 适合输入框；disabled 完全关闭提示能力。

<ComponentDemo slug="tooltip" demo-id="trigger" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="tooltip" kind="props" />

### Slots / 渲染回调

<ComponentApi slug="tooltip" kind="slots" />

## 注意事项

- 气泡采用 CSS 包裹定位而非 portal，父容器存在 overflow: hidden 时可能被裁剪，布局时需留意。
- 自带视口避让：首选方位空间不足时自动翻转到对侧，横向 / 纵向溢出视口边缘时自动钳制，滚动与窗口 resize 时实时重算。

## 无障碍

- focus 触发天然支持键盘；hover 触发元素同样可聚焦，提示与触发元素通过 aria-describedby 关联。
