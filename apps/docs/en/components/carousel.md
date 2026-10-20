---
title: Carousel
---

# Carousel <span class="page-head__en">轮播图</span> <span class="doc-tag">Data Display</span>

Center-focused carousel: the active slide is enlarged and highlighted while side slides shrink, dim and partially peek in; supports infinite loop, autoplay, arrows/dots navigation and a skewed variant.

## Features

- Center focus: the active slide scales to fill the track while neighbors peek in at 60% width
- Infinite loop via head/tail clones with a seamless snap-back frame
- Autoplay pauses on hover / hidden tab and resumes automatically
- Arrows, dots and imperative API navigation
- skewed variant: parallelogram slides with counter-skewed content
- Controlled and uncontrolled modes (value + onChange)
- Geometry and colors overridable via root CSS variables (height/slide width/scale/dim)

### When to Use

- Hero banner carousels on marketing sites
- Promotional content card carousels
- Wide banner showcases on large screens (with the skewed variant)

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Basic Usage

Infinite loop and autoplay (3s, pauses on hover) by default; navigate via arrows and dots. Current index is controlled through v-model:value.

<ComponentDemo slug="carousel" demo-id="basic" />

### Skewed Variant

skewed enables the tilted look: slides are clipped as parallelograms with counter-skewed content keeping images level; geometry is customized via root CSS variables.

<ComponentDemo slug="carousel" demo-id="tilt" />

## API

`@xui-design/core` ComponentSpec · single contract, identical on both frameworks

### Props

<ComponentApi slug="carousel" kind="props" />

### Events / Callbacks

<ComponentApi slug="carousel" kind="events" />

### Imperative Methods

<ComponentApi slug="carousel" kind="methods" />

### Contract Types

**CarouselItem**

```ts
type CarouselItem = {
  key: string;
  image: string;
  alt?: string;
};
```

Slide shape; key must be unique within items (clones and dots depend on it)

## Notes

- Infinite loop is implemented with head/tail clones: wrap moves target a clone during the transition, then snap back to the normalized index seamlessly.
- Moves issued during a transition (within duration) are dropped to keep clone positions in range; keep interval greater than duration.
- In controlled mode update:value/change fire when the move starts; dots stay on the controlled value if the prop is not written back.
- Geometry and colors are overridable via root CSS variables: --xui-carousel-height (400px), --xui-carousel-slide-width (60%), --xui-carousel-active-scale (1.3 / 1.1 when skewed), --xui-carousel-dim-opacity (0.5).
- The skewed variant zooms content to cover the clipped corners, best for wide banners; extremely tall-narrow containers may show corner gaps.

## Accessibility

- Root uses the region role (aria-roledescription="carousel") with localized region text; inactive slides carry aria-hidden.
- Arrows and dots are native buttons (type="button") with localized aria-labels (previous / next / go to slide n).
