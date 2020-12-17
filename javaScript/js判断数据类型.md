# js判断数据类型

Typeof判断基本类型和function类型

instanceof 只能用来判断两个对象是否属于实例关系， 而不能判断一个对象实例具体属于哪种类型。原理：var L = A.__proto__;var R = B.prototype;判断A的__proto__ 是否指向B的prototype

判断数据类型最好用这个方法Object.prototype.toString.call