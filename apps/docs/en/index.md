---
layout: home

hero:
  name: XUI
  text: Cross-Framework UI
  tagline: One core contract, isomorphic components for Vue 3 and React 19
  actions:
    - theme: brand
      text: Components
      link: /en/components/button
    - theme: alt
      text: Theming
      link: /en/guide/theme

features:
  - title: Single Contract @xui-design/core
    details: ComponentSpec is the only contract for both frameworks. Props / Events / Slots are defined at the contract layer; adapters must not diverge.
  - title: Isomorphic Vue / React
    details: 'Same components, same API surface: Vue events map to React callbacks, Vue slots map to React renderXxx props one by one.'
  - title: Single Source of Styles
    details: '@xui-design/styles ships unified BEM class names and CSS variable theming — zero style drift across frameworks.'
  - title: Single Core Logic Implementation
    details: '@xui-design/shared holds state and interaction logic; both adapters stay thin. Fully typed under TypeScript strict mode.'
---

<ComponentOverview />
