# Vue3.0 VS Vue2.x 有哪些不同

## Vue3.0 新功能

- **[Composition API](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/composition-api-introduction.html)**----组合式 API，包括`setup()`等
- **[Reactivity API](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/reactivity.html%23what-is-reactivity)**----响应式系统 API，包括`ref()`等
- **[Teleport](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/teleport.html)**---内置了传送组件
- **[Fragments](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/migration/fragments.html)**---`template`里可以存在多个根DOM（或组件），Vue2.x 的时候只能存在1个
- **[Emits](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/component-custom-events.html)** 组件中添加了自定义事件参数
- `v-model` 的修改，可以传入参数，因此可以使用多个`v-model`，还可以自定义修饰符，移除了`.sync`修饰符。
- **`createRenderer` API from `@vue/runtime-core` to create custom renderers**

## 被移除的内容

- 移除了`keyCode`修饰符，可以用`kebab-case`名来代替（比如`.delete/.enter`)
- 移除了实例上的`$on`, `$off` 和 `$once`[方法](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/migration/keycode-modifiers.html)
- 移除了[过滤器](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/migration/filters.html)`Filters`，Vue3.0 建议使用 `computed` 来实现
- 移除了[Inline templates attributes](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/migration/inline-template-attribute.html)
- 移除了`.sync`修饰符

## API 参考/新增以及被废弃的 API

---【*加粗斜体代表新增，删除线*~~*代表移除（知乎不支持删除线，允悲），斜体代表有改动*】---

## 实例 API（从全局 API 拆分出来 的）

在 Vue 3 中，会全局改变 Vue 行为的 API 移到了实例（通过 `createApp` 创建）的 API 中。它们只会影响该实例。 如下：`**mount**`、`**provide**`、`**unmount**`、`*directive*`（自定义指令的生命周期钩子更名了）、`component`、`config`、`mixin`、`use`

## 全局 API

**`createApp`**、**`h`**（`render()`的别名）、**`defineComponent`**、**`defineAsyncComponent`**、**`resolveComponent`**（只能在渲染函数里使用）、**`resolveDirective`**（只能在渲染函数里使用）、**`withDirectives`**（只能在渲染函数里使用）、**`createRenderer`**（只能在渲染函数里使用）、`nextTick`、~~`extend`~~、~~`filter`~~、~~`compile`~~、~~`observable`~~（被`reactive`替代）、~~`version`~~、~~`set`~~

## 选项

### Data

**`emits`**、`data`、`props`、`computed`、`methods`、`watch`、~~`propsData`~~

### DOM

`template`、`render`、~~`el`~~、~~`renderError`~~

### 生命周期钩子

```js
beforeCreate`、`created`、`beforeMount`、`mounted`、`beforeUpdate`、`updated`、`activated`、`deactivated`、`beforeUnmount`（~~`beforeDestroy`~~）、`unmounted`（~~`destroyed`~~）、`errorCaptured`、`**renderTracked**`、`**renderTriggered**
```

### 资源

`directives`、`components`、~~`filters`~~

### 组合

`mixins`、`extends`、`provide / inject`、`**setup**`、~~`parent`~~

### 其他

`name`、`inheritAttrs`、~~`delimiters`~~、~~`functional`~~、~~`model`~~、~~`comments`~~

## 实例属性

`$data`、`$props`、`$el`、`$options`、`$parent`、`$root`、`$slots`、`$refs`、`$attrs`、~~`$children`~~、~~`$scopedSlots`~~、~~`$isServer`~~、~~`$listeners`~~

## 实例方法（生命周期也被合并到这里了）

`$watch`、`$emit`、`$forceUpdate`、`$nextTick`、~~`$set`~~（文档里没有找到移除 `set` 的描述，用 `$forceUpdate`吧）、~~`$delete`~~、~~`$mount`~~、~~`destroy`~~

## 指令

`v-text`、`v-html`、`v-show`、`v-if`、`v-else`、`v-else-if`、`v-for`、`v-on`、`v-bind`、`*v-model*`、`v-slot`、`v-pre`、`v-cloak`、`v-once`、`**v-is**`（本来是通过`is`实现）

## 特殊属性

`key`、`ref`、`is`、~~`slot`~~、~~`slot-scope`~~、~~`scope`~~（这3个在 Vue 2.6 以上就被废弃了）

## 内置的组件

```
component`、`transition`、`transition-group`、`keep-alive`、`slot`、`**teleport**
```

## 【新增】响应式系统 API（Reactivity API ）

### 基本响应式 APIs

**`reactive`**、**`readonly`**、**`isProxy`**、**`isReactive`**、**`isReadonly`**、**`toRaw`**、**`markRaw`**、**`shallowReactive`**、**`shallowReadonly`**

### refs

**`ref`**、**`unref`**、**`toRef`**、**`toRefs`**、**`isRef`**、**`customRef`**、**`shallowRef`**

### Computed and watch

**`computed`**、**`watchEffect`**、**`watch`**

## 【新增】组合式 API（Composition API ）

**`setup`**、**`onBeforeMount`**、**`onMounted`**、**`onBeforeUpdate`**、**`onUpdated`**、**`onBeforeUnmount`**、**`onUnmounted`**、**`onErrorCaptured`**、**`onRenderTracked`**、**`onRenderTriggered`**、**`provide`**、**`inject`**

以下是我对比 [Vue2.x](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2) 版本文档的教程部分得出的一部分差异，欢迎补充或者提供修改建议（因为暂时还没找到中文版，所以只是自己的理解，已经在知识点上插入了文档的该部分链接，可以直接查看原文）。

## 基础用法

## 创建 Vue实例 的方法：

在 **Vue2.x** 中，通过 **[new Vue](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/instance.html)** 创建 Vue 的实例，并且通过传入 **el参数** 进行挂载 DOM

```js
<!-- Vue2.x 创建实例 -->
var vm = new Vue({
  // 选项
})

<!-- Vue2.x 挂载DOM -->
var vm = new Vue({
  el: '#app',
  data: {a:1}
})
```

在 **Vue3.0** 中，通过 **[createApp](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/instance.html%23instance-lifecycle-hooks)** 方法创建 Vue 的实例，创建实例后可以把这个容器传给 **mount** 方法来挂载

```js
<!-- Vue3.0 创建实例 -->
Vue.createApp(/* options */)

<!-- Vue3.0 挂载DOM -->
Vue.createApp(/* options */).mount('#app')
```

## 生命周期

生命周期没有太大的改变，由于创建实例的方法改变了，因此有一些细微的差别。

值得注意的是：在 **[Vue2.x](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/instance.html)** 中，销毁实例的两个钩子是 **beforeDestory** 以及 **destoryed**，而在 **[Vue3.0](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/instance.html%23instance-lifecycle-hooks)** 中这两个钩子的名字变更为 **beforeUnmount** 和 **unmounted**。

Vue2.x 生命周期

![img](https://pic4.zhimg.com/80/v2-2a7828efd6ca107aaaed51eca052c7eb_720w.jpg)



Vue3.0 生命周期



![img](https://pic3.zhimg.com/80/v2-3c713f00d5e436559b9a426b8a65e2b6_720w.jpg)



## Provide / inject

Vue3.0 在教程中添加了对`Provide / inject`的[描述](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/component-provide-inject.html)

![img](https://pic3.zhimg.com/80/v2-eacc7535decbb5695865c4b6883390fa_720w.jpg)



## 动态组件

Vue2.x 和 Vue3.0 都仍是采用通过给 Vue 的 元素加一个特殊的 [is](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/components.html) 属性来实现

```js
<!-- 组件会在 `currentTabComponent` 改变时改变 -->
<component v-bind:is="currentTabComponent"></component>
```

但是对于解析 DOM 模板，诸如`<ul>`、`<table>`等限制内部元素的特殊情况，相比 **Vue2.x** 中是通过绑定 **is** 属性， **Vue3.0** 提供的是 **[v-is](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/component-basics.html%23listening-to-child-components-events)** 指令

```js
<!-- Vue2.x 使用 is 属性 -->
<table>
  <tr is="blog-post-row"></tr>
</table>
<!-- Vue3.0 使用 v-is 指令 -->
<table>
  <tr v-is="'blog-post-row'"></tr>
</table>
```

## 自定义事件

Vue2.x 和 Vue3.0 都仍是通过`$emit('myEvent')`[触发事件](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/components-custom-events.html)，通过`v-on:myEvent`来监听事件，不同的是，Vue3.0 在组件中提供了 **[emits](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/component-custom-events.html%23event-names)** 属性来定义事件

```js
<!-- Vue3.0 自定义事件 -->
app.component('custom-form', {
  emits: ['in-focus', 'submit']
})
```

甚至你可以在自定义事件中添加校验，这时需要把 `emits` 设置为对象，并且为事件名分配一个函数，该函数接收传递给 `$emit` 调用的参数，并返回一个布尔值以指示事件是否有效

```js
<!-- Vue3.0 为自定义事件添加校验 -->
app.component('custom-form', {
  emits: {
    // No validation
    click: null,

    // Validate submit event
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm() {
      this.$emit('submit', { email, password })
    }
  }
})
```

## 自定义组件的 `v-model`

在 [Vue2.x](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/components-custom-events.html%23%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model) 中， `v-model` 默认会利用 `value` 作为 prop 名以及 `input` 作为触发的 event 名。对于特殊的场景，也可以通过 `model` 选项来指定 prop 名和 event 名（注意这时仍需在 props 里声明这个 prop）

```js
<!-- Vue2.0 自定义 v-model -->
Vue.component('base-checkbox', {
  model: {
    prop: 'checked',
    event: 'change'
  },
  props: {
    checked: Boolean
  },
  template: `
    <input
      type="checkbox"
      v-bind:checked="checked"
      v-on:change="$emit('change', $event.target.checked)"
    >
  `
})
```

**请注意**，在 [Vue3.0](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/component-custom-events.html%23validate-emitted-events) 中， `v-model` 默认会利用 `modelValue` 作为 prop 名以及 `update:modelValue` 作为触发的 event 名。

支持给每个 `v-model` 传入一个**参数**，这样就可以在一个组件上同时使用多个 v-model

```js
<!-- Vue3.0 自定义 v-model 并且传入参数 -->
<my-component v-model:foo="bar" v-model:name="userName"></my-component>
```

甚至还可以为 v-model 设置**自定义修饰符**，默认是通过在props中定义 `modelModifiers` 对象来接受修饰符，因此你可以通过修饰符来设置你想要的不同的事件触发机制

```js
<!-- Vue3.0 自定义修饰符默认接收方式 -->
<div id="app">
  <my-component v-model.capitalize="myText"></my-component>
  {{ myText }}
</div>

const app = Vue.createApp({
  data() {
    return {
      myText: ''
    }
  }
})

app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  },
  template: `<input
    type="text"
    v-bind:value="modelValue"
    v-on:input="emitValue">`
})

app.mount('#app')
```

当然，对于传入了参数的 `v-model` ，则需要在props里面配置`arg + "Modifiers"`来接收这个带参数的 `v-model` 的修饰符

```js
<!-- Vue3.0 自定义参数的自定义修饰符 -->
<my-component v-model:foo.capitalize="bar"></my-component>

app.component('my-component', {
  props: ['foo', 'fooModifiers'],
  template: `
    <input type="text" 
      v-bind:value="foo"
      v-on:input="$emit('update:foo', $event.target.value)">
  `,
  created() {
    console.log(this.fooModifiers) // { capitalize: true }
  }
})
```

## 混入 (mixin)

Vue2.x [混入](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/mixins.html)的方式 通过 `Vue.extend({mixins: [myMixin]})` 定义一个使用混入对象的组件

```js
// 定义一个混入对象
var myMixin = {
  created: function () {
    this.hello()
  },
  methods: {
    hello: function () {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
var Component = Vue.extend({
  mixins: [myMixin]
})

var component = new Component() // => "hello from mixin!"
```

而 [Vue3.0](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/mixins.html%23basics) 则和创建一个实例相似，通过 `Vue.createApp({mixins: [myMixin]})` 定义一个使用混入对象的组件

```js
// 定义一个混入对象
const myMixin = {
  created() {
    this.hello()
  },
  methods: {
    hello() {
      console.log('hello from mixin!')
    }
  }
}

// 定义一个使用混入对象的组件
const app = Vue.createApp({
  mixins: [myMixin]
})

app.mount('#mixins-basic') // => "hello from mixin!"
```

## 自定义指令

**Vue2.x** 的指令定义对象包含 **[5](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/custom-directive.html)** 个钩子：

- `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
- `update`：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新。
- `componentUpdated`：指令所在组件的 VNode **及其子 VNode** 全部更新后调用。
- `unbind`：只调用一次，指令与元素解绑时调用。

**Vue3.0** 的指令对象包含 **[6](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/custom-directive.html%23intro)** 个钩子：

- `beforeMount`：指令第一次绑定到元素时调用。在这里可以进行**一次性**的初始化设置。
- `mounted`：当被绑定元素插入父节点时调用。
- `beforeUpdate`：在更新所在组件的VNode**之前**调用。
- `updated`：指令所在组件的 VNode **及其子 VNode** 全部更新后调用。
- `beforeUnmount`：在绑定元素的父组件卸载之前调用。（对比 Vue2.x **新增**）
- `unmounted`：只调用一次，指令与元素解绑且父组件已卸载时调用。

在 Vue3.0 中，由于对片段的支持，组件可能会存在多个根节点，这时使用自定义指令可能会产生问题。自定义指令对象包含的钩子会被包装并作为 Vnode 生命周期钩子注入到 Vnode 的数据中。

```js
<!-- Vue3.0 自定义指令对象包含的钩子包装后 -->
{
  onVnodeMounted(vnode) {
    // call vDemo.mounted(...)
  }
}
```

当在组件中使用自定义指令时，这些`onVnodeXXX`钩子将作为无关属性直接传递给组件，可以像这样在模板中直接挂接到元素的生命周期中`（这里不太明白，之后试验过再来更新）`

```js
<div @vnodeMounted="myHook" />
```

当子组件在内部元素上使用 `v-bind="$attrs"` 时，它也将应用它上面的任何自定义指令。

## 内置的传送组件 [Teleport](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/teleport.html)

Vue3.0 内置`<teleport>`的组件可以传送一段模板到其他位置，

```js
<!-- Vue3.0 <teleport>传送组件 -->
<body>
  <div id="app" class="demo">
    <h3>Move the #content with the portal component</h3>
    <div>
      <teleport to="#endofbody">
        <p id="content">
          This should be moved to #endofbody.
        </p>
      </teleport>
      <span>This content should be nested</span>
    </div>
  </div>
  <div id="endofbody"></div>
</body>
```

如果`<teleport>`包含Vue组件，它将仍然是`<teleport>`父组件的逻辑子组件，也就是说，即使在不同的地方呈现子组件，它仍将是父组件的子组件，并将从父组件接收 `prop`。

**使用多个传送组件** 会采用累加的逻辑，像这样

```js
<teleport to="#modals">
  <div>A</div>
</teleport>
<teleport to="#modals">
  <div>B</div>
</teleport>

<!-- 结果 B 渲染在 A 后面 -->
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## 渲染函数

Vue2.x 的[渲染函数](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/render-function.html)的参数是`createElement`

Vue3.0 的[渲染函数](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/render-function.html)的参数`createVNode`（这个名字更接近它实际的意义，返回虚拟 DOM）

同样将`h`作为别名，在 Vue3.0 中可以直接通过 `Vue.h` 获取

```js
const app = Vue.createApp({})

app.component('anchored-heading', {
  render() {
    const { h } = Vue

    return h(
      'h' + this.level, // tag name
      {}, // props/attributes
      this.$slots.default() // array of children
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

**事件 & 按键修饰符** Vue2.x 对于 .passive、.capture 和 .once 这些事件修饰符，提供了相应的前缀可以用于 on：、 | 修饰符 | 前缀 |------|------------ | `.passive` | &
| `.capture` | !
| `.once` | ~ | `.capture.once`或 `.once.capture` | ~!

```js
<!-- Vue2.x 对修饰符使用前缀 -->
on: {
  '!click': this.doThisInCapturingMode,
  '~keyup': this.doThisOnce,
  '~!mouseover': this.doThisOnceInCapturingMode
}
```

而 Vue3.0 则是使用对象语法

```js
<!-- Vue3.0 对修饰符使用对象语法 -->
render() {
  return Vue.h('input', {
    onClick: {
      handler: this.doThisInCapturingMode,
      capture: true
    },
    onKeyUp: {
      handler: this.doThisOnce,
      once: true
    },
    onMouseOver: {
      handler: this.doThisOnceInCapturingMode,
      once: true,
      capture: true
    },
  })
}
```

## 插件

**[开发插件](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/plugins.html)** Vue3.0 仍需要暴露一个 `install`方法，传入两个参数，第一个参数是通过`Vue.createApp`构造的对象，第二个可选参数是用户传入的`options`

```js
// plugins/i18n.js
export default {
  install: (app, options) => {
  // Plugin code goes here
  }
}
```

插件中通过暴露出的`app.config.globalProperties`属性注册全局方法

```js
// plugins/i18n.js
<!-- 通过 app.config.globalProperties 全局注入 translate 方法 -->
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split('.')
        .reduce((o, i) => { if (o) return o[i] }, i18n)
    }
  }
}
```

还可以通过`inject`来为用户提供方法或属性

```js
// plugins/i18n.js
<!-- 这样组件里就可以通过 inject 访问 i18n 和 options -->
export default {
  install: (app, options) => {
    app.config.globalProperties.$translate = (key) => {
      return key.split('.')
        .reduce((o, i) => { if (o) return o[i] }, i18n)
    }

    app.provide('i18n')
  }
}

<!-- 然后就可以通过 inject['i18n'] 把 i18n 注入组件并访问 -->
```

**使用插件** 仍然是通过 `use()` 方法，可以接受两个参数，第一个参数是要使用的插件，第二个参数可选，会传入到插件中去。

```js
import { createApp } from 'vue'
import App from './App.vue'
import i18nPlugin from './plugins/i18n'

const app = createApp(App)
const i18nStrings = {
  greetings: {
    hi: 'Hallo!'
  }
}

app.use(i18nPlugin, i18nStrings)
app.mount('#app')
```

## 响应式原理

## 响应式系统

众所周知，[Vue2.x](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/reactivity.html) 是通过 `Object.defineProperty`结合订阅/发布模式实现的。

给 Vue 实例传入 `data` 时，Vue 将遍历`data` 对象所有的 `property`，并使用 `Object.defineProperty` 把这些属性全部转为 `getter`/`setter`，在属性被访问和修改时追踪到依赖。每个组件实例都对应一个 `watcher` 实例，它会在组件渲染的过程中把“接触”过的数据属性记录为依赖。当依赖项的 `setter` 触发时，会通知 `watcher`，从而使它关联的组件重新渲染。



![img](https://pic3.zhimg.com/80/v2-28ace4b7d5f847bbfef5ea50e027f7f2_720w.jpg)

、 而 [Vue3.0](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/reactivity.html%23what-is-reactivity) 则是采用 ES6 的 `Proxy` 代理来拦截对目标对象的访问。 给 Vue 实例传入 `data` 时，Vue 会将其转换为`Proxy`。它能使 Vue 在访问或修改属性时执行**依赖追踪**以及**更改通知**。每个属性都被视为一个依赖项。 在初次渲染后，组件将追踪依赖（也就是它在渲染时访问过的属性）。换句话说，组件成为这些属性的**订阅者**。当代理拦截到 `set` 操作时，该属性将通知其订阅者重新渲染。

```js
const dinner = {
  meal: 'tacos'
}

const handler = {
  get(target, prop, receiver) {
    track(target, prop) // Track the function that changes it 依赖项跟踪
    return Reflect.get(...arguments)
  },
  set(target, key, value, receiver) {
    trigger(target, key) // Trigger the function so it can update the final value 更改通知
    return Reflect.set(...arguments)
  }
}

const proxy = new Proxy(dinner, handler)
console.log(proxy.meal)

// intercepted!
// tacos
```

值得注意的是，原始对象与代理对象是**不相等**的

```js
const obj = {}
const wrapped = new Proxy(obj, handlers)
console.log(obj === wrapped) // false
```

## 响应式基础原理 Reactivity Fundamentals

### 声明响应式状态`reactive`

`reactive`方法接收一个普通对象作为参数，然后返回该普通对象的响应式代理（等同于 Vue2.x 中的 `Vue.observable()` ）以创建一个响应式属性。响应式转换是“深层的”，返回的代理对象不等于原始对象。模板编译的过程中 `render` 方法用的就是这些响应式属性。

```js
import { reactive } from 'vue'

// reactive state
const state = reactive({
  count: 0
})
```

还可以创建只读的响应式属性，也是深层的，对象内部任何嵌套的属性也都是只读的。

```js
const original = reactive({ count: 0 })

const copy = readonly(original)

// mutating original will trigger watchers relying on the copy
original.count++

// mutating the copy will fail and result in a warning
copy.count++ // warning: "Set operation on key 'count' failed: target is readonly."
```

### 创建独立的响应式属性`refs`

`ref`方法接受一个原始值参数，同样也会返回一个响应式的可变 ref 对象。如果是原始类型的值，由于原始类型的值是按值传递而不是按引用传递，会像是把原始类型的值包装成了一个对象一样以保证响应式，但这个对象只包含唯一的属性`value`。而对于引用类型，则会调用 `reactive` 方法进行深层响应转换。

```js
import { ref } from 'vue'

const count = ref(0)
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

当一个`ref`作为在渲染上下文中返回的属性且在模板中被访问时，会自动解套内部的`value`，因此无需再使用`xx.value`的方式来访问，这样就像访问一个普通属性一样。要`注意`，自动解套 `value` 只发生在当嵌套响应式的**对象**中时，从数组或`Map`等原生集合类中访问时不会自动解套，仍需要`.value`。

```js
<template>
  <div>
    <span>{{ count }}</span>
    <button @click="count ++">Increment count</button>
  </div>
</template>

<script>
  import { ref } from 'vue'
  export default {
    setup() {
      const count = ref(0)
      return {
        count
      }
    }
  }
</script>
```

另外如果将一个新的`ref`赋值给现有的属性，那将替换掉旧的`ref`

```js
const otherCount = ref(2)

state.count = otherCount
console.log(state.count) // 2
console.log(count.value) // 1
```

## 计算

### `computed`方法

通过`computed`方法可以直接[创建一个计算值](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/reactivity-computed-watchers.html%23computed-values)，接收一个`getter`函数作为参数并且返回一个不可手动修改的响应式对象。

```js
const count = ref(1)
const plusOne = computed(() => count.value++)

console.log(plusOne.value) // 2

plusOne.value++ // error
```

或者可以传入一个带有`getter`和`setter`方法的对象来创建一个可以手动修改的响应式对象

```js
const count = ref(1)
const plusOne = computed({
  get: () => count.value + 1,
  set: val => {
    count.value = val - 1
  }
})

plusOne.value = 1
console.log(count.value) // 0
```

## 监听

### `watchEffect`方法

`watchEffect`[方法](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/reactivity-computed-watchers.html%23watcheffect)它可以侦听依赖，它会立即运行传入的函数，并且跟踪这个函数的依赖项，当依赖项更新时，立即再次执行这个函数。

```js
const count = ref(0)

watchEffect(() => console.log(count.value))
// -> logs 0

setTimeout(() => {
  count.value++
  // -> logs 1
}, 100)
```

当`watchEffect`在组件的`setup()`或生命周期钩子中被调用时，侦听器会自动链接到该组件的生命周期，并且在组件卸载时自动停止。或者可以通过显式调用`watchEffect`的返回值以停止侦听。

```js
const stop = watchEffect(() => {
  /* ... */
})
Vue3
// 之后
stop()
```

### Side Effect Invalidation 清除副作用

有时`watchEffect`中执行的方法可能是异步的，`watchEffect`传入的函数可以接收一个`onInvalidate`函数作为参数来注册清理失效时的回调，它将会在`watchEffect`重新执行时或者`watchEffect`被终止（如果在`setup()`或`生命周期钩子`中使用了`watchEffect`，则在组件卸载时）时执行。

```js
watchEffect(onInvalidate => {
  const token = performAsyncOperation(id.value)
  onInvalidate(() => {
    // id 改变时 或 停止侦听时
    // 取消之前的异步操作
    token.cancel()
  })
})
```

注意`setup()`将在组件挂载前调用，因此如果想要在`watchEffect`中使用 `DOM` （或者组件），请在挂载的钩子中声明`watchEffect`

```js
onMounted(() => {
  watchEffect(() => {
    // access the DOM or template refs
  })
})
```

还可以为`watchEffect`传入额外的对象作为参数。 比如通过设置`flush`来设置`watchEffect`是异步执行还是在组件更新前执行

```textjs
// 同步运行
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'sync'
  }
)

// 组件更新前执行
watchEffect(
  () => {
    /* ... */
  },
  {
    flush: 'pre'
  }
)
```

`onTrack`（追踪依赖时调用）和`onTrigger`（依赖改变触发了`watchEffect`的方法时触发）参数可以用来调试`watchEffect`的行为

```js
watchEffect(
  () => {
    /* side effect */
  },
  {
    onTrigger(e) {
      debugger
    }
  }
)
```

`watch`相比`watchEffect`,`watch`是惰性的，更明确哪些状态的改变会触发侦听器重新运行，并且可以访问被侦听属性的变化前后的值。

```js
// 侦听一个 getter
const state = reactive({ count: 0 })
watch(
  () => state.count,
  (count, prevCount) => {
    /* ... */
  }
)

// 直接侦听一个 ref
const count = ref(0)
watch(count, (count, prevCount) => {
  /* ... */
})
// 侦听多个数据源
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
  /* ... */
})
```

## 组合式 API（Composition API）

在正常的业务中我们常常会抽离可复用的组件，比如过滤功能、搜索功能、业务列表等等。但是当某个组件组合得很庞大时，需要关注的逻辑列表（引入的组件）也会相应的增加，这可能导致难以阅读和理解，尤其对于那些最初没有编写它们的人。因此我们想要组合起与逻辑有关系的代码，这也时`Composition API` 的[用途](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/composition-api-introduction.html%23why-composition-api)。

```js
<!-- 没有 Composition API 时我们通常这样做 -->
<!-- 将逻辑关系标记为相同的数字 -->

// src/components/UserRepositories.vue

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { type: String }
  },
  data () {
    return {
      repositories: [], // 1
      filters: { ... }, // 3
      searchQuery: '' // 2
    }
  },
  computed: {
    filteredRepositories () { ... }, // 3
    repositoriesMatchingSearchQuery () { ... }, // 2
  },
  watch: {
    user: 'getUserRepositories' // 1
  },
  methods: {
    getUserRepositories () {
      // using `this.user` to fetch user repositories
    }, // 2
    updateFilters () { ... }, // 3
  },
  mounted () {
    this.getUserRepositories() // 1
  }
}
```

## [setup 组件参数](https://link.zhihu.com/?target=https%3A//v3.vuejs.org/guide/composition-api-introduction.html%23setup-component-option)

`setup` 是一个新的组件参数，在组件内使用并且作为 `Composition API` 的入口点。

`setup`方法接受2个参数。 第一个参数是 `props` ，它在 `setup` 内部也是响应式的（注意不要对 `props` 直接使用解构赋值，这样会破坏响应式，但是可以使用 `toRefs`来实现安全的解构）。

```js
// MyBook.vue

import { toRefs } from 'vue'

setup(props) {
    const { title } = toRefs(props)

    console.log(title.value)
}
```

第二个参数是 `context` ，它是一个普通的对象（不是响应式的）并且暴露出3个组件属性。

```js
// MyBook.vue

export default {
  setup(props, context) {
    // Attributes (Reactive Property)
    console.log(context.attrs)

    // Slots (Reactive Property)
    console.log(context.slots)

    // Emit Events (Method)
    console.log(context.emit)
  }
}
```

`setup`会在组件实例创建前，props初始化后被执行，因此只能访问 `props` 、`attrs` 、`slots` 、`emit`，而无权访问组件内部的 `data`、`computed`、 `methods`。注意`setup()`内部的`this`不会是Vue的实例的引用。

`setup`可以返回一个对象，它的所有属性都将暴露给其他的组件选项（ `computed` 的属性、 `methods` 、生命周期钩子等）以及组件模板。也可以返回一个渲染函数，该函数可以直接使用在同一作用域中声明的响应式状态：

`Composition API` 也包含了类似组件参数的生命周期钩子函数，但会以前缀为 `onXXX` 这样的名字，像是 `mounted` 对应的是 `onMounted`，接受一个回调，这个回调会在组件的钩子被调用时执行。 | Options API | `setup` 里的钩子 | | ----------------- | ------------------------ | | `beforeCreate` | 不需要 | | `created` | 不需要 | | `beforeMount` | `onBeforeMountonMounted` | | `mounted` | `onMounted` | | `beforeUpdate` | `onBeforeUpdate` | | `updated` | `onUpdated` | | `beforeUnmount` | `onBeforeUnmount` | | `unmounted` | `onUnmounted` | | `errorCaptured` | `onErrorCaptured` | | `renderTracked` | `onRenderTracked` | | `renderTriggered` | `onRenderTriggered` | 由于 `setup` 是围绕 `beforeCreate` 和 `created` 生命周期钩子运行的，也就是说将在这两个钩子中编写的任何代码都应该直接在 `setup` 中编写。

`Composition API` 还包含 `watch` 方法，接受3个参数，第一个参数是一个我们要真侦听的响应式对象或者包含`getter`的函数，第二个参数是一个回调，第三个参数是可选的配置选项。

还有前文提到的 `Composition API` 的 `computed` 方法可以在组件外部创建一个计算属性

因此我们可以把上面的栗子重写成这样，无论何时我们调用 `getUserRepositories` 方法，`repositories` 都会响应式地进行改变，视图也将更新。

```js
// src/composables/useUserRepositories.js

import { fetchUserRepositories } from '@/api/repositories'
import { ref, onMounted, watch, toRefs } from 'vue'

export default function useUserRepositories(user) {
  // 数据列表（创建一个响应式对象）
  const repositories = ref([])

  // 更新数据列表的方法
  const getUserRepositories = async () => {
    repositories.value = await fetchUserRepositories(user.value)
  }

  onMounted(getUserRepositories)

  // 在 user 上设置一个侦听器
  watch(user, getUserRepositories)

  // 返回列表和方法，以在其他组件选项中访问它们
  return {
    repositories,
    getUserRepositories
  }
}


// src/components/UserRepositories.vue
// 在组件中引入 useUserRepositorie）， useRepositoryNameSearch和 useRepositoryFilters
import { toRefs } from 'vue'
import useUserRepositories from '@/composables/useUserRepositories'
import useRepositoryNameSearch from '@/composables/useRepositoryNameSearch'
import useRepositoryFilters from '@/composables/useRepositoryFilters'

export default {
  components: { RepositoriesFilters, RepositoriesSortBy, RepositoriesList },
  props: {
    user: { type: String }
  },
  setup(props) {
    const { user } = toRefs(props)

    const { repositories, getUserRepositories } = useUserRepositories(user)

    const {
      searchQuery,
      repositoriesMatchingSearchQuery
    } = useRepositoryNameSearch(repositories)

    const {
      filters,
      updateFilters,
      filteredRepositories
    } = useRepositoryFilters(repositoriesMatchingSearchQuery)

    return {
      // 只关心过滤后的结果，因此可以以 repositories 这样的名称暴露出去
      repositories: filteredRepositories,
      getUserRepositories,
      searchQuery,
      filters,
      updateFilters
    }
  }
}
```

在`setup`中还可以使用 `provide` / `inject` ，甚至可以 `provide` 一个响应式状态，注意因为单向数据流，所以不要在 `inject` 时注入为响应式状态，而是在`provide`时就提供为响应式状态。

```js
import { ref, reactive } from 'vue'

// in provider
setup() {
  const book = reactive({
    title: 'Vue 3 Guide',
    author: 'Vue Team'
  })
  const year = ref('2020') // 也可以提供一个响应式状态，尽量在provide时注入为响应式状态

  provide('book', book)
  provide('year', year) // 如果要提供多个值，可以之后再次调用 provide
}

// in consumer
setup() {
  const book = inject('book', 'Eloquent Javasctipt') /* 可选的参数默认值 */
  const year = inject('year') 

  return { book, year }
}
```

在 `setup` 中， 响应式 `refs` 和模板的 `refs` 是统一的，为了获得对模板内元素或组件实例的引用，可以在 `setup` 声明一个 ref 并返回它。像这样我们将 `root` 暴露在渲染上下文中并通过 `ref="root"` 将绑定到 `div` 作为其 `ref` 。在虚拟 DOM 算法中如果虚拟节点的 ref 对应上了渲染上下文的 ref，那么就会把虚拟节点对应的元素或者组件实例分配给这个 ref，这是在虚拟 DOM 挂载或修改时执行的，因此模板 ref 仅在渲染初始化后才能访问。

```js
<template>
  <div ref="root">This is a root element</div>
  <div v-for="(item, i) in list" :ref="el => { divs[i] = el }">
    {{ item }}
  </div>
</template>

<script>
  import { ref, onMounted } from 'vue'

  export default {
    setup() {
      const root = ref(null)
      const divs = ref([])

      onMounted(() => {
        // 在初始化后 DOM 元素将会被分配给 ref
        console.log(root.value) // <div>This is a root element</div>
      })
      // 在每次更新前重置引用
      onBeforeUpdate(() => {
        divs.value = []
      })

      return {
        root,
        divs
      }
    }
  }
</script>
```

## 响应式系统工具集

### `unref`

如果参数是一个 `ref` 则返回它的 `value`，否则返回参数本身。它是 `val = isRef(val) ? val.value : val` 的语法糖。

```text
function useFoo(x: number | Ref<number>) {
  const unwrapped = unref(x) // unwrapped 一定是 number 类型
}
```

### `toRef`

`toRef` 可以用来为一个 reactive 对象的属性创建一个 ref。这个 ref 可以被传递并且能够保持响应性。当您要将一个 prop 中的属性作为 ref 传给组合逻辑函数时，toRef 就派上了用场。

```js
const state = reactive({
  foo: 1,
  bar: 2,
})

const fooRef = toRef(state, 'foo')

fooRef.value++
console.log(state.foo) // 2

state.foo++
console.log(fooRef.value) // 3
```

### `toRefs`

把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref ，和响应式对象 property 一一对应。当想要从一个组合逻辑函数中返回响应式对象时，用 toRefs 是很有效的，该 API 让消费组件可以 解构 / 扩展（使用 ... 操作符）返回的对象，并不会丢失响应性。

### `isRef`

检查一个值是否为一个 ref 对象。

### `isProxy`

检查一个对象是否是由 `reactive` 或者 `readonly` 方法创建的代理。

### `isReactive`

检查一个对象是否是由 `reactive` 创建的响应式代理。如果这个代理是由 `readonly` 创建的，但是又被 `reactive` 创建的另一个代理包裹了一层，那么同样也会返回 `true`。

### `isReadonly`

检查一个对象是否是由 `readonly` 创建的只读代理。

```js
const state = reactive({
  foo: 1,
  bar: 2,
})

const stateAsRefs = toRefs(state)
/*
stateAsRefs 的类型如下:

{
  foo: Ref<number>,
  bar: Ref<number>
}
*/

// ref 对象 与 原属性的引用是 "链接" 上的
state.foo++
console.log(stateAsRefs.foo) // 2

stateAsRefs.foo.value++
console.log(state.foo) // 3
```

## 高级响应式系统 API

### `customRef`

`customRef` 用于自定义一个 `ref`，可以显式地控制依赖追踪和触发响应，接受一个工厂函数，两个参数分别是用于追踪的 `track` 与用于触发响应的 `trigger`，并返回一个一个带有 `get` 和 `set` 属性的对象 这是一个使用自定义 ref 实现带防抖功能的 v-model的栗子

```js
<input v-model="text" />

function useDebouncedRef(value, delay = 200) {
  let timeout
  return customRef((track, trigger) => {
    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          value = newValue
          trigger()
        }, delay)
      },
    }
  })
}

export default {
  setup() {
    return {
      text: useDebouncedRef('hello'),
    }
  },
}
```

### `markRaw`

显式标记一个对象为“永远不会转为响应式代理”，函数返回这个对象本身。

### `shallowReactive`

只为某个对象的私有（第一层）属性创建浅层的响应式代理，不会对“属性的属性”做深层次、递归地响应式代理，而只是保留原样。

### `shallowReadonly`

只为某个对象的自有（第一层）属性创建浅层的只读响应式代理，同样也不会做深层次、递归地代理，深层次的属性并不是只读的。

### `shallowRef`

创建一个 `ref` ，将会追踪它的 `.value` 更改操作，但是并不会对变更后的 `.value` 做响应式代理转换（即变更不会调用 `reactive`）

### `toRaw`

返回由 `reactive` 或 `readonly` 方法转换成响应式代理的普通对象。这是一个还原方法，可用于临时读取，访问不会被代理/跟踪，写入时也不会触发更改。不建议一直持有原始对象的引用。请谨慎使用。

------

以上是对比教程上的内容找出的差异，最重要的就是 `Composition API` 和 `Reactivity` 也是我觉得最难的部分。另外 Vue3.0 的文档仍处于开发中，后续可能还会有一些改动，请以文档为准，还没有直接上手进行开发，因此没有提出太多个人见解，仅作为与 Vue2.x 的对比。