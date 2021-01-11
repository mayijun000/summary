# **vue中使用v-for时为什么不能用index作为key？**

**key的作用：主要是为了高效的更新虚拟DOM** 。

**vue中使用v-for时用index作为key会出现以下问题：**

1. **更新DOM的时候会出现性能问题**
2. **会发生一些状态bug**

**举个栗子：**

```html
<template>
	<div v-for="(item, index) in list" :key="index" >{{item.name}}</div>
</template>
const list = [
    {
        id: 1,
        name: "Person1"
    },
    {
        id: 2,
        name: "Person2"
    },
    {
        id: 3,
        name: "Person3"
    },
    {
        id:4,
        name:"Person4"
    }
];
```

此时，删除 “Person4” 是正常的，但是如果我删除 “Person2” 就会出现问题。

**删除前**

| key  | id   | index | name    |
| ---- | ---- | ----- | ------- |
| 0    | 1    | 0     | Person1 |
| 1    | 2    | 1     | Person2 |
| 2    | 3    | 2     | Person3 |
| 3    | 4    | 3     | Person4 |

**删除后**

| key  | id   | index | name    |
| ---- | ---- | ----- | ------- |
| 0    | 1    | 0     | Person1 |
| 1    | 3    | 1     | Person3 |
| 2    | 4    | 2     | Person4 |

这个时候，除了 Person1 之外，剩下的 Person3、Person4，因为被发现与相应 `key` 的绑定关系有变化，所以被重新渲染，这会影响性能。
如果此时 `list` 的 `item` 是 select 的选项，其中 Person3 是选中的，这个时候 Person2 被删除了，用 index 作为 key 就会变成是 Person4 选中的了，这就产生了bug。

如果使用唯一id作为key，删除 Person2 后，剩下的元素因为与 `key` 的关系没有发生变化，都不会被重新渲染，从而达到提升性能的目的。此时，`list` 的 `item` 作为 select 的选项，也不会出现上面所描述的bug。