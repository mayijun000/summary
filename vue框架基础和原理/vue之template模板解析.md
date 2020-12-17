# vue之template模板解析



虚拟DOM构建经历 

template编译成AST语法树

再转换为render函数 

最终返回一个VNode(VNode就是Vue的虚拟DOM节点) 。

### 什么是AST

在Vue的mount过程中，template会被编译成AST语法树，AST是指抽象语法树（abstract syntax tree或者缩写为AST），或者语法树（syntax tree），是源代码的抽象语法结构的树状表现形式。

可以看出：在options中，vue默认先使用render函数，如果没有提供render函数，则会使用template模板，最后再使用el，通过解析模板编译AST，最终转化为render。