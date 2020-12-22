# vue2.0响应式原理

双向绑定得的实现主要依赖于Object.defineProperty(),通过这个函数可以监听到get,set事件



![img](https:////upload-images.jianshu.io/upload_images/18851057-8e0ecad4cbaea0c5.png?imageMogr2/auto-orient/strip|imageView2/2/w/728/format/webp)

**Observer** **监听器**：用来监听属性的变化通知订阅者，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

**Watcher** **订阅者**：收到属性的变化，然后更新视图

**Compile** **解析器**：解析指令，初始化模版，绑定订阅者

**Dep****订阅者数组**：每当vue执行双向绑定的指令，就在一个Dep中增加一个订阅者

总结vue.js 则是采用数据劫持 Object.defineProperty() 结合**发布者****-****订阅者模式**的方式