# Mobx 思想的实现原理，及与 Redux 对比

# Mobx 思想的实现原理

Mobx 最关键的函数在于 autoRun，举个例子，它可以达到这样的效果：



```text
const obj = observable({
    a: 1,
    b: 2
})

autoRun(() => {
    console.log(obj.a)
})

obj.b = 3 // 什么都没有发生
obj.a = 2 // observe 函数的回调触发了，控制台输出：2
```

我们发现这个函数非常智能，用到了什么属性，就会和这个属性挂上钩，从此一旦这个属性发生了改变，就会触发回调，通知你可以拿到新值了。没有用到的属性，无论你怎么修改，它都不会触发回调，这就是神奇的地方。

## autoRun 的用途

使用 autoRun 实现 mobx-react 非常简单，核心思想是将组件外面包上 autoRun，这样代码中用到的所有属性都会像上面 Demo 一样，与当前组件绑定，一旦任何值发生了修改，就直接 forceUpdate，而且精确命中，效率最高。

## 依赖收集

autoRun 的专业名词叫做依赖收集，也就是通过自然的使用，来收集依赖，当变量改变时，根据收集的依赖来判断是否需要更新。

## 实现步骤拆解

为了兼容，Mobx 使用了 Object.defineProperty 拦截 getter 和 setter，但是无法拦截未定义的变量，为了方便，我们使用 proxy 来讲解，而且可以监听未定义的变量哦。

### 步骤一 存储结构

众所周知，事件监听是需要预先存储的，autoRun 也一样，为了知道当变量修改后，哪些方法应该被触发，我们需要一个存储结构。

首先，我们需要存储所有的代理对象，让我们无论拿到原始对象，还是代理对象，都能快速的找出是否有对应的代理对象存在，这个功能用在判断代理是否存在，是否合法，以及同一个对象不会生成两个代理。

代码如下：



```text
const proxies = new WeakMap()

function isObservable<T extends object>(obj: T) {
    return (proxies.get(obj) === obj)
}
```

重点来了，第二个要存储的是最重要的部分，也就是所有监听！当任何对象被改变的时候，我们需要知道它每一个 key 对应着哪些监听（这些监听由 autoRun 注册），也就是，最终会存在多个对象，每个对象的每个 key 都可能与多个 autoRun 绑定，这样在更新某个 key 时，直接触发与其绑定的所有 autoRun 即可。

代码如下：



```text
const observers = new WeakMap<object, Map<PropertyKey, Set<Observer>>>()
```

第三个存储结构就是待观察队列，为了使同一个调用栈多次赋值仅执行一次 autoRun，所有待执行的都会放在这个队列中，在下一时刻统一执行队列并清空，执行的时候，当前所有 autoRun 都是在同一时刻触发的，所以让相同的 autoRun 不用触发多次即可实现性能优化。



```text
const queuedObservers = new Set()
```

代码如下：

我们还要再存储两个全局变量，分别是是否在队列执行中，以及当前执行到的 autoRun。

代码如下：



```text
let queued = false
let currentObserver: Observer = null
```

### 步骤二 将对象加工可观察

这一步讲解的是 observable 做了哪些事，首先第一件就是，如果已经存在代理对象了，就直接返回。

代码如下：



```text
function observable<T extends object>(obj: T = {} as T): T {
    return proxies.get(obj) || toObservable(obj)
}
```

我们继续看 toObservable 函数，它做的事情是，实例化代理，并拦截 get set 等方法。

我们先看拦截 get 的作用：先拿到当前要获取的值 result，如果这个值在代理中存在，优先返回代理对象，否则返回 result 本身（没有引用关系的基本类型）。

上面的逻辑只是简单返回取值，并没有注册这一步，我们在 currentObserver 存在时才会给对象当前 key注册 autoRun，并且如果结果是对象，又不存在已有的代理，就调用自身 toObservable 再递归一遍，所以返回的对象一定是代理。

registerObserver 函数的作用是将 targetObj -> key -> autoRun 这个链路关系存到 observers 对象中，当对象修改的时候，可以直接找到对应 key 的 autoRun。

那么 currentObserver 是什么时候赋值的呢？首先，并不是访问到 get 就要注册 registerObserver，必须在 autoRun 里面的才符合要求，所以执行 autoRun 的时候就会将当前回调函数赋值给 currentObserver，保证了在 autoRun 函数内部所有监听对象的 get 拦截器都能访问到 currentObserver。以此类推，其他 autoRun 函数回调函数内部变量 get 拦截器中，currentObserver 也是对应的回调函数。

代码如下：



```text
const dynamicObject = new Proxy(obj, {
    // ...
    get(target, key, receiver) {
        const result = Reflect.get(target, key, receiver)

        // 如果取的值是对象，优先取代理对象
        const resultIsObject = typeof result === 'object' && result
        const existProxy = resultIsObject && proxies.get(result)

        // 将监听添加到这个 key 上
        if (currentObserver) {
            registerObserver(target, key)
            if (resultIsObject) {
                return existProxy || toObservable(result)
            }
        }

        return existProxy || result
    }),
    // ...
})
```

setter 过程中，如果对象产生了变动，就会触发 queueObservers 函数执行回调函数，这些回调都在 getter 中定义好了，只需要把当前对象，以及修改的 key 传过去，直接触发对应对象，当前 key 所注册的 autoRun 即可。

代码如下：



```text
const dynamicObject = new Proxy(obj, {
    // ...
    set(target, key, value, receiver) {
        // 如果改动了 length 属性，或者新值与旧值不同，触发可观察队列任务
        if (key === 'length' || value !== Reflect.get(target, key, receiver)) {
            queueObservers<T>(target, key)
        }

        // 如果新值是对象，优先取原始对象
        if (typeof value === 'object' && value) {
            value = value.$raw || value
        }

        return Reflect.set(target, key, value, receiver)
    },
    // ...
})
```

没错，主要逻辑已经全部说完了，新对象之所以可以检测到，是因为 proxy 的 get 会触发，这要多谢 proxy 的强大。

可能有人问 Object.defineProperty 为什么不行，原因很简单，因为这个函数只能设置某个 key 的 gettersetter~。

symbol proxy reflect 这三剑客能做的事还有很多很多，这仅仅是实现 Object.observe 而已，还有更强大的功能可以挖掘。

mobx 的 proxy 完整实现版本参考 [https://github.com/nx-js/observer-util](https://link.zhihu.com/?target=https%3A//github.com/nx-js/observer-util) 项目。

- [symbol拓展](https://link.zhihu.com/?target=https%3A//www.keithcirkel.co.uk/metaprogramming-in-es6-symbols/)
- [reflect拓展](https://link.zhihu.com/?target=https%3A//www.keithcirkel.co.uk/metaprogramming-in-es6-part-2-reflect/)

谈谈 Redux 与 Mobx 思想的适用场景

Redux 和 Mobx 都是当下比较火热的数据流模型，一个背靠函数式，似乎成为了开源界标配，一个基于面向对象，低调的前行。

## 函数式 vs 面向对象

首先任何避开业务场景的技术选型都是耍流氓，我先耍一下流氓，首先函数式的优势，比如：

1. 无副作用，可时间回溯，适合并发。
2. 数据流变换处理很拿手，比如 rxjs。
3. 对于复杂数据逻辑、科学计算维的开发和维护效率更高。

当然，连原子都是由带正电的原子核，与带负电的电子组成的，几乎任何事务都没有绝对的好坏，面向对象也存在很多优势，比如：

1. javascript 的鸭子类型，表明它基于对象，不适合完全函数式表达。
2. 数学思维和数据处理适合用函数式，技术是为业务服务的，而业务模型适合用面向对象。
3. 业务开发和做研究不同，逻辑严谨的函数式相当完美，但别指望每个程序员都愿意消耗大量脑细胞解决日常业务问题。

## Redux vs Mobx

那么具体到这两种模型，又有一些特定的优缺点呈现出来，先谈谈 Redux 的优势：

1. 数据流流动很自然，因为任何 dispatch 都会导致广播，需要依据对象引用是否变化来控制更新粒度。
2. 如果充分利用时间回溯的特征，可以增强业务的可预测性与错误定位能力。
3. 时间回溯代价很高，因为每次都要更新引用，除非增加代码复杂度，或使用 immutable。
4. 时间回溯的另一个代价是 action 与 reducer 完全脱节，数据流过程需要自行脑补。原因是可回溯必然不能保证引用关系。
5. 引入中间件，其实主要为了解决异步带来的副作用，业务逻辑或多或少参杂着 magic。
6. 但是灵活利用中间件，可以通过约定完成许多复杂的工作。
7. 对 typescript 支持困难。

Mobx：

1. 数据流流动不自然，只有用到的数据才会引发绑定，局部精确更新，但免去了粒度控制烦恼。
2. 没有时间回溯能力，因为数据只有一份引用。
3. 自始至终一份引用，不需要 immutable，也没有复制对象的额外开销。
4. 没有这样的烦恼，数据流动由函数调用一气呵成，便于调试。
5. 业务开发不是脑力活，而是体力活，少一些 magic，多一些效率。
6. 由于没有 magic，所以没有中间件机制，没法通过 magic 加快工作效率（这里 magic 是指 action 分发到 reducer 的过程）。
7. 完美支持 typescript。

## 到底如何选择



从目前经验来看，我建议前端数据流不太复杂的情况，使用 Mobx，因为更加清晰，也便于维护；如果前端数据流极度复杂，建议谨慎使用 Redux，通过中间件减缓巨大业务复杂度，但还是要做到对开发人员尽量透明，如果可以建议使用 typescript 辅助。