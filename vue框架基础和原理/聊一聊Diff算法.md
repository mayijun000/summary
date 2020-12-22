# 聊一聊Diff算法

## **传统Diff算法**

> 处理方案: 循环递归每一个节点

*传统diff*

![img](https://pic1.zhimg.com/80/v2-dbd46841ee44beb0577c82f5c2e49b5c_720w.jpg)

如上所示, 左侧树a节点依次进行如下对比:

> a->e、a->d、a->b、a->c、a->a

之后左侧树其它节点b、c、d、e亦是与右侧树每个节点对比, 算法复杂度能达到O(n^2)

查找完差异后还需计算最小转换方式，这其中的原理我没仔细去看，最终达到的算法复杂度是O(n^3)

> 将两颗树中所有的节点一一对比需要O(n²)的复杂度，在对比过程中发现旧节点在新的树中未找到，那么就需要把旧节点删除，删除一棵树的一个节点(找到一个合适的节点放到被删除的位置)的时间复杂度为O(n),同理添加新节点的复杂度也是O(n),合起来diff两个树的复杂度就是O(n³)

### **Vue优化Diff**

> vue2.0加入了virtual dom，和react拥有相同的 diff 优化原则

![img](https://pic4.zhimg.com/80/v2-e6be71e8ff79fc576111b761f297bccb_720w.jpg)

差异就在于, diff的过程就是调用patch函数，就像打补丁一样修改真实dom

- patchVnode
- updateChildren

updateChildren是vue diff的核心
过程可以概括为：oldCh和newCh各有两个头尾的变量StartIdx和EndIdx，它们的2个变量相互比较，一共有4种比较方式。如果4种比较都没匹配，如果设置了key，就会用key进行比较，在比较的过程中，变量会往中间靠，一旦StartIdx>EndIdx表明oldCh和newCh至少有一个已经遍历完了，就会结束比较

![img](https://pic2.zhimg.com/80/v2-cb2617306eb25e8def4a38b807e42abd_720w.jpg)

### **Vue 2.x vs Vue 3.x**

Vue2的核心Diff算法采用了双端比较的算法，同时从新旧children的两端开始进行比较，借助key值找到可复用的节点，再进行相关操作。相比React的Diff算法，同样情况下可以减少移动节点次数，减少不必要的性能损耗，更加的优雅

Vue3.x借鉴了 ivi算法和 inferno算法。在创建VNode时就确定其类型，以及在mount/patch的过程中采用位运算来判断一个VNode的类型，在这个基础之上再配合核心的Diff算法，使得性能上较Vue2.x有了提升。