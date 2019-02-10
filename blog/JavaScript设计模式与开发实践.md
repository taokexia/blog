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

一个基于策略模式的程序至少由两部分组成。第一个部分是一组策略类，策略类封装了具体的算法，并负责具体的计算过程。第二个部分是环境类 Context，Context 接收客户的请求，随后请求委托给某一个策略类。 Context 中维持对某个策略对象的引用。
```javascript
var strategies = {
    'S': function(salary) {
        return salary * 4;
    },
    'A': function(salary) {
        return salary * 3;
    },
    'B': function(salary) {
        return salary * 2;
    }
};
var calculateBonus = function(level, salary) {
    return strategies[level](salary);
}
// 案例
console.log(calculateBonus('S', 20000));
```
### 利用策略模式实现动画效果
```html
<body>
    <div style="position:absolute;background:blue" id="div">我是div</div>

</body>
<script>
    // 定义动画的策略
    var tween = {
        linear: function(t, b, c, d) {
            return c * t / d + b;
        },
        easeIn: function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        strongEaseIn: function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        strongEaseOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        },
        sineaseIn: function(t, b, c, d) {
            return c * (t /= d) * t * t + b;
        },
        sineaseOut: function(t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        }
    };
    // 定义动画类
    var Animate = function(dom) {
        this.dom = dom; // 进行运动的dom 节点
        this.startTime = 0; // 动画开始时间
        this.startPos = 0; // 动画开始时，dom 节点的位置，即dom 的初始位置
        this.endPos = 0; // 动画结束时，dom 节点的位置，即dom 的目标位置
        this.propertyName = null; // dom 节点需要被改变的css 属性名
        this.easing = null; // 缓动算法
        this.duration = null; // 动画持续时间
    };


    Animate.prototype.start = function(propertyName, endPos, duration, easing) {
        this.startTime = +new Date; // 动画启动时间
        this.startPos = this.dom.getBoundingClientRect()[propertyName]; // dom 节点初始位置
        this.propertyName = propertyName; // dom 节点需要被改变的CSS 属性名
        this.endPos = endPos; // dom 节点目标位置
        this.duration = duration; // 动画持续事件
        this.easing = tween[easing]; // 缓动算法
        var self = this;
        var timeId = setInterval(function() { // 启动定时器，开始执行动画
            if (self.step() === false) { // 如果动画已结束，则清除定时器
                clearInterval(timeId);
            }
        }, 19);
    };
    // 小球运动每一帧要做的事情
    Animate.prototype.step = function() {
        var t = +new Date; // 取得当前时间
        if (t >= this.startTime + this.duration) { // 判断动画时间是否结束
            this.update(this.endPos); // 更新小球的CSS 属性值
            return false;
        }
        var pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration);
        // pos 为小球当前位置
        this.update(pos); // 更新小球的CSS 属性值
    };
    // 更新运动属性
    Animate.prototype.update = function(pos) {
        this.dom.style[this.propertyName] = pos + 'px';
    };

    var div = document.getElementById('div');
    var animate = new Animate(div);
    animate.start('left', 500, 1000, 'strongEaseOut');
</script>
```

在实际开发中，我们常把算法含义扩散开来，使策略模式也可以封装一系列业务规则。例如利用策略模式来进行表单验证。

```javascript
/*************** 策略对象 *******************/
var strategies = {
    isNonEmpty: function(value, errorMsg) { // 不为空
        if (value === '') {
            return errorMsg;
        }
    },
    minLength: function(value, length, errorMsg) { // 限制最小长度
        if (value.length < length) {
            return errorMsg;
        }
    },
    isMobile: function(value, errorMsg) { // 手机号码格式
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
};
/****** 定义类来保存要检验的内容 **********/
var Validator = function() {
    this.cache = []; // 保存校验规则
};
Validator.prototype.add = function(dom, rule, errorMsg) {
    var ary = rule.split(':'); // 把strategy 和参数分开
    this.cache.push(function() { // 把校验的步骤用空函数包装起来，并且放入cache
        var strategy = ary.shift(); // 用户挑选的strategy
        ary.unshift(dom.value); // 把input 的value 添加进参数列表
        ary.push(errorMsg); // 把errorMsg 添加进参数列表
        return strategies[strategy].apply(dom, ary);
    });
};
Validator.prototype.start = function() {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
        var msg = validatorFunc(); // 开始校验，并取得校验后的返回信息
        if (msg) { // 如果有确切的返回值，说明校验没有通过
            return msg;
        }
    }
};
/********** 客户调用代码 *******************/
var validataFunc = function() {
    var validator = new Validator(); // 创建一个validator 对象
    /***************添加一些校验规则****************/
    validator.add(registerForm.userName, 'isNonEmpty', '用户名不能为空');
    validator.add(registerForm.password, 'minLength:6', '密码长度不能少于6 位');
    validator.add(registerForm.phoneNumber, 'isMobile', '手机号码格式不正确');
    var errorMsg = validator.start(); // 获得校验结果
    return errorMsg; // 返回校验结果
}
var registerForm = document.getElementById('registerForm');
registerForm.onsubmit = function() {
    var errorMsg = validataFunc(); // 如果errorMsg 有确切的返回值，说明未通过校验
    if (errorMsg) {
        alert(errorMsg);
        return false; // 阻止表单提交
    }
};
```

策略模式优点:
1. 利用组合、委托、多态等技术和思想，可以有效地避免多重条件选择语句
2. 提供了对开封-封闭原则的完美支持，将算法封装在独立的 strategy中，使得它们易于切换，易于理解，易于扩展。
3. 算法可以复用到系统其他地方，从而避免许多重复的复制粘贴操作
4. 利用组合和委托来让 Context 拥有执行算法的能力，也是继承的一种替代方案

## 代理模式
> 代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

两种代理模式: 通过代理拒绝某些请求的方式为**保护代理**，用于控制不同权限对象对目标对象的访问; 把一些开销很大的对象，延迟到真正需要它的时候才创建为**虚拟代理**。

虚拟代理案例:
```javascript
var myImage = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    return {
        setSrc: function(src) {
            imgNode.src = src;
        }
    }
})();
// 代理，先显示本地图片，加载完成后显示网络图片
var proxyImage = (function() {
    var img = new Image;
    img.onload = function() {
        myImage.setSrc(this.src);
    }
    return {
        setSrc: function(src) {
            myImage.setSrc('loading.jpg');
            img.src = src;
        }
    }
})();
proxyImage.setSrc('https://p.qpic.cn/music_cover/Fe6emiag6IuVbMib3oN6yctRX8ZBICoa4liaYZkwZoSCaJdw7tOW5bCiaA/300?n=1');
```
> 单一职责原则: 就一个类而言，应该仅有一个引起它变化的原因。职责被定义为"引起变化的原因"。

如果代理对象和本体对象都为一个函数，函数必然都能被执行，则可以认为他们也具有一致的“接口”。
```javascript
var myImage = (function() {
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    // 返回函数
    return function(src) {
        imgNode.src = src;
    }
})();
```

### 虚拟代理合并 HTTP 请求
```javascript
// 发送文件的时间，用于绑定事件，并且在点击的同时往另一台服务器同步文件：
var synchronousFile = function(id) {
    console.log('开始同步文件，id 为: ' + id);
};
// 延迟2秒，把所有请求一起发送，减轻服务器负担
var proxySynchronousFile = (function() {
    var cache = [], // 保存一段时间内需要同步的ID
        timer; // 定时器
    return function(id) {
        cache.push(id);
        if (timer) { // 保证不会覆盖已经启动的定时器
            return;
        }
        timer = setTimeout(function() {
            synchronousFile(cache.join(',')); // 2 秒后向本体发送需要同步的ID 集合
            clearTimeout(timer); // 清空定时器
            timer = null;
            cache.length = 0; // 清空ID 集合
        }, 2000);
    }
})();
```
### 缓存代理
缓存代理可以为一些开销大的运算结果提供暂时的存储，在下次运算时，如果传递进来的参数跟之前的一致，可以直接返回前面存储的运算结果。
```javascript
/**************** 计算乘积 *****************/
var mult = function(){
    var a = 1;
    for ( var i = 0, l = arguments.length; i < l; i++ ){
        a = a * arguments[i];
    }
    return a;
};
/**************** 计算加和 *****************/
var plus = function(){
    var a = 0;
    for ( var i = 0, l = arguments.length; i < l; i++ ){
        a = a + arguments[i];
    }
    return a;
};
/********* 创建缓存代理的工厂 *************/
var createProxyFactory = function( fn ){
    // 建立缓存对象
    var cache = {};
    return function(){
        var args = Array.prototype.join.call( arguments, ',' );
        if ( args in cache ){
            return cache[ args ];
        }
        return cache[ args ] = fn.apply( this, arguments );
    }
};
// 案例
var proxyMult = createProxyFactory( mult ),
proxyPlus = createProxyFactory( plus );
console.log( proxyMult( 1, 2, 3, 4 ) ); // 输出：24
console.log( proxyPlus( 1, 2, 3, 4 ) ); // 输出：10
```

其他代理模式: 防火墙代理、远程代理、保护代理、智能引用代理等

## 迭代器模式
> 迭代器模式指提供一种方法顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部表示。如 JavaScript 中的 `Array.prototype.forEach`

内部迭代器: 接受2个参数，第一个为被循环的数组，第二个为循环中的每一步后将触发的回调函数。内部迭代器调用方便，外界不用关心内部实现，跟迭代器交互仅第一次初始调用，缺陷是内部迭代规则无法进行修改。
```javascript
var each = function(ary, callback) {
    for(var i = 0, l = ary.length; i < l; i++) {
        callback.call(ary[i], i, ary[i]); // 把下标和元素作为参数传给callback函数
    }
}
```
外部迭代器: 必须显示请求迭代下一个元素。增加了调用复杂度，但也相对增加了灵活性。
```javascript
// 适用面更广，能满足更多变的需求
var Iterator = function( obj ){
    var current = 0;
    var next = function(){
        current += 1;
    };
    var isDone = function(){
        return current >= obj.length;
    };
    var getCurrItem = function(){
        return obj[ current ];
    };
    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem
    }
};
// 比较函数
var compare = function( iterator1, iterator2 ){
    while( !iterator1.isDone() && !iterator2.isDone() ){
        if ( iterator1.getCurrItem() !== iterator2.getCurrItem() ){
            throw new Error ( 'iterator1 和iterator2 不相等' );
        }
        iterator1.next();
        iterator2.next();
    }
    console.log( 'iterator1 和iterator2 相等' );
}
var iterator1 = Iterator( [ 1, 2, 3 ] );
var iterator2 = Iterator( [ 1, 2, 3 ] );
compare( iterator1, iterator2 ); // 输出：iterator1 和iterator2 相等
```
迭代器模式不仅可以迭代数组，还可以迭代一些类数组对象。只要被迭代的聚合对象具有 length 属性且可以用下标访问，就可以被迭代。
```javascript
// 倒序迭代器
var reverseEach = function(ary, callback) {
    for(var l = ary.length-1; l >= 0; l--) {
        callback(l, ary[l]);
    }
}
// 终止迭代器
var each = function( ary, callback ){
    for ( var i = 0, l = ary.length; i < l; i++ ){
        if ( callback( i, ary[ i ] ) === false ){ // callback 的执行结果返回false，提前终止迭代
            break;
        }
    }
};
```

## 发布-订阅模式
> 发布订阅模式又叫观察者模式，它定义对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。

发布订阅模式可以广泛应用于异步编程中，这是一种替代传递回调函数的方案。发布订阅模式可以取代对象之间硬编码的通知机制，一个对象不用再显式地调用另外一个对象的某个接口。

DOM 节点上绑定事件函数就是应用了发布订阅模式。

通用发布-订阅模式代码:
```javascript
var event = {
    clientList: [], // 二维数据，用于保存订阅事件
    listen: function( key, fn ){ // 订阅事件
        if ( !this.clientList[ key ] ){
            this.clientList[ key ] = [];
        };
        this.clientList[ key ].push( fn ); // 订阅的消息添加进缓存列表
    },
    trigger: function(){ // 发布事件
        var key = Array.prototype.shift.call( arguments ), // 获得事件 key
        fns = this.clientList[ key ];
        if ( !fns || fns.length === 0 ){ // 如果没有绑定对应的消息
            return false;
        }
        for( var i = 0, fn; fn = fns[ i++ ]; ){
            fn.apply( this, arguments ); // arguments 是trigger 时带上的参数
        }
    },
    remove: function( key, fn ){ // 移除订阅
		var fns = this.clientList[ key ];
		if ( !fns ){ // 如果key 对应的消息没有被人订阅，则直接返回
			return false;
		}
		if ( !fn ){ // 如果没有传入具体的回调函数，表示需要取消key 对应消息的所有订阅
			fns && ( fns.length = 0 );
		}else{
			for ( var l = fns.length - 1; l >=0; l-- ){ // 反向遍历订阅的回调函数列表
				var _fn = fns[ l ];
				if ( _fn === fn ){
					fns.splice( l, 1 ); // 删除订阅者的回调函数
				}
			}
		}
	}
};
// 可以给所有的对象安装发布-订阅功能
var installEvent = function( obj ){
    for ( var i in event ){
        obj[ i ] = event[ i ];
    }
};
```
### 模块间通信
利用发布订阅模式，可以在两个封装良好的模块中通信，这两个模块完全不知道对方的存在。
```javascript
// 通用发布-订阅模式
var Event = (function() {
    var clientList = {},
        listen,
        trigger,
        remove;
    listen = function(key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };
    trigger = function() {
        var key = Array.prototype.shift.call(arguments),
            fns = clientList[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    };
    remove = function(key, fn) {
        var fns = clientList[key];
        if (!fns) {
            return false;
        }
        if (!fn) {
            fns && (fns.length = 0);
        } else {
            for (var l = fns.length - 1; l >= 0; l--) {
                var _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1);
                }
            }
        }
    };
    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    }
})();
// 模块a
var a = (function() {
    var count = 0;
    var button = document.getElementById('count');
    button.onclick = function() {
        Event.trigger('add', count++);
    }
})();
// 模块b
var b = (function() {
    var div = document.getElementById('show');
    Event.listen('add', function(count) {
        div.innerHTML = count;
    });
})();
```
在某些情况下，还可以先把发布的消息保存下来，等到有对象订阅它的时候，再重新把消息发送给订阅者。例如: QQ中离线消息。

使用命名空间解决命名冲突，同时添加保存消息的功能
```javascript
// 更新Event，使得可以在订阅之前存储发布的内容
var Event = (function(){
    var global = this,
    Event,
    _default = 'default';
    Event = function(){
        var _listen,
        _trigger,
        _remove,
        _slice = Array.prototype.slice, // 绑定原生Array函数
        _shift = Array.prototype.shift, // 绑定原生Array函数
        _unshift = Array.prototype.unshift, // 绑定原生Array函数
        namespaceCache = {},
        _create,
        find,
        each = function( ary, fn ){  // 迭代器
            var ret;
            for ( var i = 0, l = ary.length; i < l; i++ ){
                var n = ary[i];
                ret = fn.call( n, i, n);
            }
            return ret;
        };
        _listen = function( key, fn, cache ){   // 添加监听
            if ( !cache[ key ] ){
                cache[ key ] = [];
            }
            cache[key].push( fn );
        };
        _remove = function( key, cache ,fn){ // 移除监听
            if ( cache[ key ] ){
                if( fn ){
                    for( var i = cache[ key ].length; i >= 0; i-- ){
                        if( cache[ key ] === fn ){
                            cache[ key ].splice( i, 1 );
                        }
                    }
                }else{
                    cache[ key ] = [];
                }
            }
        };
        _trigger = function(){ // 触发事件
            var cache = _shift.call(arguments),
            key = _shift.call(arguments),
            args = arguments,
            _self = this,
            ret,
            stack = cache[ key ];
            if ( !stack || !stack.length ){
                return;
            }
            return each( stack, function(){
                return this.apply( _self, args );
            });
        };
        _create = function( namespace ){ // 创建命名空间
            var namespace = namespace || _default;
            var cache = {},
            offlineStack = [], // 离线事件
            ret = {
                listen: function( key, fn, last ){
                    _listen( key, fn, cache );
                    if ( offlineStack === null ){
                        return;
                    }
                    if ( last === 'last' ){
                    }else{
                        each( offlineStack, function(){
                            this();
                        });
                    }
                    offlineStack = null;
                },
                one: function( key, fn, last ){
                    _remove( key, cache );
                    this.listen( key, fn ,last );
                },
                remove: function( key, fn ){
                    _remove( key, cache ,fn);
                },
                trigger: function(){
                    var fn,
                    args,
                    _self = this;
                    _unshift.call( arguments, cache );
                    args = arguments;
                    fn = function(){
                        return _trigger.apply( _self, args );
                    };
                    if ( offlineStack ){
                        return offlineStack.push( fn );
                    }
                    return fn();
                }
            };
            return namespace ?
            ( namespaceCache[ namespace ] ? namespaceCache[ namespace ] :
                namespaceCache[ namespace ] = ret )
            : ret;
        };
        return {
            create: _create,
            one: function( key,fn, last ){
                var event = this.create( );
                event.one( key,fn,last );
            },
            remove: function( key,fn ){
                var event = this.create( );
                event.remove( key,fn );
            },
            listen: function( key, fn, last ){
                var event = this.create( );
                event.listen( key, fn, last );
            },
            trigger: function(){
                var event = this.create( );
                event.trigger.apply( this, arguments );
            }
        };
    }();
    return Event;
})();

/************* 先发布后订阅 ***************/ 
Event.trigger('click', 1);
Event.listen('click', function(a) {
    console.log(a);     
});


/********** 使用命名空间 ******************/ 
Event.create('namespace1').listen('click', function(a) {
    console.log(a);
})

Event.create('namespace1').trigger('click', 1);

Event.create('namespace2').listen('click', function(a) {
    console.log(a);
})
Event.create('namespace2').trigger('click', 2);
```
JavaScript 无需选择使用推模型还是拉模型。推模型指在事件发生时，发布者一次性把所有更改的状态和数据都推送给订阅者。拉模型是发布者仅仅通知订阅者事件已经发生了，此外发布者要提供一些公开的接口供订阅者来主动拉取数据。

发布-订阅模式优点是时间上解耦和对象间解耦。应用非常广泛。缺点是创建订阅者本身要消耗一定时间和内存，弱化对象之间的联系。

## 命令模式
> 命令模式是最简单和优雅的模式之一，命令模式中的命令指的是一个执行某些特定事情的指令。

最常用的场景是: 有时候需要向某些对象发送请求，但是并不知道请求的接收者是谁，也不知道被请求的操作是什么。此时需要一种松耦合的方式设计程序，使得请求的发送者和接收者能消除彼此的耦合关系。

命令模式的由来，其实是回调(callback)函数的一个面向对象的替代品。

```javascript
var button1 = document.getElementById('button1');
// 设置命令,接受按钮和绑定的函数
var setCommand = function(button, command) {
    button.onclick = function() {
        command.execute();
    }
};
var MenuBar = {
    refresh: function() {
        alert('刷新菜单界面');
    }
};
// 设置命令，对外提供 execute 执行函数
var RefreshMenuBarCommand = function(receiver) {
    return {
        execute: function() {
            receiver.refresh();
        }
    }
};
var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
setCommand(button1, refreshMenuBarCommand);
```
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