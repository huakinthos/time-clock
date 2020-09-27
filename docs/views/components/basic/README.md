---
title: 'Basic 基础'
sidebarDepth: 2
---

## Button 按钮
<ClientOnly>
  <zja-button />
<font size=5>Attributes</font>
| 参数| 说明 | 类型 | 可选值 | 默认值 |
| :------ | ------ | ------ | ------ | ------ |
| type | 按钮类型 | string |primary, info, success, warning, danger | - |
| disabled | 按钮是否禁用 | boolean |- | false |
| icon | 按钮上图标名称 | string |- | - |
| icon-position | 图标在按钮的左右位置 | string|left, right  | - |
| loading | 显示加载中图标 | boolean |- | false |
</ClientOnly>

## Icon图标

## Layout布局
<ClientOnly>
  <zja-layout />
<font size=5>Row Attributes</font>
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----- | ----- | ----- | ----- | ----- |  
| interval | 每个col栅格间隔 | number | - | - |
| align | 响应式布局下的水平排列方式 | string | center, left, right | left |

<font size=5>col Attributes</font>
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| ----- | ----- | ----- | ----- | ----- |  
| span | 栅格占比 | number | 0-24 | 24 |
| offset | 栅格左偏移 | number | - | 0 |
| xs | 小于576px, 栅格的属性 | {span: 4, offset: 4 } | - | - |
| sm | 576-768px, 栅格的属性 | ^ | - | - |
| md | 768-992 | ^ | - | - |
| lg | gg2-1200 | ^ | - | - | 
| xl | 大于1200 | ^ | - | - |
</ClientOnly>