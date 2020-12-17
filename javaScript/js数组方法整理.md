# js数组方法整理





|    方法名     | 对应版本 |                             功能                             | 原数组是否改变 |
| :-----------: | :------: | :----------------------------------------------------------: | :------------: |
|   concat()    |   ES5-   |                合并数组，并返回合并之后的数据                |       n        |
|    join()     |   ES5-   |              使用分隔符，将数组转为字符串并返回              |       n        |
|     pop()     |   ES5-   |                删除最后一位，并返回删除的数据                |       y        |
|    shift()    |   ES5-   |                 删除第一位，并返回删除的数据                 |       y        |
|   unshift()   |   ES5-   |              在第一位新增一或多个数据，返回长度              |       y        |
|    push()     |   ES5-   |             在最后一位新增一或多个数据，返回长度             |       y        |
|   reverse()   |   ES5-   |                      反转数组，返回结果                      |       y        |
|    slice()    |   ES5-   |                  截取指定位置的数组，并返回                  |       n        |
|    sort()     |   ES5-   |                  排序（字符规则），返回结果                  |       y        |
|   splice()    |   ES5-   |             删除指定位置，并替换，返回删除的数据             |       y        |
|  toString()   |   ES5-   |                    直接转为字符串，并返回                    |       n        |
|   valueOf()   |   ES5-   |                     返回数组对象的原始值                     |       n        |
|   indexOf()   |   ES5    |                     查询并返回数据的索引                     |       n        |
| lastIndexOf() |   ES5    |                   反向查询并返回数据的索引                   |       n        |
|   forEach()   |   ES5    | 参数为回调函数，会遍历数组所有的项，回调函数接受三个参数，分别为value，index，self；forEach没有返回值 |       n        |
|     map()     |   ES5    |     同forEach，同时回调函数返回数据，组成新数组由map返回     |       n        |
|   filter()    |   ES5    | 同forEach，同时回调函数返回布尔值，为true的数据组成新数组由filter返回 |       n        |
|    every()    |   ES5    | 同forEach，同时回调函数返回布尔值，全部为true，由every返回true |       n        |
|    some()     |   ES5    | 同forEach，同时回调函数返回布尔值，只要由一个为true，由some返回true |       n        |
|   reduce()    |   ES5    | 归并，同forEach，迭代数组的所有项，并构建一个最终值，由reduce返回 |       n        |
| reduceRight() |   ES5    | 反向归并，同forEach，迭代数组的所有项，并构建一个最终值，由reduceRight返回 |       n        |

**arr.includes() 判断数中是否包含给定的值**

**arr.find(callback) 找到第一个符合条件的数组成员**

**arr.findIndex(callback) 找到第一个符合条件的数组成员的索引值**

**arr.fill(target, start, end) 使用给定的值，填充一个数组,ps:填充完后会改变原数组**

