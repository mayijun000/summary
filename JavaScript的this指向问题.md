# JavaScript的this指向问题

### 默认绑定

- 全局环境下，this默认绑定到window

```js
console.log(this === window); //true
```

- 函数独立调用时，this默认绑定到window

```js
function foo(){
    console.log(this === window);
}
foo();//true
```

- 被嵌套的函数独立调用时，this默认绑定到window

```javascript
var a = 0;
var obj = {
    a : 2,
    foo : function (){
        function test(){
            console.log(this);
        }
        test();
    }
}
obj.foo();
```

上面代码虽然`test()`函数被嵌套在`obj.foo()`函数中，但`test()`函数是独立调用，而不是方法调用。所以this默认绑定到window

### **立即执行函数**

实际是函数声明后立即调用执行，内部的this指向了window

```js
var a = 0;
function foo(){
    (function test(){
        console.log(this.a);
    })()
};
var obj = {
    a : 2,
    foo:foo
}
obj.foo();//0
```

等价于上例

```js
var a = 0;
var obj = {
    a : 2,
    foo : function(){
        function test(){
            console.log(this.a);
        }
        test();
    }
}
obj.foo();//0
```

### **闭包**

 类似地，`test()`函数是独立调用，而不是方法调用，所以this默认绑定到window

> 注意：函数共有4中调用方法

```js
var a = 0;
function foo() {
    function test() {
        console.log(this.a);
    }
    test();
}
var obj = {
    a: 2;
    foo: foo
}
obj.foo();//0
```

### 隐式丢失

 隐式丢失是指被隐式绑定的函数丢失绑定对象，从而默认绑定到window。**这种情况容易出错却又常见**

【**函数别名**】

```js
var a = 0;
function foo(){
    console.log(this.a);
}
var obj = {
    a: 1,
    foo:foo
}
//把obj.foo赋予别名bar，造成了隐式丢失，因为只是把foo()函数赋给了bar，而bar与obj对象则毫无关系
var bar = obj.foo;
bar();//0
```

**【内置函数】**

内置函数与上例类似，也会造成隐式丢失

```js
var a = 0;
function foo(){
    console.log(this.a);
}
var obj = {
    a : 2,
    foo:foo
}
setTimeout(obj.foo,100);//0 只是把foo函数进行赋值
```

### 严格模式

【1】严格模式下，独立调用的函数的this指向undefined

```text
function fn(){
    'use strict';
    console.log(this);//undefined
}
fn();

function fn(){
    console.log(this);//window
}
fn();
```

### 箭头函数的this指向

1、在使用=>定义函数的时候，this的指向是定义时所在的对象，而不是使用时所在的对象；
2、不能够用作构造函数，这就是说，不能够使用new命令，否则就会抛出一个错误；
3、不能够使用arguments对象；

### call & apply & bind

当函数通过Function对象的原型中继承的方法 call() 和 apply() 方法调用时， 其函数内部的this值可绑定到 call() & apply() 方法指定的第一个对象上， 如果第一个参数不是对象，JavaScript内部会尝试将其转换成对象然后指向它。

Call和apply的不同在于传参的方式，call是，多个。Apply是一个数组

通过bind方法绑定后， 函数将被永远绑定在其第一个参数对象上， 而无论其在什么情况下被调用。