# JS函数柯里化

把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

好处：参数复用、延迟执行 bind方法的底层实现

```js
function sub_curry(fn) {
  var args = [].slice.call(arguments, 1);
  return function() {
    return fn.apply(this, args.concat([].slice.call(arguments)));
  };
}

function curry(fn, length) {

  length = length || fn.length;

  var slice = Array.prototype.slice;

  return function() {
    if (arguments.length < length) {
      var combined = [fn].concat(slice.call(arguments));
      return curry(sub_curry.apply(this, combined), length - arguments.length);
    } else {
      return fn.apply(this, arguments);
    }
  };
}
```

这是基于MVC的JavaScript Web富应用开发的`bind()`方法实现：

```js
Function.prototype.bind = function(oThis) {
  if (typeof this !== "function") {
    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
  }

  var aArgs = Array.prototype.slice.call(arguments, 1),
    fToBind = this,
    fNOP = function() {},
    fBound = function() {
      return fToBind.apply(
        this instanceof fNOP && oThis ? this : oThis || window,
        aArgs.concat(Array.prototype.slice.call(arguments))
      );
    };

  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();

  return fBound;
};
```