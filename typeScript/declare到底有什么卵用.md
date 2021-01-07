# **declare到底有什么卵用**

在开发中可能要引用其他第三方的JS库。虽然可以直接调用库的类和方法，但是却无法使用TypeScript 的类型检查等特性功能，通过引用declare声明文件，就可以借用 TypeScript 的各种特性来使用库文件了。

假如我们使用的JQuery是原生JS编写的，我们可以在TS中这样声明和使用

```js
declare var jQuery: (selector: string) => any;
jQuery('#foo');
```

当然更多时候不需要我们自己写，很多有名的JS库已经有了官方的TS声明库，可以自行搜索