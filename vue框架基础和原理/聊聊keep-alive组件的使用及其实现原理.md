# 聊聊keep-alive组件的使用及其实现原理

## **keep-alive**



keep-alive是Vue.js的一个内置组件。它能够将不活动的组件实例保存在内存中，而不是直接将其销毁，它是一个抽象组件，不会被渲染到真实DOM中，也不会出现在父组件链中。

它提供了include与exclude两个属性，允许组件有条件地进行缓存。

**用法**

```html
<keep-alive>
    <component></component>
</keep-alive>
```

这里的component组件会被缓存起来。

**生命钩子**

keep-alive提供了两个生命钩子，分别是activated与deactivated。

因为keep-alive会将组件保存在内存中，并不会销毁以及重新创建，所以不会重新调用组件的created等方法，需要用activated与deactivated这两个生命钩子来得知当前组件是否处于活动状态。