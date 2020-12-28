# JavaScript系列之立即执行函数IIFE

**IIFE(Immediately Invoked Functions Expressions)**其实可以就字面上直接来理解，Immediately就是立即的意思，invoked则是执行某个函数时「执行」的意思，function expression是一种用来创建函数的方法，**总的来说，就是用函数表达式的方式建立函数后并立即执行它**。

下面我们将做更进一步的介绍和说明。

## 函数的声明

JavaScript 中有两种常见的声明函数的方法，分别是通过**function 命令**或**函数表达式声明**，来看个简单的例子：

```js
// function 命令 
function  sayHi ( name )  { 
  console . log ( 'Hi'  + name ) ; 
} 
sayHi( 'miqilin' ) ;

// 函数表达式
var  sayHello  =  function ( name )  { 
  console . log ( 'Hello '  + name ) ; 
} 
sayHello( 'miqilin' ) ;
```

## 立即执行函数(IIFE)

那么什么是**IIFE**呢？如同文章一开始所叙述的，**IIFE指的就是通过函数表达式的方式来创建函数，并且立即执行它**。那我们要怎么做呢？

首先我们可以用console.log的方式，先来看一下，我们刚刚创建的sayHello打印出来会长什么样子呢？

```js
// 函数表达式
var  sayHello  =  function ( name )  { 
  console . log ( 'Hello '  + name ) ; 
} 
console.log(sayHello);
```

结果会发现，直接把sayHello打印出来后，它会直接返回整个函数的代码内容，这是尚未"执行（Invoked）"代码前的结果。

![img](https://pic2.zhimg.com/80/v2-4475fb1d65c00ce361aadcb608430711_720w.jpg)

如果是IIFE就在这段代码的最后，加上一个执行的指令，也就是括号( )：

![img](https://pic4.zhimg.com/80/v2-8151b9505bc62df0e9e2998c531a49ff_720w.jpg)

上图就可以看出，在我们定义函数的同时，这段函数就会立即被执行了，当然最后的( )中可以加入参数：

![img](https://pic3.zhimg.com/80/v2-0f71e6c3ef39e23a45e779c2f4b35c0e_720w.jpg)

那如果我们把前面的声明变量去了呢，变成一个匿名函数：

```js
//不可行的做法
function ( name )  { 
  console.log( 'Hello '  + name ) ; 
}
```

但是这么做是不可行的，因为JavaScript引擎在解析代码的时候，你用function作为开头，引擎会认为你现在要输入function 命令去创建函数，**可是你却没有给该function名称，于是它无法正确理解这段代码便抛出错误**：

![img](https://pic2.zhimg.com/80/v2-64f2cf0f7fa3b3de250103075aa6fe85_720w.jpg)

所以，这时候我们要做的是告诉JavaScript 引擎说，这一整个并不是function 命令。要达到这样的目的，我们要让引擎在解析代码的时候，不是以读到function 作为开头。

为了要达到这样的目的，我们最常使用的做法就是用括号()将function(){ ...}包起来，像是这样：

```js
(function ( name )  { 
  console.log( 'Hello '  + name ) ; 
});
```

**因为我们只会在括号内放入表达式，例如(3+2)，而不会放命令在括号内，所以JavaScript就会以表达式的方式来读取这段函数**。

在这种情况下，这个函数会被建立，但是不会被存在任何变量当中，也不会被执行。

结合刚刚上面IIFE的概念，我们可以在创建这个函数的同时，将这个函数加以执行，我们同样只需要在最后加上括号()就可以了：

![img](https://pic1.zhimg.com/80/v2-0b849117f6ac9e24345f4a4d97b93934_720w.jpg)

这样IIFE的型式，会在许多的JavaScript框架中都看得到，比如jQuery，jQuery用了这样的手法将`window`与`undefined`保留起来：

```js
(function( window, undefined ) {

  // 略...

})( window );
```

其中`undefined`是可以被修改的，虽然jQuery在IIFE定义了两个参数，但只传了一个`winodw`，就是为了保持`undefined`原本的样子。

**通过这样的方式，我们可以「直接执行某个函数」，一个很重要的一点是，这样做不仅避免了外界访问此 IIFE 内的变量，而且又不会污染全局作用域**。

## IIFE执行过程解析

先看段IIFE实例代码：

```js
//IIFE 
(function(name){
  var greeting = 'Hello';
  console.log(greeting+ ' ' +name);
})("miqilin");
```

让我们看看，当我们在执行这段代码的过程中，JavaScript引擎实际发生了什么事吧！

首先，当我执行这段代码时，会先建立全局执行上下文（Global Execution Context），但这时候这个执行上下文里面是没有任何内容的，因为我们并没有在全局这层建立任何变量（如果有的话，变量的名称会先提升在全局上下文中。）

![img](https://pic3.zhimg.com/80/v2-91d51a4e12ae493be6c3215d2262bc3e_720w.jpg)

接着，JavaScript引擎会执行到我们所建立的这段IIFE，它会将这个匿名函数储存在全局执行上下文。

![img](https://pic3.zhimg.com/80/v2-9de7d1d4ba84a5c800421d0f677938ee_720w.jpg)

由于我们在函数的最后有加上( )，所以这段函数会立即被执行，也因此，JavaScript会为这个匿名函数建立一个新的执行上下文。

![img](https://pic2.zhimg.com/80/v2-3e5589547b326926662978deb2c4a53d_720w.jpg)

接着，它会去逐行执行我们这个函数中的代码内容，它发现到我们的代码中建立了一个变量，名称是"greeting"，因此，这个变量就被建立在函数的这个执行上下文中，而不是被建立在全局上下文中。

![img](https://pic3.zhimg.com/80/v2-cec6f2f4133e9df52b659bb20dcf53c2_720w.jpg)

因此，通过IIFE，我们可以发现，在IIFE中所建立的变量，都不会影响到全局执行上下文所建立的变量，这里再次提一下，通过IIFE，它避免了我们的变量间可能会互相干扰覆盖的情况。

## IIFE的实际应用

让我们先回到上面的代码，这时候我们在函数的外面，声明一个同样的变量名(greeting)。

```js
//全局执行上下文
var greeting = 'Hi';

//IIFE
(function(name){
  var greeting = 'Hello';
  console.log(greeting+ ' ' +name);
})("miqilin");

console.log(greeting);
```

这时候的打印出的顺序为：

![img](https://pic2.zhimg.com/80/v2-a322c4f6955077aced86a0ab1a82f609_720w.jpg)

你会发现，虽然同样都是调用greeting这个变量，但是一个是在函数执行上下文内的greeting，一个是在全局执行上下文的greeting，两者是不会互相影响的。

同样把它画成上面一样的图形，它们两个是不同的执行上下文被储存在不同的内存中，所以不会相互影响。

![img](https://pic4.zhimg.com/80/v2-9d307837e6e0257a1d0cdf2d7300eda3_720w.jpg)

如此，我们可以很直观地确定，放在IIFE里面的变量，并不会影响到其他外层的变量，也不会被外层的变量影响到。

## 如果执意要影响外层变量呢？

虽然我们使用IIFE的主要目的就是希望不同执行上下文之间的变量不要互相影响，但如果我们还是想让函数执行上下文这层的变量能够同时影响到全局执行上下文的变量时，我们可以怎么操作呢？

首先，我们得多一个参数，叫做global，在最后带入参数的地方，我们填入对象window，由于我们知道对象是引用类型的特性，因此我们可以直接针对window里面的对象去做改变，像这里，我就可以直接把global层次的对象改成hola（global.greeting = 'Hola'）：

```js
//全局执行上下文
var greeting = 'Hi';

//IIFE
(function(global, name){
  var greeting = 'Hello';
  global.greeting = 'Hola';
  console.log(greeting+ ' ' +name);
})(window, "miqilin");

console.log(greeting);
```

结果如下，原本在全局执行上下文的Hi，被变换为Hola了：

![img](https://pic1.zhimg.com/80/v2-a41538bf6ec5b26a49896d3ab8996d7c_720w.jpg)

这操作够骚吧！哈哈~

## 一道IIFE经典面试题

题目是这样的：假设想通过循环+ setTimeout来做到，在五秒钟之内，每秒钟依序通过`console.log`打印出：`0 1 2 3 4`

```js
for( var i = 0; i < 5; i++ ) {
  window.setTimeout(function() {
    console.log(i);
  }, 1000);
}
```

真的是这样吗？我们来看看执行的结果：

```text
//过了接近一秒五个五同时打出
5
5
5
5
5
```

为什么会这样呢？

我们知道， JavaScript是一个「异步」的语言，所以当我们执行这段代码时，`for`循环并不会等待`window.setTimeout`结束后才继续，而是在执行阶段就**一口气跑完**。

也就是说，当`window.setTimeout`内的回调函数执行时，拿到的`i`已经是跑完`for()`循环的`5`。

![img](https://pic3.zhimg.com/80/v2-ce4eeb80dfbc1909cc2aab594c8c7a76_720w.jpg)

那么要怎么解决这个问题呢？

我们可以把`window.setTimeout`包装成一个IIFE，这个问题就迎刃而解了：

```js
for( var i = 0; i < 5; i++ ) {

  // 为了凸显差异，我们将传入后的参数改名为 x
  // 当然由于作用域的不同，要继续在内部沿用 i 也是可以的。
  (function(x){
    window.setTimeout(function() {
      console.log(x);
    }, 1000);
  })(i);
}
```

这时候你会发现，执行的结果就会是我们预期的`0 1 2 3 4`了，但还是有一个问题：就是`0 1 2 3 4`还是在一秒钟后同时出现啊？怎么解决？

嘿嘿，相信聪明的你已经发现，由于`for`循环在一瞬间就跑完，等于那一瞬间它向`window`依序注册了五次timer，每个timer都只等待一秒钟，当然同时出现喽。

所以我们稍微修改一下：

```js
for( var i = 0; i < 5; i++ ) {

  (function(x){
    // 将原来的 1000 改成 1000 * x
    window.setTimeout(function() {
      console.log(x);
    }, 1000 * x);
  })(i);
}
```

像这样，就可以依序打印出我们想要的结果喽！

[注] ES6以后新增了`let`与`const`，且改以`{ }`作为它的块级作用域。

换句话说，将上例中的`for`改为`let`就可以做到保留`i`在执行循环当下的「值」，打出一样的效果：

```js
for( let i = 0; i < 5; i++ ) {
  window.setTimeout(function() {
    console.log(i);
  }, 1000*(i+1));
}
```

块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再那么必要了。