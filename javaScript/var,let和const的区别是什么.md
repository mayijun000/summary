# var,let和const的区别是什么

1.var声明的变量会挂载在window上，而let和const声明的变量不会

2.var声明变量存在变量提升，let和const不存在变量提升

3.let和const声明形成块作用域

4.同一作用域下let和const不能声明同名变量，而var可以

5.const一旦声明必须赋值,不能使用null占位；声明后不能再修改 ；如果声明的是复合类型数据，可以修改其属性