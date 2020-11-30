# javascript中的六种继承方式



继承的操作需要有一个父类，这里使用构造函数外加原型来创建一个：

```js
// super
function Person(name){
	this.name = name;
}
Person.prototype.job = 'frontend';
Person.prototype.sayHello = function() {
	console.log('Hello '+this.name);
}
var person = new Person('jia ming');
person.sayHello(); // Hello jia ming
```

### 原型链继承

```js
// 原型链继承
function Child() {
	this.name = 'child';
}
Child.prototype = new Person();
var child = new Child();
console.log(child.job); // frontend
// instanceof 判断元素是否在另一个元素的原型链上
// child是Person类的实例
console.log(child instanceof Person); // true
```

**关键点**：子类原型等于父类的实例`Child.prototype = new Person()`

原型链的详细讲解自己之前有一篇文章说到[深入理解原型对象和原型链](https://juejin.im/post/5acf22aef265da238c3b0f78)

**特点**：

1. 实例可继承的属性有：实例的构造函数的属性，父类构造函数的属性，父类原型上的属性。（新实例不会继承父类实例的属性）

**注意事项**：

1. 新实例无法向父类构造函数传参
2. 继承单一
3. 所有新实例都会共享父类实例的属性。（原型上的属性是共享的，一个实例修改了原型属性，另一个实例的原型属性也会被修改）

### 借用构造函数

```js
// 借用构造函继承
function Child() {
	Person.call(this, 'reng');
}
var child = new Child();
console.log(child.name); // reng
console.log(child instanceof Person); // false
child.sayHello(); // 报错，继承不了父类原型上的东西
```

**关键点**：用`call`或`apply`将父类构造函数引入子类函数（在子类函数中做了父类函数的自执行（复制））`Person.call(this, 'reng')`

针对`call, apply, bind`的使用，之前有篇文章[谈谈JavaScript中的call、apply和bind](https://juejin.im/post/5cf648c45188253a2b01ccb1)提到。

**特点**：

1. 只继承了父类构造函数的属性，没有继承父类原型的属性
2. 解决了**原型链继承**的注意事项（缺点）1，2，3
3. 可以继承多个构造函数的属性（call可以多个）
4. 在子实例中可以向父实例传参

**注意事项**：

1. 只能继承父类构造函数的属性
2. 无法实现构造函数的复用。（每次用每次都要重新调用）
3. 每个新实例都有构造函数的副本，臃肿

### 组合继承

组合继承是`原型链继承和借用构造函数继承`的组合。

```js
// 组合继承
function Child(name) {
	Person.call(this, name);
}
Child.prototype = new Person();
var child = new Child('jia');
child.sayHello(); // Hello jia
console.log(child instanceof Person); // true
```

**关键点**：结合了两种模式的优点--向父类传参（call）和复用（prototype）

**特点**：

1. 可以继承父类原型上的属性，可以传参，可复用
2. 每个新实例引入的构造函数属性是私有的

**注意事项**：

1. 调用了两次父类的构造函数（耗内存）
2. 子类的构造函数会代替原型上的那个父类构造函数（call相当于拿到了父类构造函数的副本）

### 原型式继承

```js
// 先封装一个函数容器，用来承载继承的原型和输出对象
function object(obj) {
	function F() {}
	F.prototype = obj;
	return new F();
}
var super0 = new Person();
var super1 = object(super0);
console.log(super1 instanceof Person); // true
console.log(super1.job); // frontend
```

**关键点**：用一个函数包装一个对象，然后返回这个函数的调用，这个函数就变成了可以随意增添属性的实例或对象。`Object.create()`就是这个原理。

**特点**：

1. 类似于复制一个对象，用函数来包装

**注意事项**：

1. 所有的实例都会继承原型上的属性
2. 无法实现复用。（新实例属性都是后面添加的）

**Object.create()方法规范了原型式继承。**这个方法接收两个参数，一个用作新对象原型的对象和（可选的）一个为新对象定义额外属性的对象。

```js
// 传一个参数的时候
var anotherPerson = Object.create(new Person());
console.log(anotherPerson.job); // frontend
console.log(anotherPerson instanceof Person); // true
// 传两个参数的时候
var anotherPerson = Object.create(new Person(), {
	name: {
		value: 'come on'
	}
});
anotherPerson.sayHello(); // Hello come on
```

### 寄生式继承

```js
function object(obj) {
	function F(){}
	F.prototype = obj;
	return new F();
}
var sup = new Person();
// 以上是原型式继承，给原型式继承再套个壳子传递参数
function subobject(obj) {
	var sub = object(obj);
	sub.name = 'ming';
	return sub;
}
var sup2 = subobject(sup);
// 这个函数经过声明后就成了可增添属性的对象
console.log(sup2.name); // 'ming'
console.log(sup2 instanceof Person); // true
```

**关键点**：就是给原型式继承外面套个壳子。

**特点**：

1. 没有创建自定义类型，因为只是套了个壳子，返回对象，这个函数顺理成章就成了创建的新对象。

**注意事项**：

1. 没用到原型，无法复用

### 寄生组合继承

它跟**组合继承**一样，都比较常用。

**寄生**：在函数内返回对象然后调用

**组合**：

1. 函数的原型等于另一个实例
2. 在函数中用apply或call引入另一个构造函数，可传参

```js
// 寄生
function object(obj) {
	function F(){}
	F.prototype = obj;
	return new F();
}
// object是F实例的另一种表示方法
var obj = object(Person.prototype);
// obj实例（F实例）的原型继承了父类函数的原型
// 上述更像是原型链继承，只不过只继承了原型属性

// 组合
function Sub() {
	this.age = 100;
	Person.call(this); // 这个继承了父类构造函数的属性
} // 解决了组合式两次调用构造函数属性的特点

// 重点
Sub.prototype = obj;
console.log(Sub.prototype.constructor); // Person
obj.constructor = Sub; // 一定要修复实例
console.log(Sub.prototype.constructor); // Sub
var sub1 = new Sub();
// Sub实例就继承了构造函数属性，父类实例，object的函数属性
console.log(sub1.job); // frontend
console.log(sub1 instanceof Person); // true
```

**重点**：修复了组合继承的问题

在上面的问题中，你可能发现了这么一个注释`obj.constructor = Sub; // 一定要修复实例`。为什么要修正子类的构造函数的指向呢？

因为在不修正这个指向的时候，在获取构造函数返回的时候，在调用同名属性或方法取值上可能造成混乱。比如下面：

```js
function Car() { }
Car.prototype.orderOneLikeThis = function() {  // Clone producing function
    return new this.constructor();
}
Car.prototype.advertise = function () {
    console.log("I am a generic car.");
}

function BMW() { }
BMW.prototype = Object.create(Car.prototype);
BMW.prototype.constructor = BMW;              // Resetting the constructor property
BMW.prototype.advertise = function () {
    console.log("I am BMW with lots of uber features.");
}

var x5 = new BMW();

var myNewToy = x5.orderOneLikeThis();

myNewToy.advertise(); // => "I am BMW ..." if `BMW.prototype.constructor = BMW;` is not 
                      // commented; "I am a generic car." otherwise.
```