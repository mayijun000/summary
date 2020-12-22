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

> 微任务和宏任务的问题应该是前端面试中比较常见的，他们都从属于异步任务，主要区别在于他们的执行顺序，Event Loop的走向和取值



![img](https://pic3.zhimg.com/80/v2-1dd1305e20e2df08e186d6c2bfc8ab3e_720w.jpg)

## 测试结果

```js
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



```text
第一轮循环：
1、打印  start 
2、打印  end    
3、nextTick放到微任务队列里nextTick1   
4、setImmediate放到宏任务队列里setImmediate1
第一轮循环打印出的是 start end
当前宏任务队列：setImmediate1
当前微任务队列：nextTick1 

第二轮循环：
1、执行所有微任务
2、打印  a
3、setImmediate放到宏任务队列里setImmediate2
4、打印  e
5、nextTick放到微任务队列里nextTick1   
6、then放到微任务队列里then1
7、setTimeout放到宏任务队列里setTimeout1
第二轮循环打印出的是 start end a e
当前宏任务队列：setImmediate1 setImmediate2 setTimeout1
当前微任务队列：nextTick1 then1

第三轮循环：
1、执行所有微任务
2、执行微任务nextTick1，打印 f
3、执行微任务then1，打印 g
4、执行所有宏任务
5、由于setTimeout高于setImmediate，所以执行setTimeout1 ，打印 h
6、执行宏任务setImmediate1 打印  b
7、nextTick放到微任务队列里nextTick1 
8、then放到微任务队列里then1
第三轮循环打印出的是 start end a e f g h b
当前宏任务队列：setImmediate2
当前微任务队列：nextTick1 then1

第四轮循环：
1、执行微任务
2、执行微任务nextTick1，打印 c
3、执行微任务then1，打印 i
4、执行宏任务setImmediate2 打印 d
第四轮循环打印出的是 start end a e f g h b c i d 
```

如果有任务就先执行微任务

通过上面步骤的讲解，看一下下面的执行顺序练习

```js
console.log('1');

setTimeout(function() {
    console.log('2');
    process.nextTick(function() {
        console.log('3');
    })
    new Promise(function(resolve) {
        console.log('4');
        resolve();
    }).then(function() {
        console.log('5')
    })
})
process.nextTick(function() {
    console.log('6');
})
new Promise(function(resolve) {
    console.log('7');
    resolve();
}).then(function() {
    console.log('8')
})

setTimeout(function() {
    console.log('9');
    process.nextTick(function() {
        console.log('10');
    })
    new Promise(function(resolve) {
        console.log('11');
        resolve();
    }).then(function() {
        console.log('12')
    })
})
```

结果是什么  

```text
最终打印顺序为：1 7 6 8 2 4 3 5 9 11 10 12
```