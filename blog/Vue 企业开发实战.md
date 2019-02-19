> 书名: Vue 企业开发实战<br>
> 作者: 肖睿 龙颖<br>
> 出版社: 人民邮电出版社<br>
> 网址: http://www.ryjiaoyu.com/book/details/8941

# 架构设计
前端技术更新很快，有前端自动化工具(Gulp, Grunt), 前端组件化框架(Vue.js), 前端工程化(一套技术思想), 前端模块化(SeaJS、ECMAScript),简称 四个现代化。

## 环境搭建
### Node.js
安装 Node： Node 是事件驱动、非阻塞式 I/O 的模型。使用 npm  包管理器来安装依赖
- `npm install <Module Name> -g` 安装模块，`-g` 表示全局安装
- `npm list <Module Name>` 查看某个模块的版本号
- `npm uninstall <Module Name>` 卸载模块
- `npm update <Module Name>` 更新模块

> 安装淘宝的 NPM 镜像: `npm install -g cnpm --registry=https://registry.npm.taobao.org`

### Vue-cli 脚手架
Vue-cli 是一个官方命令行工具，可用于快速搭建大型单页面应用。

> **单页面应用(SPA)** 只有一个 Web 页面的应用，是一种从 Web 服务器加载的客户端，单页面跳转仅刷新局部资源，公共资源仅需加载一次。

> **多页面应用(MPA)** 多页面跳转刷新所有资源，每个公共资源需要选择性重新加载。

差别: 
|              |                单页面应用                 |                                多页面应用 |
| :--------------- | :---------------------------------------: | ----------------------------------------: |
| 组成             |        一个外壳页面和多个页面片段         |                              多个完整页面 |
| 资源共享(css,js) |         公用，只需在外壳部分加载          |                不共用，每个页面都需要加载 |
| url 模式         |              a.com/#/pageone              |                        a.com/pageone.html |
| 用户体验         |       页面片段切换快，用户体验良好        |  页面切换加载缓慢，流畅度不够，用户体验差 |
| 搜索引擎优化     | 需要单独方案，实现较为困难，不利于SEO检索 | 可利用服务器端渲染(SSR)优化，实现方法简易 |
| 开发成本         |            较高，需要借助框架             |                      较低，页面重复代码多 |
| 维护成本         |                 相对容易                  |                                  相对复杂 |
安装 vue-cli
```
cnpm install vue-cli -g 
cnpm intall webpack -g
// 创建项目
vue init webpack <项目名称>
// 运行项目
npm run dev
```
## 前端架构设计
把功能相似、抽象级别相似的实现进行分层，使逻辑变得清晰、容易理解和维护，称多次架构或 N 层架构。优势在于: 易维护、可扩展、易复用、灵活性高。

分层架构需要用到模块化技术。模块化是解决一个复杂问题时自顶向下逐层把系统划分成若干模块的过程，有多种属性放映其内部特性，同时模块化还可以解耦实现并行开发。

模块化方案有： AMD(requirejs)、CMD(sea.js)、CommonJS、ES6

### 分离方式
分离种类
- 不分离
- 部分分离
- 完全分离
  - 分离开发集成部署
  - 分离开发分离部署

### UI 框架
使用 iview： 安装方式
```
cnpm install iview --save
```
引入项目:
1. 一次性将全部组件引入到项目中，实现简单，但会造成文件体积过大
    ```js
    import iView from 'iview'; // 引入 iView 框架
    import 'iView/dist/styles/iview.css'; // 引入 iView 框架样式
    Vue.use(iView);
    ```
2. 按需引入组件：首先安装一个插件
    ```
    npm install babel-plugin-import --save-dev
    ```
    > babel-plugin-import 插件可以从组件中引入需要模块
    编写`.babelrc`文件
    ```
    {
        "plugins": [["import", {
            "libraryName": "iview",
            "libraryDirectory": "src/components"
        }]]
    }
    ```
    具体使用
    ```js
    import {Button, Table} from 'iview';
    Vue.component('Button', Button);
    Vue.component('Table', Table);
    ```
### 构建工具 Webpack
优点:
1. 解决 JavaScript 和 CSS 的依赖问题
2. 性能优化：文件合并和文件压缩
3. 效率提升(添加 CSS3 前缀)

打包案例:
./src/index.js: 要打包的js文件
```js
document.write("Hello world!");
```
index.html
```html
<html>
    <head>
        <meta charset="utf-8">
    </head>
    <body>
        <!-- 引用编译后的 js 文件 -->
        <script type="text/javascript" src="build.js" charset="utf-8"></script>
    </body>
</html>
```
`./src/style.css` 添加要编译的 css 文件
```
body { background-color: red; }
```
安装 `css-loader`、`style-loader`
```
cnpm install css-loader style-loader --save-dev
```
webpack.config.js
```js
module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: 'build.js'
    },
    module {
        // 引入 css 样式
        loaders: [{
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }]
    }
}
```
输入命令,编译 js
```
webpack ./src/index.js build.js
```
# ES6的使用 
## let 和 const 命令
ES6 新增命令，用了声明变量。

let命令
1. let 只在所在代码块有效。
2. let 声明变量作用域不会被提前。var 支持变量提升， let 不行，提前使用会报错。
3. 在相同作用域下不能声明相同的变量
4. for 循环体中 let 的父子作用域，for 循环内部函数执行是异步操作。

const命令: 声明一个只读常理。一旦声明，不能修改。作用域与 let 相同。
保证的是内存地址不得改动。对于引用类型，常量指向的内存地址保存的指针。

> 一般在需要一个模块或定义一些全局变量时使用。

## 变量解构赋值
Destructuring: ES6 允许按照一定模式从数组和对象中提取值，再对变量赋值。
```js
let [a, b, c] = [1, 2, 3]
let [a, [b], d] = [1, [2, 3], 4] // a=1 b=2 d=4
let [x=1] = [undefined] // x=1
let [x=1] = [null] // x= null
```
> ES6 内部使用严格相等运输符(===)来判断一个位置是否有值，只有当一个数组成为成员等于 undefined， 默认值才会生效

解构不成功，变量的值为 undefined。 不完全解构: 只给一部分变量赋值。

解构不仅可以用于数组，还可以用于对象。数组元素要按照次序排序，变量取值由它位置决定，对象属性没有次序，变量必须与属性同名，才可取到值
```js
let {bar, foo} = {foo: "aaa", bar: "bbb"}; // bar=bbb, foo=aaa
let {foo: baz} = {foo: "aaa", bar: "bbb"}; 
// baz=aaa foo 是匹配模式， baz 是变量
let {x: y=3} = {x: 5} // y=5
```
> 对象解构赋值的内部机制，是先找到同名属性，在赋值给对应的变量，真正被赋值的是后者，而不是前者。

利用解构赋值可以方便提取 JSON 数据

## 使用箭头函数
简化代码量，与普通函数相比，优势主要是:
1. 不绑定 this，arguments

    this 始终为定义时的this，如果要使用 arguments 会出现一些问题。如果要获取参数可以使用剩余参数来取代 arguments
    ```js
    let arrowfunc = (...theArgs) => console.log(theArgs.length)
    ```
2. 更简化的代码语法
```js
(参数) => { 函数声明 }
单一参数 => { 函数声明 }
```
不适用箭头函数的情况：
1. 对象方法: 对象方法不建议使用箭头函数。
    ```js
    const Person = {
        username: 'Tom',
        sayHello: () => {
            setInterval(() => {
                console.log('my name is' + this.usernaem)
            }, 1000)
        }
    }
    Person.sayHello() // my name is undefined
    ```
    因为方法写在对象里，而对象括号不能封闭作用域，所有此时 this 指向全局对象。
2. 不能作为构造函数，箭头函数的 this 具有不绑定特点
3. 定义原型方法。

> 需要动态修改 this 的方法不建议使用 this

## Map 数据结构
JS 对象本质上是键值对的集合(Hash 结构)，但传统上只能使用字符串为键。ES6 提供了 Map 这种数据结构，键范围不限于字符串。
1. 创建: `const map = new Map([['name','张三'],['title','author']])`
2. 常用属性和方法
   1. size 属性: 返回 Map 成员总数
   2. set 和 get 方法: 给 Map 键设置对应值和获取键对应的值，可采用链式写法。get获取不到key，则返回 undefined
   3. has 方法，返回一个布尔值，判断某个键是否在当前 Map 对象中
   4. delete 方法 删除某个键，成功返回 true，失败返回 false
   5. 遍历方法
      1. keys() 返回键名的遍历器
      2. values() 返回键值的遍历器
      3. entries() 返回所有成员的遍历器
      4. forEach() 遍历 Map 所有成员

## Module 的语法
> ES6 模块设计思想是尽量静态化，使得编译时就能确定模块的依赖关系，以及输出和输入的变量。

### export 命令
一个模块是一个独立的文件，文件内部所有变量外部无法获取。如果希望外部能够读取模块内部变量，必须使用 export 关键字输出变量。

### import 命令
使用 export 命令定义模块的对外接口以后，其他 JS 文件就可以通过 import 命令加载这个模块。import 命令接受一对大括号，里面指定要从其他模块导入的变量名(或函数名),大括号里面变量必须与被导入模块对外接口名称相同
```js
import {firstname, lastname} from './profile.js'
```
> import 导入的引用变量不建议对属性进行修改

import 可以使用绝对路径和相对路径，`.js`后缀可省略
### export default 命令
import 命令用户需要知道所加载变量名或函数名。 而使用 export default 指定为模块默认输出，这样 import 命令可以为导入的变量指定另一个名字。一个模块只能使用一次。

## Promise 对象
Promise 是异步编程的一种解决方案。

特点:
1. 对象状态不受外界干扰。有3中状态: pending(进行中)、fulfilled(已成功)和 rejected(已失败)。只有异步操作结果可以决定哪种状态
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。状态改变只有两种: `pending->fulfilled` 和 `pending->rejected`，一旦到 resolved(定型)，就不会再改变

缺点:
1. 无法取消 Promise，一旦新建就立即执行，无法中途取消
2. 如果不设置回调函数，内部抛出错误就不会反应到外部
3. 当处于 pending 状态时，无法得知目前进展到什么阶段(刚刚开始还是即将完成)

## 基本用法
1. 接受两个参数，resolve 和 reject。resolve 函数在状态`pending->fulfilled` ，操作成功时调用，将异步操作结果作为参数返回出去。 reject 函数在状态`pending->rejected`,操作失败时调用，将操作的错误作为参数传递出去。
2. 使用 then 指定 resolve和 reject的回调函数。第二个回调函数可选，不一定会执行。
```js
const promise = new Promise(function(resolve, reject) {
    // some code
    if(/* 异步操作成功 */) {
        resolve(value);
    } else {
        reject(err);
    }
});
promise.then(function(value) {
    // success
}, function(error) {
    // failure
});
```
# 路由配置
## 前端路由
路由就是根据不同的 url 地址展示不同的内容或页面。前端路由和后端路由技术实现不一样，原理一样。在 HTML5 的 history 出现之前，前端路由都是通过 hash 来实现，它的 URL 规则中需要带上 "#"。

web 服务器不会解析 hash，会自动忽略#后面的内容。但 JS 可以通过 `window.location.hash`读取到路径之后进行解析。

> history 是 HTML5 新增 API，可以操作浏览器的 session history

前端路由优点:
- 访问一个新页面仅变化路径，没有网络延迟，提升体验
- 支持单页面应用

缺点:
- 浏览器前接、后退按钮会重新发送请求，没有合理利用缓存
## Vue Router 基本使用
Vue Router 是 Vue 的一个插件，需要在 Vue 的全局应用中通过 `Vue.use()` 将它纳入到 Vue 实例中。Vue-cli 搭建脚手架时会询问是否需要路由，路由生成位置 `src/router`,内部`index.js`文件
```js
import Vue from 'vue'
import Router from 'vue-router'
// 引入相应组件或页面
import HelloWorld from '@/components/HelloWorld'
import Login from '@/pages/login'
Vue.use(Router)
export default new Router({
    routes: [
        {
            path: '/', // 路径，默认跳转
            name: 'Hello World' // 命名
            component: HelloWorld // 组件
        },
        {
            path: '/login',
            name: 'Login',
            component: Login 
        }
    ]
})
```
`main.js` 导入 router 路由配置信息
```js
import Vue from 'vue'
import router from './router'
import App from './App'

new Vue({
    el: '#app',
    router,
    template: '<App/>'
    components: { App }
})
```
路由匹配到组件将渲染到 App.vue 的 `<router-view></router-view>`
## 路由重定向
```js
const router = new VueRouter({
    routes: [
        { path: '/a', redirect: '/b' },
        // 可以是一个命名路由
        { path: '/b', redirect: {name: 'foo'}}
        // 可以是一个方法
        { path: '/c', redirect: to => {
            // 方法接收“目标路由作为参数”
            // return 重定向的 “字符串路径/路径对象”
        }}
    ]
})
```
## 路由懒加载
结合 Vue 异步组件和 Webpack 代码分隔，轻松实现路由组件的懒加载。

> 异步组件: 在大型应用中，可能需要将应用拆分多个小模块，按需下载， Vue 允许将组件定义为1个工厂函数，异步地解析组件的定义。

首先，可以将异步组件定义成一个 Promise 的工厂函数
```js
const Foo = () => Promise.resolve({/* 组件定义对象 */})
```
Webpack 动态 import 来定义代码分块点
```js
const Foo = () => import('./Foo.vue')
```
懒加载不会一次性加载所有组件，而是访问到组件的时候才加载。
```js
const Header = () => import('@/components/header');
```
## `router-link`
支持用户在具有路由功能的应用中单击导航。通过 to 属性指定目标地址，tag 属性指定生成标签。
```html
<router-link v-bind:to="home"></router-link>
<router-link v-bind:to="{name: 'user', params: { userId: 123 }}">User</router-link>
<!-- 带查询参数 -->
<router-link :to={name: 'user', params: { userId: 123 }}">User</router-link>
```
优势:
1. Html history 模式与 hash模式下表现一致。
2. 会守卫单击事件，让浏览器不再重新加载页面
3. history 模式下使用 base 选项之后，所有 to 属性不需要写基路径。

## 路由对象属性:
- `$route.pah` 对应当前路由路径
- `$route.params` key/value 对象，包含动态片段和全局匹配片段
- `$route.query` 表示查询参数
- `$route.hash` 路由 hash 值
- `$route.fullPath` 完成解析后 URL
- `$route.matched` 包含当前路由所有嵌套路径片段的路由记录

## 页面间导航
- `router.push(location)` 向 history 栈添加一个新记录，当用户点击浏览器后退按钮时，回到之前的 URL。

    > 单击`<router-link>` 内部调用 router.push() 方法，单击 `<router-link>`等于调用 push
- `router.replace(location)` 不同的是它不会向 history 栈添加新记录，等价于 `<router-link :to='...' replace>`
- `router.go(n)` 整数参数，代表前进或后退多少步，类似于 `window.history.go(n)`

# 初识 Vue.js
Vue.js 介绍: 简单小巧的核心，渐进式的技术栈，足以应付任何规模的应用。提供了 Web 开发中的常见高级功能
1. 解耦视图与数据
2. 可复用的组件
3. 前端路由
4. 状态管理
5. 虚拟 DOM(Virtual DOM)

使用了 MVVM 模式:
M: 负责数据存储
V: 负责页面展示
VM: 负责业务逻辑处理，对数据加工后交给视图展示

优点是:
1. 低耦合
2. 可重用性
3. 独立开发

## Vue 实例与数据绑定
插值表达式: `{{ ... }}`, 作用是将双大括号中的数据替换成对应属性值进行展示。也叫模板语法(Mustache 语法)

插值可以为 JSON 数据、数字、字符串和插值表达式。

## 生命周期
指实例从构造函数开始执行(被创建)，到被 GC (垃圾回收)销毁的整个存在时期。

生命周期钩子: 在实例对象从创建到被回收的整个过程中，不同时期会有不同钩子函数，可以利用不同时期钩子函数完成不同操作。

生命周期有
- `Created` 创建后，组件实例刚创建完成，此时 DOM 还未生成
- `mounted` 载入后，模板编译，挂载之后
- `updated` 组件更新之后
- `destoryed` 组件销毁后调用

## 指令
`v-bind`,简写为 `:` 动态更新 HTML 元素上属性,可用于动态切换 class，当有多个 calss 时，可以绑定成数组形式，绑定 class 过长时可以使用**计算属性**
  - 绑定内联样式 `:style="{border: activeColor, fontSize: fontSize + 'px'}"`
  - 使用 `:style` 时，Vue 会自动给特殊的 CSS 属性名称增加前缀，比如 `transform` 属性

# 服务端通信
Vue.js 本身没有提供与服务器通信接口，通过插件形式实现 Ajax 技术的服务端通信。

## connect-mock-middleware 工具使用
connect-mock-middleware 是一个非常方便、实用的 mock 模拟工具。支持 mockJs 语法，支持 json、jsonp，修改 mock 数据时不需要重新加载

在 config 的 index 文件中添加代理
```js
proxyTable: {
    '/api': {
        target: 'http://127.0.0.1: 3721',
        changeOrigin: true,
        secure: false
    }
}
```

## Mock.js 语法
Mock.js 时一个模拟数据生成器，可以使用前端独立于后端开发。语法规范包括两部分:
- 数据模板定义规范(DTD)
  - 每个属性由 3 部分构成： 属性名、生成规则、属性值 `'name|rule': value`
- 数据占位符定义规范(DPD): 只在属性中占个位置，并不出现在最终的属性值中

## snail mock 工具使用
snail mock 工具能够模拟服务器功能，生成接口 url服务地址供调用,其中依赖了 connect-mock-middleware 
```
cnpm install -g snail-cline
```
开启 mock 服务 `snail mock`

## Axios 安装及配置
Axios 基于 promise、用于浏览器和 node.js 的 HTTP 客户端，常用于处理 Ajax 请求。
```
cnpm install axios --save
```
- `axios.get('/user?ID=1234')` 发起 get 请求
- `axios.post('/user', params)` 发起 post 请求

请求设置
- url 请求服务器链接
- method 请求方法
- baseURL 请求的基本地址
- transformRequest 请求前转化数据,只适用于 put、get、patch
- transformResponse 提前处理返回的数据
- headers 自定义请求头
- params 请求连接中的请求暗示，必须是一个纯对象或者 URLSearchParams 对象
- paramsSerializer 可选函数，用来序列化参数
- data 请求主体需要设置的数据
- timeout 请求超时时间，单位毫秒

拦截器: 可以在请求或返回结果被 then 或者 catch 处理之前对它们进行拦截。
```js
axios.interceptors.request.use(function(config) {
    return config;
}, function(error) {
    // 当请求出错时返回
    return Promise.reject(error);
})
```
# Vue.js 指令
- v-if 条件渲染指令是根据表达式的真假来插入和删除元素的。 `v-fi='表达式'` 根据表达式结果的真假来确定是否显示当前元素，如果表达式为 true，则显示元素，为 false 则不显示。
- v-else 必须紧跟 v-if 元素后面,否则不能识别
- v-show 用法与 v-if 指令基本一致，区别时 v-show 指令通过改变元素的 css 属性 display 来控制显示与隐藏。无论条件是否为真，都会被编译，其内部通过 CSS 属性的 display 来控制显示或者隐藏
- v-for 基于一个数组来渲染一个列表
  - key 属性: 便于 Vue 实例跟踪每个节点的身份，从而重用和重新排序实现元素，key值要唯一。

## 方法与事件
- v-on 为 HTML 元素绑定监听事件,类似原生 Js 的 onclick, `v-on:事件名词='函数名词()'`

  修饰符:
  - .stop: 调用 `event.stopPropagation()`
  - .prevent: 调用 `event.preventDefault()`
  - .self: 当事件从侦听器绑定的元素本身触发时才触发回调
  - .{keycode}: 只在指定键上触发回调。如 Esc: 27、 Tab: 9、Enter: 13
- v-model与表单：用在表单类元素上双向绑定数据
  - `v-model=变量` Vue 实例中 data 与其渲染的 DOM 元素上的内容保持一致，两者无论谁改变，另一方也相应地更新相同的数据。

  修饰符：
  - lazy 转变为在 change 事件中同步
  - trim 自动过滤首位空格、密码输入框不要使用
# 组件详解
# 计算属性和侦听器
# 插件的使用
# 项目总结