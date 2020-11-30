# event loop（事件循环机制）

## JS的事件循环

1. 在执行主线程的任务时，如果有异步任务，会进入到Event Table并注册回调函数，当指定的事情完成后，会将这个回调函数放到 **callback queue** 中
2. 在主线程执行完毕之后，会去读取 **callback queue**中的回调函数，进入主线程执行
3. 不断的重复这个过程，也就是常说的Event Loop（事件循环）了



## 异步任务

异步任务又分为宏任务和微任务、他们之间的区别主要是执行顺序的不同。

##### 微任务：原生的Promise和process.nextTick

##### **process.nextTick**的执行优先级高于**Promise**的

##### 宏任务：整体代码 script和setTimeout、setImmediate

**setTimeout**的执行优先级高于 **setImmediate** 的



## 宏任务与微任务的执行过程

1、开始

2、宏任务

3、判断是否有微任务

1）没有的话执行新的宏任务

​	  2）有的话执行所有微任务

​			2-1）开始执行新的宏任务



## 测试结果

```javascript
<script>
   console.log("start");
   process.nextTick(() => {
     console.log("a");
     setImmediate(() => {
       console.log("d");
     });
     new Promise(res => res()).then(() => {
       console.log("e");
       process.nextTick(() => {
         console.log("f");
       });
       new Promise(r => {
         r()
       })
       .then(() => {
         console.log("g");
       });
       setTimeout(() => {
         console.log("h");
       });
     });
   });
   
   setImmediate(() => {
     console.log("b");
     process.nextTick(() => {
       console.log("c");
     });
     new Promise(res => res()).then(() => {
       console.log("i");
     });
   });
   console.log("end");
</script>
```

#### 输出的结果为： `start end a e g f h b d c i`



