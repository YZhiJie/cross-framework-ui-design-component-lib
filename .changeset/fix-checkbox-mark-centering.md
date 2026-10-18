---
"@xui-design/styles": patch
---

修复 Cascader / Tree / TreeSelect 复选框勾选标记未居中问题：勾选 ✓ 与半选横条从手写绝对定位偏移（left: 3px / top: 0，实际偏左上约 2-3px）改为 `left/top: 50% + translate(-50%, -50%)` 实现水平垂直双居中，✓ 附加 -1px 左移补偿旋转后的视觉重心右偏。
