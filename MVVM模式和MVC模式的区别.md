# MVVM模式和MVC模式的区别

## MVC模式

1、代码分成三层

- Model： 数据层。
- Controller： 控制层
- View： 视图层（一般指页面中的dom展示）

### MVC的优缺点

优点：

> 1、把业务逻辑全部分离到Controller中，模块化程度高。当业务逻辑变更的时候，不需要变更View和Model，只需要Controller换成另外一个Controller就行了（Swappable Controller）。
> 2、观察者模式可以做到多视图同时更新。

缺点：

> 1、Controller测试困难。因为视图同步操作是由View自己执行，而View只能在有UI的环境下运行。在没有UI环境下对Controller进行单元测试的时候，Controller业务逻辑的正确性是无法验证的：Controller更新Model的时候，无法对View的更新操作进行断言。
> 2、View无法组件化。View是强依赖特定的Model的，如果需要把这个View抽出来作为一个另外一个应用程序可复用的组件就困难了。因为不同程序的的Domain Model是不一样的

## MVVM（Model-View-ViewModel）

它是将“数据模型数据双向绑定”的思想作为核心，因此在View和Model之间没有联系，通过ViewModel进行交互，而且Model和ViewModel之间的交互是双向的，因此视图的数据的变化会同时修改数据源，而数据源数据的变化也会立即反应到View上。

### MVVM的优缺点

优点：

> 1、提高可维护性。解决了MVP大量的手动View和Model同步的问题，提供双向绑定机制。提高了代码的可维护性。
> 2、简化测试。因为同步逻辑是交由Binder做的，View跟着Model同时变更，所以只需要保证Model的正确性，View就正确。大大减少了对View同步更新的测试。

缺点：

> 1、过于简单的图形界面不适用，或说牛刀杀鸡。
> 2、对于大型的图形应用程序，视图状态较多，ViewModel的构建和维护的成本都会比较高。
> 3、数据绑定的声明是指令式地写在View的模版当中的，这些内容是没办法去打断点debug的。