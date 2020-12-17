# BFC是什么

块级格式化上下文，通俗一点来讲，可以把 BFC 理解为一个封闭的大箱子，箱子内部的元素无论如何翻江倒海，都不会影响到外部。

只要元素满足下面任一条件即可触发 BFC 特性：

- body 根元素
- 浮动元素：float 除 none 以外的值
- 绝对定位元素：position (absolute、fixed)
- display 为 inline-block、table-cells、flex
- overflow 除了 visible 以外的值 (hidden、auto、scroll)

 

## BFC 特性及应用

同一个 BFC 下外边距会发生折叠

BFC 可以包含浮动的元素（清除浮动）

BFC 可以阻止元素被浮动元素覆盖

