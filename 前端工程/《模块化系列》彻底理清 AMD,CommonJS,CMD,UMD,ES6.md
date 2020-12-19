# 《模块化系列》彻底理清 AMD,CommonJS,CMD,UMD,ES6

本文你将学到:

1. Rollup 是什么
2. CommonJS、AMD、CMD、UMD、ES6 分别的介绍
3. ES6 模块与 CommonJS 模块的区别
4. 模块演进的产物 —— Tree Shaking
5. Tree Shaking 应该注意什么

本文所有例子都存放于 [https://github.com/hua1995116/packaging-example](https://link.zhihu.com/?target=https%3A//github.com/hua1995116/packaging-example)

## 引言

今天在使用 rollup 打包的时候遇到了一个问题

```bash
Error: 'Map' is not exported by node_modules/immutable/dist/immutable.js
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.Immutable = factory();
```

发现 `immutable` 是以 UMD 的形式暴露。查阅资料后发现 Rollup 并不支持 CommonJS 和 AMD 的打包方式，想要成功引入 commonJS 的模块，必须要加载插件 [https://github.com/rollup/plugins/tree/master/packages/commonjs](https://link.zhihu.com/?target=https%3A//github.com/rollup/plugins/tree/master/packages/commonjs)。 当然并不是对所有的 CommonJS 都自动支持，只针对类似于静态的写法才能导出，例如针动态模块导出，以及隐式地导出将无法自动导出，这样的场景下需要手动指定导出模块。以上的例子就是一个动态的方式，只有当 `factory` 函数执行了才能知道导出的模块，需要手动指定。

```js
commonjs({
  namedExports: {
    // left-hand side can be an absolute path, a path
    // relative to the current directory, or the name
    // of a module in node_modules
    'immutable': ['Map']
  }
});
```

当然上述只是我写这篇文章的一个起因，就是因为我对这一块的迷惑，所以使得我想重新复习一下这一块知识，上面将的可能你完全听不懂我在说什么，没有关系，下面开始切入正题。

## Rollup 是什么？

因为在最一开始，是我引入了这个概念，所以由我出来填坑，当然对这个工具非常熟悉的朋友可以跳过。不熟悉的朋友你只需要知道，这个是一个打包 ES Module 的工具。

> Rollup 是一个 JavaScript 模块打包器，可以将小块代码编译成大块复杂的代码，例如 library 或应用程序。Rollup 对代码模块使用新的标准化格式，这些标准都包含在 JavaScript 的 ES6 版本中，而不是以前的特殊解决方案，如 CommonJS 和 AMD。ES6 模块可以使你自由、无缝地使用你最喜爱的 library 中那些最有用独立函数，而你的项目不必携带其他未使用的代码。ES6 模块最终还是要由浏览器原生实现，但当前 Rollup 可以使你提前体验。

## CommonJS

[CommonJS规范](https://link.zhihu.com/?target=http%3A//wiki.commonjs.org/wiki/CommonJS)

`CommonJS` 主要运行于服务器端，该规范指出，一个单独的文件就是一个模块。 Node.js为主要实践者，它有四个重要的环境变量为模块化的实现提供支持：`module`、`exports`、`require`、`global`。`require` 命令用于输入其他模块提供的功能，`module.exports`命令用于规范模块的对外接口，输出的是一个值的拷贝，输出之后就不能改变了，会缓存起来。

```js
// 模块 a.js
const name = 'qiufeng'

module.exports = {
    name,
    github: 'https://github.com/hua1995116'
}
// 模块 b.js
// 引用核心模块或者第三方包模块，不需要写完整路径
const path = require('path');
// 引用自定义模块可以省略.js
const { name, github } = require('./a');

console.log(name, github, path.basename(github));
// 输出 qiufeng https://github.com/hua1995116 hua1995116
```

代码地址: [https://github.com/hua1995116/packaging-example/tree/master/modules-introduction/CommonJS](https://link.zhihu.com/?target=https%3A//github.com/hua1995116/packaging-example/tree/master/modules-introduction/CommonJS)

`CommonJS` 采用同步加载模块，而加载的文件资源大多数在本地服务器，所以执行速度或时间没问题。但是在浏览器端，限于网络原因，更合理的方案是使用异步加载。

## AMD

[AMD规范](https://link.zhihu.com/?target=https%3A//github.com/amdjs/amdjs-api/wiki/AMD)

AMD是"Asynchronous Module Definition"的缩写，意思就是"异步模块定义"。它采用异步方式加载模块，模块的加载不影响它后面语句的运行。所有依赖这个模块的语句，都定义在一个回调函数中，等到加载完成之后，这个回调函数才会运行。其中 RequireJS 是最佳实践者。

模块功能主要的几个命令：`define`、`require`、`return`和`define.amd`。`define`是全局函数，用来定义模块,`define(id?, dependencies?, factory)`。require命令用于输入其他模块提供的功能，return命令用于规范模块的对外接口，define.amd属性是一个对象，此属性的存在来表明函数遵循AMD规范。

```js
// model1.js
define(function () {
    console.log('model1 entry');
    return {
        getHello: function () {
            return 'model1';
        }
    };
});
// model2.js
define(function () {
    console.log('model2 entry');
    return {
        getHello: function () {
            return 'model2';
        }
    };
});
// main.js
define(function (require) {
    var model1 = require('./model1');
    console.log(model1.getHello());
    var model2 = require('./model2');
    console.log(model2.getHello());
});
<script src="https://cdn.bootcss.com/require.js/2.3.6/require.min.js"></script>
<script>
    requirejs(['main']);
</script>
// 输出结果  
// model1 entry
// model2 entry
// model1
// model2
```

代码地址: [https://github.com/hua1995116/packaging-example/tree/master/modules-introduction/AMD](https://link.zhihu.com/?target=https%3A//github.com/hua1995116/packaging-example/tree/master/modules-introduction/AMD)

在这里，我们使用define来定义模块，return来输出接口， require来加载模块，这是AMD官方推荐用法。

## CMD

[CMD规范](https://link.zhihu.com/?target=https%3A//github.com/cmdjs/specification/blob/master/draft/module.md)

CMD(Common Module Definition - 通用模块定义)规范主要是Sea.js推广中形成的，一个文件就是一个模块，可以像Node.js一般书写模块代码。主要在浏览器中运行，当然也可以在Node.js中运行。

它与AMD很类似，不同点在于：AMD 推崇依赖前置、提前执行，CMD推崇依赖就近、延迟执行。

不懂 `依赖就近、延迟执行` 的可以比较下面和上面的例子。

```js
// model1.js
define(function (require, exports, module) {
    console.log('model1 entry');
    exports.getHello = function () {
        return 'model1';
    }
});
// model2.js
define(function (require, exports, module) {
    console.log('model2 entry');
    exports.getHello = function () {
        return 'model2';
    }
});
// main.js
define(function(require, exports, module) {
    var model1 = require('./model1'); //在需要时申明
    console.log(model1.getHello());
    var model2 = require('./model2'); //在需要时申明
    console.log(model2.getHello());
});
<script src="https://cdn.bootcss.com/seajs/3.0.3/sea.js"></script>
<script>
    seajs.use('./main.js')
</script>
// 输出 
// model1 entry
// model1
// model2 entry
// model2
```

[https://github.com/hua1995116/packaging-example/tree/master/modules-introduction/CMD](https://link.zhihu.com/?target=https%3A//github.com/hua1995116/packaging-example/tree/master/modules-introduction/CMD)

总结: 对比和 AMD 的写法就可以看出 AMD 和 CMD 的区别。虽然现在 CMD 已经凉了。但是 CMD 更加接近于 CommonJS 的写法，但是 AMD 更加接近于浏览器的异步的执行方式。

## UMD

[UMD文档](https://link.zhihu.com/?target=https%3A//github.com/umdjs/umd)

UMD(Universal Module Definition - 通用模块定义)模式，该模式主要用来解决CommonJS模式和AMD模式代码不能通用的问题，并同时还支持老式的全局变量规范。

示例展示

```js
// bundle.js
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.myBundle = factory());
}(this, (function () { 'use strict';

    var main = () => {
        return 'hello world';
    };

    return main;

})));
// index.html
<script src="bundle.js"></script>
<script>
  console.log(myBundle());
</script>
```

1. 判断`define为`函数，并且是否存在`define.amd`，来判断是否为AMD规范,
2. 判断`module`是否为一个对象，并且是否存在`module.exports`来判断是否为`CommonJS`规范
3. 如果以上两种都没有，设定为原始的代码规范。

代码地址：[https://github.com/hua1995116/packaging-example/tree/master/modules-introduction/UMD](https://link.zhihu.com/?target=https%3A//github.com/hua1995116/packaging-example/tree/master/modules-introduction/UMD)

## ES Modules

[ES Modules 文档](https://link.zhihu.com/?target=http%3A//es6.ruanyifeng.com/%23docs/module-loader)

ES modules（ESM）是 JavaScript 官方的标准化模块系统。

1. 它因为是标准，所以未来很多浏览器会支持，可以很方便的在浏览器中使用。(浏览器默认加载不能省略.js)
2. 它同时兼容在node环境下运行。
3. 模块的导入导出，通过`import`和`export`来确定。 可以和Commonjs模块混合使用。
4. ES modules 输出的是值的引用，输出接口动态绑定，而 CommonJS 输出的是值的拷贝
5. ES modules 模块编译时执行，而 CommonJS 模块总是在运行时加载

使用方式

```js
// index.js
import { name, github } from './demo.js';

console.log(name(), github());

document.body.innerHTML = `<h1>${name()} ${github()}</h1>`
export function name() {
    return 'qiufeng';
}

export function github() {
    return 'https://github.com/hua1995116';
}
<script src="./index.js" type="module"></script>
```

代码地址: [https://github.com/hua1995116/packaging-example/tree/master/modules-introduction/ES-Modules](https://link.zhihu.com/?target=https%3A//github.com/hua1995116/packaging-example/tree/master/modules-introduction/ES-Modules)

详细可以查看 [深入理解 ES6 模块机制](https://link.zhihu.com/?target=https%3A//juejin.im/entry/5a879e28f265da4e82635152)

### CommonJS 的值拷贝

```js
// a.js
const b = require('./b');
console.log(b.age);
setTimeout(() => {
  console.log(b.age);
  console.log(require('./b').age);
}, 100);
// b.js
let age = 1;
setTimeout(() => {
  age = 18;
}, 10);
module.exports = {
  age
}
// 执行：node a.js
// 执行结果：
// 1
// 1
// 1
```

CommonJS 主要有执行主要有以下两个特点

1. CommonJS 模块中 require 引入模块的位置不同会对输出结果产生影响，并且会生成值的拷贝
2. CommonJS 模块重复引入的模块并不会重复执行，再次获取模块只会获得之前获取到的模块的缓存

### ES modules 的值的引用

```js
// a.js
import { age } from './b.js';

console.log(age);
setTimeout(() => {
    console.log(age);
    import('./b.js').then(({ age }) => {
        console.log(age);
    })
}, 100);

// b.js
export let age = 1;

setTimeout(() => {
    age = 2;
}, 10);
// 打开 index.html
// 执行结果：
// 1
// 2
// 2
```

### 动态加载和静态编译区别？

举个例子如下:

动态加载，只有当模块运行后，才能知道导出的模块是什么。

```js
var test = 'hello'
module.exports = {
  [test + '1']: 'world'
}
```

静态编译, 在编译阶段就能知道导出什么模块。

```js
export function hello() {return 'world'}
```

关于 ES6 模块编译时执行会导致有以下两个特点：

1. import 命令会被 JavaScript 引擎静态分析，优先于模块内的其他内容执行。
2. export 命令会有变量声明提前的效果。

**import 优先执行:**

```js
// a.js
console.log('a.js')
import { age } from './b.js';

// b.js
export let age = 1;
console.log('b.js 先执行');

// 运行 index.html 执行结果:
// b.js 先执行
// a.js
```

虽然 import 顺序比较靠后，但是 由于 import 提升效果会优先执行。

**export 变量声明提升:**

```js
// a.js
import { foo } from './b.js';
console.log('a.js');
export const bar = 1;
export const bar2 = () => {
  console.log('bar2');
}
export function bar3() {
  console.log('bar3');
}

// b.js
export let foo = 1;
import * as a from './a.js';
console.log(a);

// 运行 node --experimental-modules a.js 执行结果:
// [Module] {
//  bar: <uninitialized>,
//  bar2: <uninitialized>,
//  bar3: [Function: bar3]
}
```

代码地址：[https://github.com/hua1995116/packaging-example/tree/master/modules-introduction/CommonJS-vs-ESModules](https://link.zhihu.com/?target=https%3A//github.com/hua1995116/packaging-example/tree/master/modules-introduction/CommonJS-vs-ESModules)

从上述例子中可以看出，a 模块引用了 b 模块，b 模块也引用了 a 模块，export 声明优先于其他内容。由于变量和函数的提升不一样，此处不做过多介绍。

**此处有一个小插曲**，我一开始用浏览器进行执行的结果为:

```bash
{
  bar: 1
  bar2: () => { console.log('bar2'); }
  bar3: ƒ bar3()
}
a.js
```

让我一度觉得是不是 export 有什么特殊的声明提升？因为我发现`深入理解 ES6 模块机制`一文中是使用的 `babel-node`, 是否是因为环境不一样导致的。因此我使用了 node `v12.16.0`,进行测试 `node --experimental-modules a.js`, 发现结果与 `深入理解 ES6 模块机制` 中结果一致，后来想到 `console.log` 的显示问题，`console.log` 常常会有一些异步的显示。后来我经过测试发现确实是 `console.log` 搞的鬼

```
console.log(a);` -> `console.log(JSON.stringify(a))
```

会出现一个 `Uncaught ReferenceError: bar is not defined` 的错误，是因为 `bar` 未初始化导致。后续也会将这个 `console` 的表现形式报告给 `chromium`。

## Tree shaking

介绍完了，各个模块的标准后，为什么又将这个 Tree shaking 呢？因为模块化的一次又一次地变更，让我们的模块系统变得越来越好，而 Tree shaking 就是得益 ES modules 的发展的产物。

这个概念是Rollup提出来的。Rollup推荐使用ES2015 Modules来编写模块代码，这样就可以使用Tree-shaking来对代码做静态分析消除无用的代码，可以查看Rollup网站上的REPL示例，代码打包前后之前的差异，就会清晰的明白Tree-shaking的作用。

1. 没有使用额外的模块系统，直接定位import来替换export的模块
2. 去掉了未被使用的代码

tree shaking 的实际例子

```js
// main.js
import * as utils from './utils';

const array = [1,2,3,1,2,3]

console.log(utils.arrayUnique(array));
```

代码地址：[https://github.com/hua1995116/packaging-example/tree/master/modules-introduction/Tree-Shaking](https://link.zhihu.com/?target=https%3A//github.com/hua1995116/packaging-example/tree/master/modules-introduction/Tree-Shaking)

`Tree shaking` 和 没有`Tree shaking` 打包对比。



![img](https://pic1.zhimg.com/80/v2-0ed4097bd945b6a20e1ad1fdf7cffa0c_720w.jpg)



没有 Tree-shaking 的情况下，会将 utils 中的所有文件都进行打包，使得体积暴增。

ES Modules 之所以能 Tree-shaking 主要为以下四个原因（摘自尤雨溪在知乎的回答）:

1. `import` 只能作为模块顶层的语句出现，不能出现在 function 里面或是 if 里面。
2. `import` 的模块名只能是字符串常量。
3. 不管 `import` 的语句出现的位置在哪里，在模块初始化的时候所有的 `import` 都必须已经导入完成。
4. `import binding` 是 `immutable` 的，类似 const。比如说你不能 import { a } from ‘./a’ 然后给 a 赋值个其他什么东西。

## tree shaking 应该注意什么

### 副作用

没错，就是副作用，那么什么是副作用呢，请看下面的例子。

```js
// effect.js
console.log(unused());
export function unused() {
    console.log(1);
}
// index.js
import {unused} from './effect';
console.log(42);
```

此例子中 `console.log(unused());` 就是副作用。在 `index.js` 中并不需要这一句 `console.log`。而 `rollup` 并不知道这个全局的函数去除是否安全。因此在打包地时候你可以显示地指定`treeshake.moduleSideEffects` 为 false，可以显示地告诉 `rollup` 外部依赖项没有其他副作用。

不指定的情况下的打包输出。 `npx rollup index.js --file bundle.js`

```js
console.log(unused());

function unused() {
    console.log(1);
}

console.log(42);
```

指定没有副作用下的打包输出。`npx rollup index.js --file bundle-no-effect.js --no-treeshake.moduleSideEffects`

```js
console.log(42);
```

代码地址： [https://github.com/hua1995116/packaging-example/tree/master/modules-introduction/Tree-Shaking-Effect](https://link.zhihu.com/?target=https%3A//github.com/hua1995116/packaging-example/tree/master/modules-introduction/Tree-Shaking-Effect)

当然以上只是副作用的一种，详情其他几种看查看 [https://rollupjs.org/guide/en/](https://link.zhihu.com/?target=https%3A//rollupjs.org/guide/en/)

## 结语

CommonJS 同步加载， AMD 异步加载， UMD = CommonJS + AMD , ES Module 是标准规范, 取代 UMD，是大势所趋。 Tree-shaking 牢记副作用。