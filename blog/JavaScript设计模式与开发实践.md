# 基础知识
## 面向对象的 JavaScript
> JavaScript 没有提供传统的面向对象的类式继承和对抽象类、接口的支持，而是通过原型委托的方式实现对象间的继承。

编程语言分静态语言、动态语言:

静态语言优点是在编译时就能发现类型不匹配的错误和明确数据类型，提高编译速度。缺点是迫使程序员依照强契约来编写程序。

动态语言优点是编写代码量少，看起来简洁，程序员可以把精力更多地放在业务逻辑上面。缺点是无法保证变量类型，运行期间可能发生类型错误。

JavaScript 是动态语言，无需进行类型检测，可以调用对象的任意方法。这一切都建立在**鸭子类型**上，即：如果它走起路来像鸭子，叫起来像鸭子，那它就是鸭子。

鸭子模型指导我们关注对象的行为，而不是对象本身，也就是关注 Has-A，而不是 Is-A。利用鸭子模式就可以实现动态类型语言一个原则"面向接口编程而不是面向实现编程"

### 多态 polymorphism
> 同一操作作用于不同对象上面，就可以产生不同的解释和不同执行结果。

背后思想是将"做什么"和"谁去做、怎么做"分离开来，即将"不变的事物"与"可能改变的事物"分离开来。把不变的隔离开来，把可变部分封装，也符合开放-封闭原则。

```javascript
var makeSound = function( animal ) {
    animal.sound();
}
// 调用,传入不同对象
makeSound(new Duck());
makeSound(new Chicken());
```
使用继承得到多态效果，是让对象表现出多态性最常用手段。继承包括实现继承和接口继承。JavaScript 变量类型在运行期是可变的，所以 JavaScript 对象多态性是与生俱来的。

### 封装
> 封装的目的是将信息隐藏。封装包括封装数据、封装实现、封装类型、封装变化。

从设计模式层面，封装在最重要的层面是封装变化。设计模式可划分为
- 创建型模式: 创建一个对象，是一种抽象行为，目的是封装对象的行为变化
- 结构型模式: 封装结构之间的组合关系
- 行为型模式: 封装对象的行为变化

### 原型模式
JavaScript 是基于原型继承的。原型模式不单是一种设计模式，还是一种编程泛型。

如果使用原型模式，只需要调用负责克隆方法，便能完成相同功能。原型模式实现关键，是语言本身是否提供了 clone 方法。 ECMAScript5 提供了 `Object.create` 方法。

在不支持 `Object.create` 方法浏览器写法:
```javascript
Object.create = Object.create || function(obj) {
    var F = function() {};
    F.prototype = obj;
    return new F();
}
```

通过原型模式克隆出一模一样对象，原型模式提供一种便捷方式去创建某个类的对象，克隆只是创建对象的手段。

原型继承本质: 基于原型链的委托机制。

**原型变成泛型至少包括以下规则**:
- 所有数据都是对象
- 要得到一个对象，不是通过实例化类，而是找到一个对象作为原型并克隆它
- 对象会记住它的原型
- 如果对象无法响应某个请求，它会把这个请求委托给它自己的原型

JavaScript 中根对象是 `Object.prototype` 对象. `Object.prototype` 是一个空的对象。 JavaScript 的每个对象，都是从 `Object.prototype` 克隆而来。

ECMAScript5 提供 `Object.getPrototypeOf` 查看对象原型
```javascript
var obj = new Object();
console.log(Object.getPrototypeOf(obj) === Object.prototype); // true
```

JavaScript 函数既可以作为普通函数被调用，也可以作为构造器被调用。通过 `new` 运算符来创建对象，实际操作是先克隆 `Object.prototype` 对象，再进行一些其他额外的操作过程。

`new` 运算过程:
```javascript
var objectFactory = function() {
    var obj = new Object(); // 克隆一个空对象
    Constructor = [].shift.call(arguments); // 取得外部传入构造器
    obj.__proto__ = Constructor.prototype; // 指向正确的类型
    var ret = Constructor.apply(obj, arguments); //借用外部传入构造器给 obj 设置属性
    return typeof ret === 'object' ? ret : obj; // 确保构造器总会返回一个对象。
}
// 使用函数
function A(name) {this.name = name;}
var a = objectFactory(A, 'tom');
```
JavaScript 给对象提供了一个名为 `__proto__` 的隐藏属性,某个对象的 `__proto__` 属性默认会指向它的构造器的原型对象，即`{Constructor}.prototype`。 Chrome 和 Firefox 等向外暴露了对象的`__proto__`属性。
```javascript
var a = new Object();
console.log(a.__proto__ === Object.prototype); // true
```
> 当前 JavaScript 引擎下，通过 `Object.create` 来创建对象效率不高，通常比构造函数创建对象慢。

## this、call 和 apply
JavaScript的 this 总是指向一个对象，而具体指向哪个对象实在运行时基于函数的执行环境动态绑定的，而非函数被声明时的环境。

除去不常用的 with 和 eval 情况，具体到实际应用中， this 的指向大致情况分四种:
1. 作为对象的方法调用:当函数作为对象方法调用时， this 指向该对象
```javascript
var obj = {
    a: 1,
    getA: function() {
        alert(this === obj); // true
        alert(this.a); // 输出: 1
    }
}
obj.getA();
```
2. 作为普通函数调用:当函数不作为对象被调用时，this 总指向全局对象。这个全局对象是 window 对象.
```javascript
window.name = 'globalName';
var getName = function() {
    return this.name;
}
console.log(getName()); // globalName
```
ECMAScript5 严格模式下，this 指向 undefined

3. 构造器调用: 当 new 运算符调用函数时，该函数总会返回一个对象， this 指向这个对象
```javascript
var MyClass = function() {
    this.name = 'sven';
}
var obj = new MyClass();
alert(obj.name); // sven;
```
> 需要注意的是，如果构造器显式返回一个object类型的对象，那么此次运算结果最终会返回这个对象，而不是 this:
```javascript
var MyClass = function() {
    this.name = 'sven';
    return { // 显式返回一个对象
        name: 'name'
    }
}
var obj = new MyClass();
alert(obj.name); // name;
```
4. `Function.prototype.call` 或 `Function.prototype.apply` 调用: 可以动态改变传入的 this， 函数式编程的常用函数
```javascript
var obj1 = {
    name: 'sven',
    getName: function() {
        return this.name;
    }
};
var obj2 = {
    name: 'name'
};
console.log(obj1.getName()); // sven
console.log(obj1.getName.call(obj2)); // name
```
   
### 丢失的 this
替代函数 `document.getElementById` 这个过长的函数,使用:
```javaScript
var getId = function(id) {
    return document.getElementById(id);
}
getId('div1');
```
执行时，会抛出异常，因为许多引擎的 `document.getElementById` 方法的内部实现中需要用到 this。 当用 `getId` 引用的时候， this 指向的是 window，而不是原来的 document，可以利用 apply 来修正
```javascript
document.getElementById = (function(func) {
    return function() {
        return func.apply(document, arguments);
    }
})(document.getElementById);
var getId = document.getElementById;
getId('div1');
```
### call和apply用途

call 和 apply 都是非常常用的方法。作用一模一样，区别仅在于传入参数形式的不同。

`apply` 接受两个参数， 第一个参数指定了函数体内 this 对象的指向，第二个参数为一个带下标的集合，这个集合可以为数组，也可以为类数组。

`call` 传入参数数量不固定，跟 apply 相同的是，第一个参数也是代表函数体内的 this 指向，从第二个参数开始往后，每个参数被依次传入函数。

实际用途:
1. 改变 this 指向
2. `Function.prototype.bind`: 指定函数内部的 this

简化版bind
```javascript
Function.prototype.bind = function(context) {
    var self = this; // 保持原函数
    return function() {
        // 返回一个新的函数
        return self.apply(context, arguments);
        // 执行新的函数时候，会把之前传入的context当做新函数体内的this
    }
}
```
优化版bind: 可以预先填入一些参数
```javascript
Function.prototype.bind = function() {
    var self = this; // 保持原函数
    // 需要绑定的 this 上下文
    var context = [].shift.call(arguments);
    // 剩余参数转换为数组
    var args = [].slice.call(arguments);
    return function() {
        // 返回一个新的函数
        return self.apply(context, [].concat.call(args, [].slice.call(arguments)));
        // 执行新的函数时候，会把之前传入的context当做新函数体内的this
        // 并组合两次分别传入的参数，作为新函数的参数
    }
}
var obj = {name: 'sven'};
var func = function(a, b, c, d) {
    alert(this.name); // sven
    alert([a, b, c, d]); // [1, 2, 3, 4]
}.bind(obj, 1, 2);
func(3, 4);
```
3. 借用其他对象的方法
借用构造函数，实现类似继承的效果
```javascript
var A = function(name) {this.name = name;}
var B = function() {A.apply(this, arguments);}
var b = new B('sven');
```
函数参数列表 arguments 是一个类数组对象，虽然它也有下标，但它并非真正的数组，所以不能使用数组的相关函数，这时常借用 `Array.prototype` 对象上的方法。
```javascript
(function(){
    Array.prototype.push.call(arguments, 3);
    console.log(arguments); // [1, 2, 3]
})(1, 2);
```
V8 引擎中 `Array.prototype.push` 的实现
```javascript
function ArrayPush() {
    var n = TO_UINT32( this.length ); // 被 push 对象的 length
    var m = %_ArgumentsLength(); // push参数个数
    for(var i=0; i<m; i++) {
        this[i+n] = %_ArgumentsLength(i); // 复制元素
    }
    this.length = n + m; // 修正 length 属性的值
    return this.length;
}
```
`Array.prototype.push` 实际上是一个属性复制的过程，把参数按照下标依次添加到被 push 的对象上面，顺便修改了这个对象的 length 属性。由此推断，我们可以把任意对象传入 `Array.prototype.push`
```javascript
var a = {};
Array.prototype.push.call(a, 'first');
alert(a.length); // 1
alert(a[0]); // first
```
`Array.prototype.push` 要满足两个条件
- 对象本身可以存取属性, 传入 number 类型没有效果
- 对象的 length 属性可读写, 传入函数调用 length 会报错

## 闭包和高阶函数
闭包的形成和变量的作用域以及变量的生存周期密切相关。

### 变量作用域
> 变量作用域指的是变量的有效范围。

当声明一个变量没有使用 `var` 的时候，变量会变为全局变量，容易造成命名冲突。用 `var` 关键字在函数中声明变量，这时变量为局部变量，只能在函数内部访问。

在 JavaScript 中，函数可以用来创造函数作用域。搜索变量时，会随着代码执行环境创建的**作用域链**往外层逐层搜索，一直搜索到全局对象为止。

### 变量的生存周期
对于全局变量，生存周期是永久的，除非我们主动销毁这个全局变量。而函数内部 `var` 声明的变量，当退出函数时，这些局部变量便失去价值，会随着函数结束而销毁。

```javascript
var func  = function() {
    var a = 1;
    return function() {
        a++;
        console.log(a);
    }
}
var f = func();
f(); // 2
f(); // 3
```
当退出函数后，变量 `a` 并没有消失,当执行 `var f = func()` ，返回一个匿名函数的引用，它可以反问到 `func()` 被调用时产生的环境，而局部变量 `a` 一直处在这个环境里。既然这个局部变量还能被访问，就不会被销毁。这里产生了一个闭包结构。 

### 闭包的应用

1. **封装变量**: 把一些不需要暴露在全局的变量封装成"私有变量"
2. **延续局部变量的寿命**: 在一些低版本浏览器实现发送请求可能会丢失数据，每次请求并不都能成功发送 HTTP 请求,原因在于局部变量可能随时被销毁，而这时还没发送请求，造成请求丢失。可以用闭包封装，解决问题:
```javascript
var report = (function() {
    var imgs = [];
    return function(src) {
        var img = new Image();
        imgs.push(img);
        img.src = src;
    }
})
```
3. **利用闭包实现完整的面向对象系统**
4. **闭包实现命令模式**: 命令模式意图是把请求封装为对象，从而分离请求的发起者和接收者之间的耦合关系。在命令执行之前，可以预先往命令模式植入接收者。闭包可以完成这个工作，把命令接受者封闭在闭包形成的环境中。
```javascript
var TV = {
    open: function() {
        consoel.log('打开电视');
    },
    close: function() {
        console.log('关闭电视');
    }
}
var createCommand = function(receiver) {
    var execute = function() {
        return receiver.open();
    }
    var undo = function() {
        return receiver.close();
    }
    return {
        execute: execute,
        undo: undo
    }
};
var setCommand = function(command) {
    document.getElementById('execute').onclick = function() {
        command.execute();
    }
    document.getElementById('undo').onclick = function() {
        command.undo();
    }
}
setCommand(createCommand(TV));
```
5. **闭包和内存管理**: 使用闭包的同时比较容易形成循环引用，如果闭包的作用域链中保存着一些 DOM 节点，这时候就有可能造成内存泄漏。在 IE 浏览器中， 由于 BOM 和 DOM 中的对象是使用 C++ 以 COM 对象的方式实现的，而 COM 对象的垃圾收集机制是引用计数策略，在基于引用计数策略的垃圾回收机制中，如果两对象形成循环引用，就可能使得对象无法回收，造成内存泄漏。

### 高阶函数
高阶函数至少满足以下条件:
- 函数可以作为参数被传递
   1. 回调函数: 例如 ajax 异步请求的应用
   2. `Array.prototype.sort` 接收函数指定排序规则
- 函数可以作为返回值输出
   1. 判断数据类型 
   2. getSingle 单例模式
   
```javascript
// 类型判断
var isString = function(obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
}
var isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}
var isNumber = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Number]';
}
// 使用闭包优化
var isType = function(type) {
    return function(obj) {
        return Object.prototype.toString.call(obj) === '[object '+ type +']';
    }
}
var isString = isType('String');
var isArray = isType('Array');
var isNumber = isNumber('Number');
// getSingle
var getSingle = function(fn) {
    var ret;
    return function() {
        return ret || (ret = fn.apply(this, arguments));
    }
}
```
#### 高阶函数实现 AOP
> AOP 面向切面编程: 主要作用把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能包括日志统计、安全控制、异常处理等。

Java中实现AOP，通过反射和动态代理机制实现，JavaScript则是把一个函数"动态织入"另一个函数中,可以通过扩展 `Function.prototype` 实现

使用了装饰者模式:
```javascript
Function.prototype.before = function(beforefn) {
    var __self = this; // 保存原函数的引用
    return function() {
        // 返回包含了原函数和新函数的代理函数
        beforefn.apply(this, arguments);
        return __self.apply(this,arguments);
    }
}
Function.prototype.after = function(afterfn) {
    var __self = this;
    return function() {
        var ret = __self.apply(this, arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
}
var func = function() {console.log(2);}
func = func.before(function(){ 
    console.log(1);
}).after(function(){
    console.log(3);
});
func(); // 1 2 3
```

#### 高阶函数的其他应用
1. **currying**: 柯里化,又称部分求值。一个 currying 的函数首先接受一些参数，然后返回另一个函数，刚才传入的参数在函数形成闭包中被保存起来。待到函数被真正需要求值的时候，之前传入的参数一次性应用于求值。

通用 currying
```javascript
var currying = function(fn) {
    var args = [];
    return function() {
        if(arguments.length === 0) {
            return fn.apply(this, args);
        } else {
            [].push.apply(args, arguments);
            return arguments.callee;
        }
    }
}
// 案例
var cost = (function() {
    var money = 0;
    return function() {
        for(var i = 0, l = arguments.length; i < l; i++) {
            money += arguments[i];
        }
        return money;
    }
});
var cost = currying(cost); // 转化成curring函数
cost(100);
cost(200);
cost(300);
cost(); // 600
```
2. **uncurrying**: 把泛化的 this 提取出来。

实现方式之一:
```javascript
Function.prototype.uncurrying = function() {
    var self = this;
    return function() {
        var obj = Array.prototype.shift.call(arguments);
        return self.apply(obj, arguments);
    }
}
// 转化数组的push为通用函数
var push = Array.prototype.push.uncurrying();
(function(){
    push( arguments, 4);
    console.log(arguments); // 1， 2， 3， 4
})(1, 2, 3);
```
3. **函数节流**: 在一些场景下，函数有可能被非常频繁地调用，而造成大的性能问题。例如
   - `window.onresize`事件,当浏览器窗口大小被拖动而改变时，事件触发频率非常高
   - `mousemove`事件,拖拽事件
   - 上传进度。频繁的进行进度通知

这些的共同问题是函数被触发的频率太高。

代码实现: throttle 函数的原理是将即将被执行的函数用 setTimeout 延迟一段时间执行。如果该次延迟执行还没有完成，则会忽略接下来调用该函数的请求。 throttle 函数接受2个参数，第一个参数为需要延迟执行的函数，第二个参数为延迟执行的时间
```javascript
var throttle = function(fn, interval) {
    var __self = fn; // 保存需要被延迟执行的函数引用
    var timer; // 定时器
    var firstTime = true; // 是否是第一次调用
    return function() {
        var args = arguments;
        var _me = this;
        if(firstTime) {
            // 如果是第一次调用，不需要延迟执行
            __self.apply(__me, args);
            return firstTime = false;
        }
        if(timer) {
            // 如果定时器还在，说明前一次延迟执行还没有完成
            return false;
        }
        timer = setTimeout(function(){
            clearTimout(timer);
            timer = null;
            __self.apply(__me, args);
        }, interval || 500);
    };
};
// 案例
window.onresize = throttle(function() {
    console.log(1);
}, 500);
```
4. **分时函数**: 某些函数由用户主动调用，但是因为一些客观原因，会严重影响页面的性能。比如在页面中一次性渲染包含成千上百个节点的页面，在短时间内往页面中大量添加 DOM 节点会让浏览器吃不消，造成浏览器卡顿甚至假死。

解决方案之一是下面的 timeChunk 函数，让创建节点的工作分批进行。 timeChunk 函数接受3个参数，第一个参数是创建节点用到的数据，第2个参数是封装了创建节点逻辑的函数，第3个参数表示每一批创建节点数量。
```javaScript
var timeChunk = function(ary, fn, count) {
    var obj;
    var t;
    var len = ary.length;
    var start = function() {
        for(var i = 0;i < Math.min(count || 1, ary.length); i++) {
            var obj = ary.shift();
            fn(obj);
        }
    };
    return function() {
        t = setInterval(function() {
            if(ary.length === 0) {
                // 如果节点都已经被创建好
                return clearInterval(t);
            }
            start();
        }, 200);
    };
};
```
5. **惰性加载函数**: 第一次进入条件分支后，在函数内部重写这个函数，重写后的函数就是我们期望的函数，下一次再进入该函数就不再存在分支语句
```javascript
var addEvent = function(elem, type, handler) {
    if(window.addEventListener) {
        addEvent = function(elem, type, handler) {
            elem.addEventListener(type, handler, false);
        }
    } else if(window.attachEvent) {
        addEvent = function(elem, type, handler) {
            elem.attachEvent('on'+type, handler);
        }
    }
    addEvent(elem, type, handler);
}
```

# 设计模式
介绍了 JavaScript 开发中常见的 14种设计模式

## 单例模式
> 定义是: 保证一个类仅有一个实例，并提供一个访问它的全局访问点。

```javascript
var Singleton = function(name) {
    this.name = name;
    this.instacne = null;
}
Singleton.getInstance = (function() {
    var instance = null;
    return function(name) {
        if(!instance) {
            instance = new Singleton(name);
        }
        return instane;
    }
})
```
可以通过结合代理模式来实现单例模式。

### 使用命名空间
适当使用命名空间，并不会杜绝全局变量，减少全局变量数量
```javascript
var namespace = {
    a: function () {alert(1);},
    b: function () {alert(2);}
}
```
动态创建命名空间
```javascript
var MyApp = {};
MyApp.namespace = function(name) {
    var parts = name.splice('.');
    var current = MyApp;
    for(var i in parts) {
        if(!current[parts[i]]) {
            current[parts[i]] = {};
        }
        current = current[parts[i]];
    }
}
// 案例
MyApp.namespace('dom.style');
var MyApp = {
    dom: {
        style: {}
    }
}
```

惰性单例模式: 指需要的时候才创建对象实例。
```javascript
var getSingle = function(fn) {
    var result;
    return function() {
        return result || (result = fn.apply(this, arguments));
    }
}
```
传入创建对象的函数，之后再让 getSingle 返回一个新的函数，并且用一个变量 result 来保存 fn 的计算结果。 result 变量因为身在闭包中，它永远不会被销毁。

这样就把创建实例对象的职责和管理单例的职责分别放置在两个方法里，这两个方法独立变化互不影响，当他们连接在一起时，就完成了创建唯一实例对象的功能。符合单一职责原则。

不仅用于创建对象，还可用于绑定事件。

## 策略模式
> 定义是: 定义一系类的算法，把它们一个个封装起来，并且使它们可以互相替换。

策略模式优点:
1. 利用组合、委托、多态等技术和思想，可以有效地避免多重条件选择语句
2. 提供了对开封-封闭原则的完美支持，将算法封装在独立的 strategy中，使得它们易于切换，易于理解，易于扩展。
3. 算法可以复用到系统其他地方，从而避免许多重复的复制粘贴操作
4. 利用组合和委托来让 Context 拥有执行算法的能力，也是继承的一种替代方案

## 代理模式
## 迭代器模式
## 发布-订阅模式
## 命令模式
## 组合模式
## 模板方法模式
## 享元模式
## 职责链模式
## 中介者模式
## 装饰者模式
## 状态模式
## 适配器模式

# 设计原则和编程技巧
## 单一职责原则
## 最少知识原则
## 开放-封闭原则
## 接口和面向接口编程
## 代码重构