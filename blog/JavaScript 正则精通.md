最近学习了 AST 抽象，在代码解析的过程中广泛使用了正则表达式，由此认识到自己在正则基础方面的薄弱，虽然清楚每个符号所表示的含义，但是当一大串正则符号出现在自己面前时，还是会懵逼一会,无法融汇贯通的掌握正则。

下面是自己整理的正则基础知识和收集到的一些实战训练。希望通过训练和笔记来加深自己对正则表达式的掌握!

# 基础
> 正则表达式（Regular Expression，在代码中常简写为regex、regexp或RE）使用单个字符串来描述、匹配一系列符合某个句法规则的字符串搜索模式。

搜索模式可用于文本搜索和文本替换。

## 创建正则表达式
方式1:
```js
// 语法格式为: /正则表达式主体/修饰符(可选)
// 案例
var patt = /var/i
// var 是正则表达式主体
// i 是修饰符
```
方式2:
```js
// 创建 RegExp 对象
// new RegExp(正则表达式主体[, 修饰符])
// RegExp(正则表达式主体[, 修饰符])
var patt = new RegExp('var', 'i')
```
> 注意: `/var/i` 创键的正则表达式对象和 `new RegExp(var, i)` 创建的对象并不相等。虽然它们匹配规则一样。

指定匹配模式的修饰符有:
|修饰符	    |描述|
|----------|--------------|
|i	        |执行对大小写不敏感的匹配。|
|g	        |执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）。|
|m	        |执行多行匹配。|
|s          |允许 `.` 去匹配多行|
|u          |Unicode; 将模式视为Unicode序列点的序列Unicode;|
|y          |粘性匹配; 仅匹配目标字符串中此正则表达式的`lastIndex`属性指示的索引(并且不尝试从任何后续的索引匹配)。|

## 字符类别（Character Classes）
元字符是正则表达式规定的一个特殊代码

|代码|	说明|
|---|------|
|.	|匹配除换行符以外的任意字符 |
|\w	|匹配字母或数字或下划线或汉字 `[A-Za-z0-9_]`|
|\s	|匹配任意的空白符 `[\f\n\r\t\v​\u00a0]`|
|\d	|匹配数字 `[0-9]`|
|\  |用于转义    |

## 边界（Boundaries）
|代码|	说明|
|---|------|
|\b	|匹配单词的开始或结束 例如:`/\bno/` 匹配 `"at noon"` 中的 `"no"` |
|^	|匹配字符串的开始 |
|$	|匹配字符串的结束 |

## 分组（Grouping）与反向引用（back references）
|字符  |	含义 |
|------|--------|
|`(x)`   |捕获括号。匹配 x 并且捕获匹配项。 `/(foo)/` 匹配且捕获 `"foo bar."` 中的 `"foo"`。被匹配的子字符串可以通过 `元素[n]` 中找到，或 RegExp 对象的属性 `$n` 中找到。会消耗性能，如果需要捕获的数组，可以使用非捕获括号|
|`\n`    | 反向引用（back reference），指向正则表达式中第 n 个括号（从左开始数）中匹配的子字符串。`/apple(,)\sorange\1/` 匹配 `"apple, orange, cherry, peach."` 中的 `"apple,orange,"`(最后的`,`号)|
|`(?:x)`	 | 非捕获括号（non-capturing parentheses）。匹配 x 不会捕获匹配项。匹配项不能够从结果再次访问。(推荐) |

## 重复

|代码/语法	 |说明             |
|-----------|-----------------|
|*	        |重复零次或更多次  |
|+	        |重复一次或更多次  |
|?	        |重复零次或一次    |
|x*?<br>x+? |最小可能匹配,非贪婪模式。`/".*?"/` 匹配 `"foo" "bar"` 中的 `"foo"`|
|{n}	    |重复n次          |
|{n,m}	    |重复n到m次       |

## 断言（Assertions）
|代码/语法	 |说明             |
|-----------|-----------------|
|x(?=y)     |只有当 x 后面紧跟着 y 时，才匹配 x。`/Jack(?=Sprat)/` 只有在 `'Jack'` 后面紧跟着 `'Sprat'` 时|
|x(?!y)     |只有当 x 后面不是紧跟着 y 时，才匹配 x。|

## 实例属性
- `RegExp.prototype.global` 是否开启全局匹配
- `RegExp.prototype.ignoreCase` 是否要忽略字符的大小写。
- `RegExp.prototype.lastIndex` 下次匹配开始的字符串索引位置。
- `RegExp.prototype.multiline` 是否开启多行模式匹配（影响 ^ 和 $ 的行为）。
- `RegExp.prototype.source` 正则对象的源模式文本。
- `RegExp.prototype.sticky` 是否开启粘滞匹配。

## 实例方法
- `RegExp.prototype.exec()` 在目标字符串中执行一次正则匹配操作。
- `RegExp.prototype.test()` 测试当前正则是否能匹配目标字符串。
- `String.prototype.match(pattern)` 根据`pattern`对字符串进行正则匹配,返回匹配结果数组,如匹配不到返回`null`
- `String.prototype.replace(pattern, replacement)` 根据`pattern`进行正则匹配,把匹配结果替换为`replacement`, 返回一个新的字符串

# 实战
## 改变文本结构
```js
var re = /(\w+)\s(\w+)/
// \w 匹配 [A-Za-z0-9_]
// + 重复一次或更多次
// \s 匹配 空格符
// () 捕获括号
var str = "John Smith"
var newstr = str.replace(re, "$2, $1")
// $1: 捕获的值为 John 
// $2: 捕获的值为 Smith
console.log(newstr) //  转换后为 "Smith, John"
```
训练1: 请通过正则表达式，把 `() => 1+1` 修改为 `function () { return 1+1 }`


## 多行匹配
```js
var s = "Please yes\nmake my day!";
s.match(/yes.*day/);
// . 符号默认不匹配 \n
// 可以改为 /yes.*day/s ,使用 s 标识符来匹配多行
// 返回 null

s.match(/yes[^]*day/);
// ^ 匹配字符串的开始
// [^]* 表示匹配任何字符，包括换行符
// 返回 yes\nmake my day
```
训练2: 请通过正则表达式，获取到 `ab a\nb ab` 中的 `a\nb` 字符串

## 使用带有 ”sticky“ 标志的正则表达式
```js
var text = "First line\nsecond line";
var regex = /(\S+) line\n?/y;
// () 捕获括号
// \S+ 匹配一次或更多次非空白符
// \n? 匹配零到一次换行符
var match = regex.exec(text);
console.log(match[1]);  // 匹配到 First
// 输入 match[0] 返回的是 First line\n 所要进行匹配的文本
console.log(regex.lastIndex); // 匹配到位置 11
var match2 = regex.exec(text);
console.log(match2[1]); // 匹配到 Second
console.log(regex.lastIndex); // 匹配到位置 22

var match3 = regex.exec(text);
console.log(match3 === null); // 返回 true, 没有匹配到结果
```
训练3: 有文本`"price: 10￥\nprice: 20￥\nprice: 30￥`, 请获取到 price 的值，保存到数组中,结果输出为 `['10', '20', '30']`

## 匹配链接
提取链接传递参数的值
```js
// 提取 str 的 name 和 age
var str = 'https://www.baidu.com?name=jawil&age=23'
// 获取name的值
var regName = /\?name=([^&]*)/
// \? 表示匹配 ? 字符,从该字符开始匹配
// name= 表示匹配 name= 的字符串
// [^&]* 表示匹配字符直到遇到 & 符号为止
// ([^&]*) 表示捕获匹配到的结果
// match 的值为 ["?name=jawil", "jawil"]
var match = regName.exec(str)
console.log(match[1]) // 返回 jawil
```
训练4: 请修改正则表达式，获得到 age 的属性值, 该正则表达式是怎么样的?

## 数字格式化
把 1234567890 格式化为 1,234,567,890
```js
var str = '1234567890'
var reg = /\B(?=(\d{3})+(?!\d))/g
// \b 匹配单词的开始或结束
// \B 匹配单词的非开始和非结束的位置
//     \Bon 匹配 ' on' 为 null,即开头不能为 on
//     \Bon 匹配 ' onon' 为 on,匹配后一个 on
// (\d{3}+) 捕获1个或多个的3个连续数字
// (?!\d) 断言: 表示3个数字不允许后面跟着数字
// (\d{3}+)+(?!\d) 表示匹配的后边界跟着 3*n(n>=1)的数字.
// (?=) 断言: 表示后边必须跟着的内容
//     \B(?=(\d{3}+)+(?!\d)) 匹配非边界后跟着的3个数字

// 运行过程
// 第一次匹配到为 ["", "890"] 没有匹配到文本，但捕获到3个数字
// 替换后为 1234567,890
// 第二次匹配到为 ["", "567"]
// 替换后为 1234,567,890
// 第三次匹配到为 ["", "234"]
// 替换后为 1,234,567,890
// 最后一次运行结果为 null 替换结束
var format = str.replace(reg, ',')
console.log(format) // 1,234,567,890
```
训练5: 通过正则表达式把字符串'255255255255' 格式化为 ip地址格式 '255.255.255.255'

训练6: 编写正则表达式测试传入的ip地址是否正确,例如传入 `1.1.1.1` 返回 true, 传入 `1.1.1.257` 返回 false

# 答案
训练1: 
```js
var str = '() => 1+1'
var reg = /(\(\))\s(=>)\s([^]*)/
var str1 = str.replace(reg, 'function $1 { return $3 }')
```

训练2:
```js
var s = "ab a\nb ab"
s.match(/a\nb/)
```

训练3:
```js
var str = 'price: 10￥\nprice: 20￥\nprice: 30￥'
var reg = /\D*(\d+)/y
var a = []
while((match = reg.exec(str)) !== null) {
  a.push(match[1])
}
console.log(a)
```

训练4:
```js
var str = 'https://www.baidu.com?name=jawil&age=23'
var regAge = /\&age=([^&]*)/
var match = regAge.exec(str)
```

训练5:
```js
var pattern = /\B(?=(\d{3})+(?!\d))/g
var str = '255255255255'
str.replace(pattern, '.')
```

训练6:
- 首先要匹配的是 0 ~ 255
- 匹配 50 ~ 55: `5[0-5]{1}`
- 匹配 0 ~ 49:  `[0-4]\d{1}`
- 匹配 200 ~ 255: `2(5[0-5]{1}|[0-4]\d{1})`
- 匹配 0 ~ 199: `[0-1]?\d{1,2}`
- 完整匹配 0 ~ 255:
  - `(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})`

组合成检测的ip 的正则表达式
```js
var reg1 = /(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})/
// 把后边3段检测代码进行简化后
var reg2 = /(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})(\.(2(5[0-5]{1}|[0-4]\d{1})|[0-1]?\d{1,2})){3}/
```

# 参考资料
- [MDN web docs: RegExp](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
- [JavaScript正则进阶之路——活学妙用奇淫正则表达式](https://github.com/jawil/blog/issues/20)
- [正则表达式 - 匹配 IP 地址](https://www.jianshu.com/p/82886d77440c)