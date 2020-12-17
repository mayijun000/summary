# CSS 样式优先级

**CSS 优先规则1**： 最近的祖先样式比其他祖先样式优先级高。

例1：

```html
<!-- 类名为 son 的 div 的 color 为 blue -->
<div style="color: red">
    <div style="color: blue">
        <div class="son"></div>
    </div>
</div>
```

如果我们把一个标签从祖先那里继承来的而自身没有的属性叫做“祖先样式”，那么“直接样式”就是一个标签直接拥有的属性。又有如下规则：

**CSS 优先规则2**：“直接样式”比“祖先样式”优先级高。

例2：

```html
<!-- 类名为 son 的 div 的 color 为 blue -->
<div style="color: red">
    <div class="son" style="color: blue"></div>
</div>
```

## 选择器的优先级

上面讨论了一个标签从祖先继承来的属性，现在讨论标签自有的属性。在讨论 CSS 优先级之前，先说说 CSS 7 种基础的选择器：

- ID 选择器， 如 #id{}
- 类选择器， 如 .class{}
- 属性选择器， 如 a[href="[http://zhihu.com](http://zhihu.com/)"]{}
- 伪类选择器， 如 :hover{}
- 伪元素选择器， 如 ::before{}
- 标签选择器， 如 span{}
- 通配选择器， 如 *{}

**CSS 优先规则3**：优先级关系：内联样式 > ID 选择器 > 类选择器 = 属性选择器 = 伪类选择器 > 标签选择器 = 伪元素选择器

**CSS 优先规则4**：计算选择符中 ID 选择器的个数（a），计算选择符中类选择器、属性选择器以及伪类选择器的个数之和（b），计算选择符中标签选择器和伪元素选择器的个数之和（c）。按 a、b、c 的顺序依次比较大小，大的则优先级高，相等则比较下一个。若最后两个的选择符中 a、b、c 都相等，则按照“就近原则”来判断。

例4：

```html
// HTML
<div id="con-id">
    <span class="con-span"></span>
</div>

// CSS
#con-id span {
    color: red;
}
div .con-span {
    color: blue;
}
```

由规则 4 可见，<span> 的 color 为 red。

如果外部样式表和内部样式表中的样式发生冲突会出现什么情况呢？这与样式表在 HTML 文件中所处的位置有关。样式被应用的位置越在下面则优先级越高，其实这仍然可以用规则 4 来解释。

例5：

```html
// HTML
<link rel="stylesheet" type="text/css" href="style-link.css">
<style type="text/css">
    @import url(style-import.css); 
    div {
        background: blue;
    }
</style>

<div></div>

// style-link.css
div {
    background: lime;
}

// style-import.css
div {
    background: grey;
}
```

从顺序上看，内部样式在最下面，被最晚引用，所以 <div> 的背景色为 blue。

上面代码中，`@import` 语句必须出现在内部样式之前，否则文件引入无效。当然不推荐使用 `@import` 的方式引用外部样式文件，原因见另一篇博客：[CSS 引入方式](https://link.zhihu.com/?target=http%3A//segmentfault.com/a/1190000003866058)。

CSS 还提供了一种可以完全忽略以上规则的方法，当你一定、必须确保某一个特定的属性要显示时，可以使用这个技术。

**CSS 优先规则5**：属性后插有 `!important` 的属性拥有最高优先级。若同时插有 `!important`，则再利用规则 3、4 判断优先级。

例6：

```js
// HTML
<div class="father">
    <p class="son"></p>
</div>

// CSS
p {
    background: red !important;
}
.father .son {
    background: blue;
}
```