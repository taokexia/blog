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
# 路由配置
# 初识 Vue.js
# 服务端通信
# Vue.js 指令
# 组件详解
# 计算属性和侦听器
# 插件的使用
# 项目总结