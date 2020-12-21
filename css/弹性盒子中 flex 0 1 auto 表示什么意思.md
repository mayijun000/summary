# 弹性盒子中 flex: 0 1 auto 表示什么意思

flex Box 布局（Flexible Box）旨在提供一种更有效的方式来布局、对齐和分配容器中项目之间的空间，即使它们的大小是未知的或动态改变的。其主要思想是让容器能根据可用空间的大小来动态地改变其元素的宽度和高度。

`flex` CSS 属性设置的是， `flex` 元素如何根据其在 `flex` 容器中的所剩空间来动态拉伸或收缩，它是 `flex-grow` 、 `flex-shrink` 、 `flex-basis` 这三个属性的简化版。

其 **语法格式** 有 `单值、双值、三值` 三种语法格式。

### **单值语法**

值必须是如下之一：

- 数值 `number` ，那么解释为 `flex: number 1 0`
- `none` 、 `auto` 、 `initial`

### **双值语法**

第一个值必须是 `number` ，它会被解释为 `flex-grow` 属性，第二个值必须是如下之一：

- 数值 `number` ，会被解释为 `flex-shrink` 属性
- 一个能够描述 **宽度** 的值，例如 `10em` 、 `30%` 、 `min-content` ，会被解释为 `flex-basis` 属性

### **三值语法**

三个值的含义：

- 第一个 `number` 表示 `flex-grow`
- 第二个 `number` 表示 `flex-shrink`
- 第三个描述宽度的值表示 `flex-basis`

## **`flex`** **各属性含义介绍**

### **`flex-grow`**

这个属性设置的是当前 `flex` 元素在 `main-size` 中的伸缩系数， `main-size` 指的是宽度和高度（由 `flex-direction` 属性控制），这个属性的默认值是 `0` 。

`flex` 值越大，代表所占的空间越大。如下图所示， `A` 、 `B` 、 `C` 、 `F` 这几个元素设置的 `flex` 值为 `1` ，而 `D` 、 `E` 元素设置的 `flex` 值为 `2` ，所以 `D` 和 `E` 元素所占的比例就是其它几个的两倍。

![img](https://pic1.zhimg.com/80/v2-e0ee83efedebf51c2e3c5918aa50a1a0_720w.png)

### **`flex-shrink`**

`flex-shrink` 属性设置的是 `flex` 元素的收缩系数。假设所有元素加起来的大小超出了 `flex`容器，那么就需要用 `flex-shrink` 这个属性来控制如何收缩。它的默认值是 `1` 。

如下图所示， `A` 、 `B` 、 `C` 、 `D` 、 `E` 这几个元素的大小超出了容器大小本身， `A` 、 `B` 、`C` 设置的 `flex-shrink` 属性的值为 `1` ， `D` 和 `E` 属性设置的值是 `2` ，那么 `D` 和 `E` 这两个元素的大小会更小一点，这两个收缩的会 **更厉害** 一点。

![img](https://pic2.zhimg.com/80/v2-0606d9b757ae3cea5cfcf922abc43781_720w.png)

### **`flex-basis`**

这个属性设置的是一个 `flex` 元素的 **初始大小** 。它可以用以下几种值填充：

（1）宽度

```text
flex-basis: 10em;      
flex-basis: 3px;
flex-basis: auto;
复制代码
```

`auto` 是 `flex-basis` 的默认值

（2）内置调节大小的关键字

```text
flex-basis: fill;
flex-basis: max-content;
flex-basis: min-content;
flex-basis: fit-content;
复制代码
```

（3）根据内容自动调节大小

```text
flex-basis: content;
复制代码
```

（4）全局值

```text
flex-basis: inherit;
flex-basis: initial;
flex-basis: unset;
复制代码
```

## **`flex`** **属性常用值**

### **`flex: 0 auto`**

`flex: 0 auto` 等同于 `flex: initial` ，也是 `flex: 0 1 auto` 的简写表达。它根据元素自身的`width` 或 `height` 属性来调节元素大小。

当还剩余一些空闲空间时，它使 `flex` 元素呈现的是固定大小的样式；当没有足够的空间时，它允许它收缩到最小。 `auto` 边距可用于根据主轴来对齐元素。

### **`flex: auto`**

`flex: auto` 等同于 `flex: 1 1 auto` ，它根据元素的 `width` 或 `height` 属性调整元素的大小，但是其非常灵活，以便让它们吸收沿主轴的任何额外空间。

### **`flex: none`**

`flex: none` 等同于 `flex: 0 0 auto` 。它根据 `width` 和 `height 来调节元素大小，但是完全不灵活