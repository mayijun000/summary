# **interface和type有什么区别**

我们在使用时会发现大多数时候type和interface是可以换用的，那么它们具体有什么区别呢

**相同点**

- 都能声明对象
- 都能通过extends进行扩展

```js
// 通过interface声明对象结构
interface A {
  a: string;
}
// interface扩展另一个interface
interface AA extends A {
  b: number;
}
// 通过type声明对象结构
type B = {
  a: string;
};
// type扩展另一个type
type BB = B & { b: number };
```

甚至更神奇的是type和interface还能相互继承。。。

```js
type B = {
  a: string;
};
interface C extends B {
  b: number;
}
```

**不同点**

那么问题来了，type和interface的不同点在哪里呢？

- type能够声明别名而interface不行
- interface拥有声明合并的特性而type没有

先来看第一点:下面我们通过type定义了一种新的类型别名： isNumberOrBool,表示数字或者布尔值的类型

```js
type isNumberOrBool = number | boolean;
let a: isNumberOrBool = 1;
a = true;
```

再看第二点，实际上，如果我们尝试两次声明同一个名称的接口，他们不但不会冲突，反而还会合并

```js
interface Bar {
  a: string
  b: number
 }
  
 interface Bar {
  c: string
 }
  
 /*
 实际的Bar 接口为 {
  a: string
  b: number
  c: string 
 }
 */
```