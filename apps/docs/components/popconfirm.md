---
title: 气泡确认 Popconfirm
---

# 气泡确认 <span class="page-head__en">Popconfirm</span> <span class="doc-tag">反馈提示</span>

点击元素弹出轻量确认气泡，适合"删除"等需要二次确认但不必打断整页的操作。

## 功能特性

- 点击触发元素切换气泡，确定 / 取消按钮在收起后分别回调 confirm / cancel
- confirmText / cancelText 自定义按钮文本（未提供时取全局语言包，zh-CN 默认"确定"/"取消"），placement 控制四方位
- content 属性或 content 插槽 / renderContent 自定义确认文案；disabled 关闭交互
- 点击气泡外部仅收起，不触发任何回调

### 使用场景

- 删除 / 提交等轻量二次确认、危险操作前置拦截等场景。

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 删除确认

点击触发元素弹出确认，确定与取消分别触发不同回调。

<ComponentDemo slug="popconfirm" demo-id="basic" />

### 方位 / 按钮文本 / 禁用

placement 右侧弹出并自定义按钮文案；disabled 下点击无效。

<ComponentDemo slug="popconfirm" demo-id="variants" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="popconfirm" kind="props" />

### Events / 回调

<ComponentApi slug="popconfirm" kind="events" />

### Slots / 渲染回调

<ComponentApi slug="popconfirm" kind="slots" />

## 注意事项

- 点击外部关闭只收起气泡，不会触发 confirm 或 cancel，便于用户无副作用地放弃操作。
- 气泡为 CSS 包裹定位，与 Tooltip 类似，需注意父容器 overflow 裁剪。
- 自带视口避让：首选方位空间不足时自动翻转（箭头跟随），溢出视口边缘时自动钳制，滚动与窗口 resize 时实时重算。

## 无障碍

- 确认 / 取消为原生按钮可键盘操作，气泡打开后焦点进入弹层，Esc 可取消关闭。
