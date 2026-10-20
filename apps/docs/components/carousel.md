---
title: 轮播图 Carousel
---

# 轮播图 <span class="page-head__en">Carousel</span> <span class="doc-tag">数据展示</span>

中心聚焦式轮播：激活项放大高亮、两侧项缩小变暗并部分露出（三图效果），支持无限循环、自动播放、箭头/指示点切换与倾斜变体。

## 功能特性

- 中心聚焦：激活项按倍数放大铺满轨道，相邻项以 60% 宽度部分露出形成三图布局
- 无限循环：首尾克隆位无缝环绕，收敛帧无回跳闪烁
- 自动播放（悬停/页面隐藏时暂停，恢复可见自动续播）
- 箭头 / 指示点 / 命令式 API 三种导航方式
- skewed 倾斜变体：幻灯片平行四边形裁切、内容反向矫正
- 受控/非受控双模式（value + onChange 约定）
- 根节点 CSS 变量可覆盖几何与配色（高度/幻灯片宽度/缩放倍数/变暗程度）

### 使用场景

- 官网首页 / 营销页的首屏 Banner 轮播
- 运营活动页的推荐内容卡片轮播
- 大屏展示中的宽幅图文轮播（配合倾斜变体）

## 代码演示

每个 demo 均可切换 Vue / React 标签页实时交互，并可展开查看对应框架源码。

### 基础用法

默认无限循环 + 自动播放（3s，悬停暂停），箭头与指示点切换；通过 v-model:value 受控展示当前索引。

<ComponentDemo slug="carousel" demo-id="basic" />

### 倾斜变体

skewed 开启倾斜效果（对应「有倾斜」版本）：幻灯片以平行四边形裁切、内容反向矫正保持图片水平；几何经根节点 CSS 变量自定义。

<ComponentDemo slug="carousel" demo-id="tilt" />

## API 文档

`@xui-design/core` ComponentSpec · 唯一契约基准，双端一致

### Props

<ComponentApi slug="carousel" kind="props" />

### Events / 回调

<ComponentApi slug="carousel" kind="events" />

### 命令式方法

<ComponentApi slug="carousel" kind="methods" />

### 契约类型

**CarouselItem**

```ts
type CarouselItem = {
  key: string;
  image: string;
  alt?: string;
};
```

轮播项结构；key 需在 items 内唯一（克隆位与指示点均依赖它）

## 注意事项

- 无限循环通过首尾克隆位实现：环绕切换时轨道瞬时指向克隆位，动画结束后无感回跳归一化位。
- 切换动画进行中（duration 内）的再次切换会被丢弃，避免克隆位越界；自动播放间隔应大于动画时长。
- 受控模式下 update:value/change 在切换开始时即触发；若外部未回写 value，指示点保持受控值。
- 几何与配色可经根节点 CSS 变量覆盖：--xui-carousel-height（轨道高度，默认 400px）、--xui-carousel-slide-width（幻灯片宽度，默认 60%）、--xui-carousel-active-scale（激活缩放，默认 1.3 / skewed 1.1）、--xui-carousel-dim-opacity（非激活透明度，默认 0.5）。
- skewed 变体内容层统一放大以覆盖倾斜裁切的边角，适合横向宽幅图；极端窄高容器可能出现边角空隙。

## 无障碍

- 根节点为 region 角色（aria-roledescription="carousel"），语言包提供区域文案；非激活幻灯片带 aria-hidden。
- 箭头与指示点为原生 button（type="button"），aria-label 由语言包提供（上一张/下一张/第 n 张）。
