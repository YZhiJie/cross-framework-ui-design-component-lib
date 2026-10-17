# Theming <span class="page-head__en">主题定制</span> <span class="doc-tag">Guide</span>

A three-layer theming system based on CSS variables: global light/dark switching, site-wide brand token customization, and per-component scoped overrides — both frameworks (@xui-design/vue / @xui-design/react) share the same runtime API.

## How It Works

- **Light & Dark Themes**: component styles only consume semantic tokens (`--xui-color-*`); the dark theme overrides all semantic colors through the `[data-theme='dark']` selector. Switching themes simply toggles an attribute on `<html>`.
- **Global Tokens**: `setThemeTokens` writes CSS variables as inline styles on `<html>`, cascading over the preset tokens — effective site-wide instantly, no refresh needed.
- **Component-Level Customization**: write CSS variables directly on the root element `style` (both frameworks pass custom properties through style); the cascade applies only to that subtree.

## Examples

Each demo can be switched between Vue and React tabs for live interaction, with source code available per framework.

### Global Light & Dark Switching

setTheme writes &lt;html data-theme&gt; and every component switches semantic colors accordingly; toggleTheme alternates between light and dark.

<GuideDemo guide="theme" demo-id="dark" />

### Global Brand Tokens (setThemeTokens)

setThemeTokens writes CSS variables to &lt;html&gt;, affecting every component site-wide; clearThemeTokens only removes tokens written by this API.

<GuideDemo guide="theme" demo-id="tokens" />

### Component-Level Theming

No API needed: write CSS variables directly on a component style; the cascade applies only to that subtree and takes precedence over global tokens.

<GuideDemo guide="theme" demo-id="scoped" />

## API

The theming API is provided by `@xui-design/shared` (framework-agnostic implementation). `@xui-design/vue` and `@xui-design/react` re-export it under the same names with identical behavior.

### Imperative Methods

<GuideApi guide="theme" kind="methods" />

### Contract Types

**XuiTheme**

```ts
type XuiTheme = 'light' | 'dark';
```

Theme name (light is the default; dark is provided by the [data-theme=dark] block in tokens.scss).

**ThemeTokens**

```ts
type ThemeTokens = Record<string, string>;
```

A set of theme tokens: keys are CSS custom property names (starting with --), values are the corresponding CSS values.
