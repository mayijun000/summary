# generate函数用法

### 总结一下js中异步问题的解决方案

主流的解决方法主要有以下几种：

1. 回调函数
2. 事件触发
3. 发布/订阅者模式
4. promise
5. generate



### 创建一个generate函数

```js
function* gen(){
    yield 1
    yield 2
    return 3
}
```

区别于普通函数的地方在于function后面的*号，以及函数内部的yield。
 *号是定义方式，带有 * 号表示是一个generate函数，yield是其内部独特的语法。

```js
function* gen(){
	yield 1
	yield 2
	return 3
}

  let g=gen();

  console.log(g.next())//{value:1,done:false}

  console.log(g.next())//{value:2,done:false}

  console.log(g.next())//{value:3,done:true}

  console.log(g.next())//{value:undefined,done:true}
```

调用generate函数会生成一个遍历器对象，不会立即执行，需要调用next执行，执行到带有yield的那一步，next会返回一个对象，对象中value表示yield或return后的值，done表示函数是否已经执行结束（是否已经执行到return）。之后每次执行next都会从上一个yield开始继续执行

#### 使用场景：页面抽奖，防止抽奖次数在页面被篡改