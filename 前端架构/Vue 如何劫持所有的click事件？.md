# Vue 如何劫持所有的click事件？

vue.mixin实现了个插件，下面只说如何劫持所有click的实现逻辑：

```js
Vue.mixin({
  mounted:function(){
  this.$nextTick(()=>{
       delegateBehavior(this);
       },0)
  }
});
```

mixin会对所有的component有效，在每个渲染完成后我们把当前实例的context传进我们要进行捕获click的函数中。

```js
delegateBehavior(context: any) {
	//在conetxt的$el上做_uid的赋值。
	if (context.$el) {
		context.$el.setAttribute('vueautoreport-uid', context._uid);
	}
    //在root上做标记，不以次数订，可能页面存在多个vue实例.
    if (context.$root.$el && !context.$root.$el._isBindDelegate) {
    	eventTypes.forEach((eventType) => {
            //root组件绑定捕获事件，处理冒泡阻止的情况
            context.$root.$el.addEventListener(eventType, (e: Event) => {
                this.captureEvent(e, this.captureContexts, eventType);
            }, true);
    	})
    	context.$root.$el._isBindDelegate = true;
     }
}
```

首先我把每个component上挂了一个uid的attribute，为了方便我在网页中看到组件结构

然后我们知道每个vue实例的$root代表他的根节点，我们判断一下$root上的$el是否有我们之前绑定过事件的flag，就是isBindDelegate属性，因为这个delegateBehavior是要在每个组件的context上都执行一遍的。

eventTypes目前就只有click一个item，以后可能我们还会捕获其他事件，先做成数组了。

然后我们给$el绑定对应的捕获事件，注意addEventListener的第三个参数我们要设置为true，使用捕获，而不是冒泡captureEvent函数的第二个参数是我记录的所有contexts，这个数组是在vue.mixin的mounted的时候存的。

```js
captureEvent(e: (Event | IntersectionObserverEntry), contexts: Array<any>, eventType: String, ext?: anyExt) {
	let els = contexts.map((context: any) => context.$el);
    let currentEl = e.target as Node;
    while (currentEl) {
        let index = els.indexOf(currentEl);
        if (index > -1) {
            this.emit('logreport', e, contexts, index, eventType, ext);
            break;
        }
        currentEl = currentEl.parentNode;
    }
}
```

之所以用捕获而不是冒泡来进行click劫持，主要是为了避免.stop这种情况无法感知，我们知道vue中的stop或者我们日常开发都是使用冒泡来进行事件代理，大家可以去了解下事件捕获的机制，他是在冒泡之前触发的，所以不会受到影响很适合做这种统计需求。

然后我们看下具体的逻辑，首先我们拿到所有contexts的$el，通过target的node节点和vue的contexts里的$el进行比较，因为contexts的$el都是component的根节点，不一定会匹配到target，所以要从target一直往上找到他所属的component，目的是为了找到这target属于哪个context，主要是拿到那个index。

然后我们把index和contexts还有对应的一些其他东东传给logreport，在logreport广播中进行log的拼装即可。

```js
this.on('logreport', (e: Event, contexts: Array<any>, index: number, eventType: string, ext: anyExt) => {
	let node = this.getVnodeTarget(e.target as Element, contexts[index]._vnode);
    let log = this.behaviorLogInfo({
        target: e.target,
        node,
        context: contexts[index],
        eventType,
        ext
    });
    this.logreport(log);
})
```

通过target，target所属的context的_vnode，我们可以找到这个target的Vnode，方便从这个Vnode上找到vue给他设置的属性，比如node.data.attrs等。

拼装log的方法比较复杂，因为里面还有不少其他逻辑，比如曝光，组件调用栈关系等操作，就不贴了。拦截click的方法基本就是这样实现的。

好处就是可以不受事件冒泡被阻止的影响，除了拿到target的el，我们还能拿到对应的vnode，以便获取更多埋点信息。