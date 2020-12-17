# **vue常用的修饰符？**

### **事件修饰符**

.prevent: 提交事件不再重载页面；

.stop: 阻止单击事件冒泡；

.self: 当事件发生在该元素本身而不是子元素的时候会触发；

.capture: 事件侦听，事件发生的时候会调用

### **按键修饰符**

为了在必要的情况下支持旧浏览器，Vue 提供了绝大多数常用的按键码的别名：

- `.enter`
- `.tab`
- `.delete` (捕获“删除”和“退格”键)
- `.esc`
- `.space`
- `.up`
- `.down`
- `.left`
- `.right`

### `.sync` 修饰符

是一个重要的语法糖，它可以快速实现组件间的通信

如果不适用 `.sync` ,就需要在 父组件中完整的写出

```js
<Child :money="total" v-on:update:money="total = $event"/>
```

如果使用语法糖

```js
<Child :money.sync="total"/>
```

### .native 修饰符

在组件上去监听事件时，我们监听的是组件的自动触发的自定义事件,想要触发原生事件加入.native 修饰符