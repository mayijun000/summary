## CSS中伪类及伪元素用法详解

## 伪类

一个 CSS 伪类是以一个冒号（ : ）作为前缀，被添加到一个选择器末尾的关键字，可以让指定的元素在特定的状态呈现指定的样式。例如 :hover，当用户悬停在指定元素时，可以在这个状态给指定元素添加相应的样式，是在 DOM 树无法描述的状态下才能给元素添加样式。

首先，下方的正方形都没有背景色：

![img](https://pic1.zhimg.com/80/v2-08b8e1c3083f2ab74eb4f3332ef0b850_720w.png)

## 1、:first-child

:first-child 表示在一组兄弟元素中的第一个元素

```html
  /* 所有正方形都没有背景色，因为此时选中的是 <p> 标签*/
  <div class="list">
       <p>.square 这是一个p标签</p>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
  </div>
  .square:first-child{
       background: orangered;
  }
```

效果如下：

![img](https://pic2.zhimg.com/80/v2-8bd703ba1bb7efb1a377a29e1ec8ae25_720w.png)

```html
  /* 第 1 个正方形有背景色，因为此时选中的是第一个 .square */
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
  </div>
  .square:first-child{
       background: orangered;
  }
```

效果如下：

![img](https://pic1.zhimg.com/80/v2-9ad06bfdc777f682fb718750e40ad61c_720w.png)

## 2、:first-of-type

:first-of-type 表示一组兄弟元素中指定类型的第一个元素

```html
  /* :first-of-type 选择在父元素中第一个出现的 .square
  而不管其在兄弟内的位置如何，第一个正方形有背景色 */
  <div class="list">
       <p>.square 这是一个p标签</p>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
  </div>
  .square:first-of-type{
       background: orangered;
  }
```

效果如下：

![img](https://pic1.zhimg.com/80/v2-1d4376d8b198067b42c1e62cd7fdc624_720w.png)

## 3、:last-child

:last-child 表示在一组兄弟元素中的最后一个元素（类似 :first-child）

```html
  /* :last-child 此时选中的是最后一个 .square
  最后一个正方形有背景色 */
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
  </div>
  .square:last-child{
       background: orangered;
  }
```

效果如下：

![img](https://pic3.zhimg.com/80/v2-867844e4a3147bd9a4e0199aa22513c2_720w.png)

## 4、:last-of-type

:last-of-type 表示一组兄弟元素中指定类型的最后一个元素（类似 :first-of-type）

```html
  /* :last-of-type 选择在父元素中最后一个出现的 .square
  而不管其在兄弟内的位置如何，最后一个正方形有背景色 */
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
  </div>
  .square:last-of-type{
       background: orangered;
  }
```

效果如下：

![img](https://pic3.zhimg.com/80/v2-867844e4a3147bd9a4e0199aa22513c2_720w.png)

## 5、:not

:not 一个否定伪类，用于匹配不符合参数选择器的元素

```html
  /* 不含有 .not 的正方形有背景色*/
  <div class="list">
       <div class="square not"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square not"></div>
  </div>
  .square:not(.not){
       background: orangered;
  }
```

效果如下：

![img](https://pic3.zhimg.com/80/v2-4ef872f256c03a193f9d360d5eebb6f2_720w.png)

## 6、:nth-child(an+b)

:nth-child 这个 CSS 伪类首先会找到当前元素的兄弟元素，然后按照位置的先后顺序从1开始排序，选择的结果为第（an+b）个元素的集合（n=0，1，2，3...）。如果 an+b 为 0，无法选中任何元素

### *6-1、:nth-child(4) 匹配位置为 4 的元素*



```html
  /*第 3 个正方形有背景色 因为第 3 个正方形在所有兄弟元素中排第 4 */
  <div class="list">
       <p>.square 这是一个p标签</p>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
  </div>
  .square:nth-child(4) {
       background: orangered;
  }
```

效果如下：

![img](https://pic1.zhimg.com/80/v2-6b06a3aff512f5caf2ea6c92109b4cf0_720w.png)

```html
   /*此时第 4 个正方形有背景色 */
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
  </div>
  .square:nth-child(4) {
       background: orangered;
  }
```

效果如下：

![img](https://pic2.zhimg.com/80/v2-57e7f7a7a5c55e11976b99271020ed05_720w.png)

### *6-2、:nth-child(2n) 匹配位置为2、 4、6、8... 的元素，可以使用 :nth-child(even) 代替*



```html
  /*第 2、 4、6、8 个正方形有背景色 */
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
  </div>
  .square:nth-child(2n) {
       background: orangered;
  }
```

效果如下：

![img](https://pic4.zhimg.com/80/v2-46997a64c9aeebd61c1595b537d64e47_720w.png)

### *6-3、:nth-child(2n+1) 匹配位置为1、 3、5、7... 的元素，可以使用 :nth-child(odd) 代替*

```html
  /*第 1、 3、5、7 个正方形有背景色 */
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
  </div>
  .square:nth-child(2n+1) {
       background: orangered;
  }
```

效果如下：

![img](https://pic3.zhimg.com/80/v2-19eda1eca2c23a35f1854a70b816be72_720w.png)

### *6-4、:nth-child(3n) 匹配位置为 3、6、9... 的元素*

```html
  /*第 3、6 个正方形有背景色 */
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
  </div>
  .square:nth-child(3n) {
       background: orangered;
  }
```

效果如下：

![img](https://pic3.zhimg.com/80/v2-e615aec1aca7d923e0f0f40a03d0502e_720w.png)

## 7、:nth-of-type(an+b)



:nth-of-type 与 nth-child 相似，不同之处在于它是只匹配特定类型的元素

```html
  <div class="list">
       <p>.square 这是一个p标签</p> 
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
  </div>
  .square:nth-of-type(4) {
       background: orangered;
  }
```

效果如下：

![img](https://pic2.zhimg.com/80/v2-57e7f7a7a5c55e11976b99271020ed05_720w.png)

## 8、:nth-last-child(an+b)

:nth-last-child 与 nth-child 相似，它是从最后一个子元素开始计数的

```html
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <p>.square 这是一个p标签</p>
  </div>
  .square:nth-last-child(4) {
       background: orangered;
  }
```

效果如下：

![img](https://pic1.zhimg.com/80/v2-075207e69b04db17d4d78db343d19464_720w.png)

## 9、:nth-last-of-type

:nth-last-of-type 与 nth-of-type 相似，不同之处在于它是从最后一个子元素开始计数的

```html
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <p>.square 这是一个p标签</p>
  </div>
  .square:nth-last-of-type(4) {
       background: orangered;
  }
```

效果如下：

![img](https://pic4.zhimg.com/80/v2-ba675cd6a99f9d0b54113e2c76ad09df_720w.png)

伪元素

伪元素的前缀是两个冒号 ( :: ) ， 同样是添加到选择器后面去选择某个元素的某个部分。伪元素创建了不存在 DOM 树中的元素，并为其添加样式。例如，::after 选择元素后，在其内容后使用 content 添加内容。虽然可以看到添加的内容，但是这些内容实际上不存在 DOM 树中

## 1、::after(:after)

使用 ::after 会创建一个伪元素，该伪元素会成为选中元素的最后一个子元素

```html
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <p>.square 这是一个p标签</p>
  </div>
  p::after{
       content: "✨✨";
  }
```

效果如下：

![img](https://pic2.zhimg.com/80/v2-fb114c9c3161ceaf1cc91a21f3bcce5d_720w.png)

## 2、::before(:before)

使用 ::before 会创建一个伪元素，该伪元素会成为选中元素的第一个子元素

```html
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <p>.square 这是一个p标签</p>
  </div>
  p::before{
       content: "✨✨";
  }
```

效果如下：

![img](https://pic4.zhimg.com/80/v2-89807205866c8dda64e31b324d25b0e3_720w.png)

## 3、::first-letter(:first-letter)

::first-letter 选中某块级元素第一行的第一个字母，并且文字所处的行之前没有其他内容

```html
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <p>.square 这是一个p标签</p>
  </div>
  p::first-letter{
       color: red;
  }
```

效果如下：

![img](https://pic1.zhimg.com/80/v2-0e836ee0b8fb0298b704c6e349beea68_720w.png)

## 4、::first-line(:first-line)

::first-line 在某块级元素的第一行应用样式。第一行的长度取决于很多因素，包括元素宽度，文档宽度和文本的文字大小。和其他所有的伪元素一样，::first-line 不能匹配任何真实存在的 html 元素。::first-line 伪元素只能在块容器中，所以，::first-line 伪元素只能在一个 display 值为 block,，inline-block，table-cell 或者 table-caption 中有用

```html
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <p>.square 这是一个p标签</p>
  </div>
  p::first-line{
       color: red;
  }
```

效果如下：

![img](https://pic4.zhimg.com/80/v2-0c5ce5b9a247c7a583902c2ba9e3de1f_720w.png)

## 5、::selection

::selection 用于文档中被用户高亮的部分（比如使用鼠标或其他选择设备选中的部分）

```html
  <div class="list">
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <div class="square"></div>
       <p>.square 这是一个p标签</p>
  </div>
  p::selection{
       background-color: #ffeb3b;
  }
```

使用鼠标选中亮字，效果图：

![img](https://pic1.zhimg.com/80/v2-5c005463708b01e6bdab323a74a66944_720w.png)

兼容性

## 伪类的兼容性：

![img](https://pic3.zhimg.com/80/v2-6d242c304885964c15a83fd26dff9726_720w.jpg)

