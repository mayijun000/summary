**目标：**基于vue的，pc前端页面适配

**步骤：**在百度上找到两种实现方式：

1、[Vue项目中使用vw实现移动端适配](https://www.cnblogs.com/kdcg/p/9106463.html)

2、[Vue rem适配布局方案](https://www.jianshu.com/p/1d913261d56f)

分别验证两种方式是否可行，先看一下两种方式的实现原理：

1、vw的方式进行适配，根据视口viewport动态计算，根据[CSS3规范](https://drafts.csswg.org/css-values-3/#viewport-relative-lengths)，视口单位主要包括以下4个：

- vw : 1vw 等于视口宽度的1%
- vh : 1vh 等于视口高度的1%
- vmin : 选取 vw 和 vh 中最小的那个
- vmax : 选取 vw 和 vh 中最大的那个
- **IE**：自 **IE10** 起（包括 **Edge**）到现在还只是部分支持（不支持 **vmax**，同时 **vm** 代替 **vmin**）

视口viewport即浏览器可视区域大小 
我们可以这样理解 100vw = window.innerwidth, 100vh = window.innerheight 

对于设计稿的尺寸转换为vw单位，我们使用Sass函数编译[·](http://caibaojian.com/vw-vh.html)

```css
//iPhone 6尺寸作为设计稿基准
$vm_base: 375; 
@function vw($px) {
    @return ($px / 375) * 100vw;
}
```

2、rem是相对于根元素的字体大小的单位，也就是html的font-size大小，浏览器默认的字体大小是16px，所以默认的1rem=16px，我们可以根据设备宽度动态设置根元素的font-size，使得以rem为单位的元素在不同终端上以相对一致的视觉效果呈现。

3、两者对比

1）vw没有根元素大小的限制，浏览器默认最小字体12px，所以rem计算会有一定限制。

2）rem需要在html页面引入计算js，需要依赖js控制。

3）vm兼容性没有全部支持，但基本满足使用。



**实现方式：**最后选择vw的方式进行适配

**第一步：**在html页面设置，禁止用户放大缩小，在不同的像素下都是使用1倍的像素值

```html
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```

```html
meta[name="viewport"]里各参数的含义为：
 
　　width: 设置layout viewport 的宽度，为一个正整数，或字符串”width-device”。
 
　　initial-scale: 设置页面的初始缩放值，为一个数字，可以带小数。
 
　　minimum-scale: 允许用户的最小缩放值，为一个数字，可以带小数。
 
　　maximum-scale: 允许用户的最大缩放值，为一个数字，可以带小数。
 
　　height: 设置layout viewport 的高度，这个属性对我们并不重要，很少使用。
 
　　user-scalable: 是否允许用户进行缩放，值为“no”或“yes”。
```

##### 第二步：安装插件

为了实现vw兼容方案，我们需要安装如下插件：

- postcss-import [相关配置](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fpostcss%2Fpostcss-import)
  主要功有是解决`@import`引入路径问题。使用这个插件，可以很轻易的使用本地文件、`node_modules`或者`web_modules`的文件。这个插件配合`postcss-url`使引入文件变得更轻松。
- postcss-url [相关配置](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fpostcss%2Fpostcss-url)
  主要用来处理文件，比如图片文件、字体文件等引用路径的处理。
- postcss-px-to-viewport [相关配置](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fevrone%2Fpostcss-px-to-viewport)
  主要用来把`px`单位转换为`vw`、`vh`、`vmin`或者`vmax`这样的视窗单位，也是`vw`适配方案的核心插件之一。
- postcss-viewport-units [相关配置](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fspringuper%2Fpostcss-viewport-units)
  主要是给CSS的属性添加`content`的属性，给`vw`、`vh`、`vmin`和`vmax`做适配的操作，这是实现vw布局必不可少的一个插件。
- postcss-cssnext [相关配置](https://links.jianshu.com/go?to=https%3A%2F%2Fcssnext.io%2Ffeatures%2F%23automatic-vendor-prefixes)
  该插件可以让我们使用CSS未来的特性，其会对这些特性做相关的兼容性处理。
- cssnano [相关配置](https://links.jianshu.com/go?to=https%3A%2F%2Fcssnano.co%2Fguides%2Fgetting-started%2F)
  主要用来压缩和清理CSS代码。在Webpack中，`cssnano`和[`css-loader`](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fcss-loader)捆绑在一起，所以不需要自己加载它。
- postcss-write-svg [相关配置](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fjonathantneal%2Fpostcss-write-svg)
  主要用来处理移动端1px的解决方案
- postcss-aspect-ratio-mini [相关配置](https://links.jianshu.com/go?to=https%3A%2F%2Fgithub.com%2Fyisibl%2Fpostcss-aspect-ratio-mini)
  主要用来处理元素容器宽高比

**安装命令**

```js
npm i postcss-aspect-ratio-mini postcss-px-to-viewport postcss-write-svg postcss-cssnext postcss-viewport-units cssnano cssnano-preset-advanced --S  
```

##### 第三步：插件配置

找到postcss的配置文件，在工程的根目录中**postcss.config.js**或者**.postcssrc.js**文件

```js
module.exports = {
  "plugins": {
  	"autoprefixer": {},
    "postcss-import": {},
    "postcss-url": {},
    "postcss-aspect-ratio-mini": {},
    "postcss-write-svg": {
      utf8: false
    },
    "postcss-cssnext": {},
    "postcss-px-to-viewport": {
      viewportWidth: 1920,     //  视窗的宽度，对应的是我们设计稿的宽度，移动端一般是750，如果是pc端那就是类似1920这样的尺寸
      viewportHeight: 1080,    // 视窗的高度，移动端一般指定1334，也可以不配置
      unitPrecision: 1,       // 指定`px`转换为视窗单位值的小数位数（很多时候无法整除）
      viewportUnit: 'vw',    // 指定需要转换成的视窗单位，建议使用vw
      fontViewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines'],  // 指定不转换为视窗单位的类，可以自定义，可以无限添加,建议定义一至两个通用的类名
      minPixelValue: 1,      // 小于或等于`1px`不转换为视窗单位，你也可以设置为你想要的值
      mediaQuery: false      // 允许在媒体查询中转换`px`
    },
    "postcss-viewport-units":{},
    "cssnano": {
      preset: "advanced", 
    	autoprefixer: false, 
      "postcss-zindex": false
    }
  }
}
```

