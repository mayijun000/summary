# js浅拷贝与深拷贝的区别和实现方式

##### 如何区分深拷贝与浅拷贝，简单点来说，就是假设B复制了A，当修改A时，看B是否会发生变化，如果B也跟着变了，说明这是浅拷贝，拿人手短，如果B没变，那就是深拷贝，自食其力。

### 1. 如果是基本数据类型，名字和值都会储存在栈内存中

```html
var a = 1;
b = a; // 栈内存会开辟一个新的内存空间，此时b和a都是相互独立的
b = 2;
console.log(a); // 1
```

当然，这也算不上深拷贝，因为深拷贝本身只针对较为复杂的object类型数据。

### 2. 如果是引用数据类型，名字存在栈内存中，值存在堆内存中，但是栈内存会提供一个引用的地址指向堆内存中的值

##### 比如浅拷贝：

![img](https:////upload-images.jianshu.io/upload_images/15037426-33f5ceb9d7cb0a6e.png?imageMogr2/auto-orient/strip|imageView2/2/w/500/format/webp)

当b=a进行拷贝时，其实复制的是a的引用地址，而并非堆里面的值。



![img](https:////upload-images.jianshu.io/upload_images/15037426-7bf9efc3a6e90bea.png?imageMogr2/auto-orient/strip|imageView2/2/w/500/format/webp)

而当我们a[0]=1时进行数组修改时，由于a与b指向的是同一个地址，所以自然b也受了影响，这就是所谓的浅拷贝了。

![img](https:////upload-images.jianshu.io/upload_images/15037426-aba3349a798ab52b.png?imageMogr2/auto-orient/strip|imageView2/2/w/500/format/webp)


 那，要是在堆内存中也开辟一个新的内存专门为b存放值，就像基本类型那样，岂不就达到深拷贝的效果了

![img](https:////upload-images.jianshu.io/upload_images/15037426-3cc2e0e955d177e3.png?imageMogr2/auto-orient/strip|imageView2/2/w/500/format/webp)

### 3. 实现浅拷贝的方法

（1）for···in只循环第一层

```html
// 只复制第一层的浅拷贝
function simpleCopy(obj1) {
   var obj2 = Array.isArray(obj1) ? [] : {};
   for (let i in obj1) {
   obj2[i] = obj1[i];
  }
   return obj2;
}
var obj1 = {
   a: 1,
   b: 2,
   c: {
         d: 3
      }
}
var obj2 = simpleCopy(obj1);
obj2.a = 3;
obj2.c.d = 4;
alert(obj1.a); // 1
alert(obj2.a); // 3
alert(obj1.c.d); // 4
alert(obj2.c.d); // 4
```

（2）Object.assign方法

```html
var obj = {
    a: 1,
    b: 2
}
var obj1 = Object.assign(obj);
obj1.a = 3;
console.log(obj.a) // 3
```

（3）直接用=赋值

```html
let a=[0,1,2,3,4],
    b=a;
console.log(a===b);
a[0]=1;
console.log(a,b);
```

![img](https:////upload-images.jianshu.io/upload_images/15037426-6a06b6f2ee711a5f.png?imageMogr2/auto-orient/strip|imageView2/2/w/248/format/webp)

### 4. 实现深拷贝的方法

（1）采用递归去拷贝所有层级属性

```html
function deepClone(obj){
    let objClone = Array.isArray(obj)?[]:{};
    if(obj && typeof obj==="object"){
        for(key in obj){
            if(obj.hasOwnProperty(key)){
                //判断ojb子元素是否为对象，如果是，递归复制
                if(obj[key]&&typeof obj[key] ==="object"){
                    objClone[key] = deepClone(obj[key]);
                }else{
                    //如果不是，简单复制
                    objClone[key] = obj[key];
                }
            }
        }
    }
    return objClone;
}    
let a=[1,2,3,4],
    b=deepClone(a);
a[0]=2;
console.log(a,b);
```

结果：

![img](https:////upload-images.jianshu.io/upload_images/15037426-66f503dd14d2bd0f.png?imageMogr2/auto-orient/strip|imageView2/2/w/407/format/webp)

（2） 通过JSON对象来实现深拷贝

```html
function deepClone2(obj) {
  var _obj = JSON.stringify(obj),
    objClone = JSON.parse(_obj);
  return objClone;
}
```

缺点： 无法实现对对象中方法的深拷贝，会显示为undefined
 （3）通过jQuery的extend方法实现深拷贝

```html
var array = [1,2,3,4];
var newArray = $.extend(true,[],array); // true为深拷贝，false为浅拷贝
```

（4）lodash函数库实现深拷贝

```html
let result = _.cloneDeep(test)
```

（5）Reflect法

```html
// 代理法
function deepClone(obj) {
    if (!isObject(obj)) {
        throw new Error('obj 不是一个对象！')
    }

    let isArray = Array.isArray(obj)
    let cloneObj = isArray ? [...obj] : { ...obj }
    Reflect.ownKeys(cloneObj).forEach(key => {
        cloneObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
    })

    return cloneObj
}
```

（6）手动实现深拷贝

```html
let obj1 = {
   a: 1,
   b: 2
}
let obj2 = {
   a: obj1.a,
   b: obj1.b
}
obj2.a = 3;
alert(obj1.a); // 1
alert(obj2.a); // 3
```

（7）如果对象的value是基本类型的话，也可以用Object.assign来实现深拷贝，但是要把它赋值给一个空对象

```html
var obj = {
    a: 1,
    b: 2
}
var obj1 = Object.assign({}, obj); // obj赋值给一个空{}
obj1.a = 3;
console.log(obj.a)；// 1
```

![img](https:////upload-images.jianshu.io/upload_images/15037426-1c7b29547b2a8794.png?imageMogr2/auto-orient/strip|imageView2/2/w/332/format/webp)

（8）用slice实现对数组的深拷贝

```html
// 当数组里面的值是基本数据类型，比如String，Number，Boolean时，属于深拷贝
// 当数组里面的值是引用数据类型，比如Object，Array时，属于浅拷贝
var arr1 = ["1","2","3"]; 
var arr2 = arr1.slice(0);
arr2[1] = "9";
console.log("数组的原始值：" + arr1 );
console.log("数组的新值：" + arr2 );
```

![img](https:////upload-images.jianshu.io/upload_images/15037426-a412661f28396034.png?imageMogr2/auto-orient/strip|imageView2/2/w/341/format/webp)

（9）用concat实现对数组的深拷贝

```html
// 当数组里面的值是基本数据类型，比如String，Number，Boolean时，属于深拷贝
var arr1 = ["1","2","3"];
var arr2 = arr1.concat();
arr2[1] = "9";
console.log("数组的原始值：" + arr1 );
console.log("数组的新值：" + arr2 );
// 当数组里面的值是引用数据类型，比如Object，Array时，属于浅拷贝
var arr1 = [{a:1},{b:2},{c:3}];
var arr2 = arr1.concat();
arr2[0].a = "9";
console.log("数组的原始值：" + arr1[0].a ); // 数组的原始值：9
console.log("数组的新值：" + arr2[0].a ); // 数组的新值：9
```

![img](https:////upload-images.jianshu.io/upload_images/15037426-5f64889271b63ce7.png?imageMogr2/auto-orient/strip|imageView2/2/w/326/format/webp)

（10）直接使用var newObj = Object.create(oldObj)，可以达到深拷贝的效果。

```html
function deepClone(initalObj, finalObj) {    
  var obj = finalObj || {};    
  for (var i in initalObj) {        
    var prop = initalObj[i];        // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
    if(prop === obj) {            
      continue;
    }        
    if (typeof prop === 'object') {
      obj[i] = (prop.constructor === Array) ? [] : Object.create(prop);
    } else {
      obj[i] = prop;
    }
  }    
  return obj;
}
```

（11）使用扩展运算符实现深拷贝

```html
// 当value是基本数据类型，比如String，Number，Boolean时，是可以使用拓展运算符进行深拷贝的
// 当value是引用类型的值，比如Object，Array，引用类型进行深拷贝也只是拷贝了引用地址，所以属于浅拷贝
var car = {brand: "BMW", price: "380000", length: "5米"}
var car1 = { ...car, price: "500000" }
console.log(car1); // { brand: "BMW", price: "500000", length: "5米" }
console.log(car); // { brand: "BMW", price: "380000", length: "5米" }
```