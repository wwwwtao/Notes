1.安装big.js

npm install --save big.js
2.页面上引用big.js

const Big = require('big.js')

```js
3.常用操作

加法plus

0.1 + 0.2     // 0.30000000000000004
x = Big(0.1)
y = x.plus(0.2)   // '0.3'
Big(0.7).plus(x).plus(y)   // '1.1'
  减法minus

0.3 - 0.1 // 0.19999999999999998
x = Big(0.3)
x.minus(0.1) // "0.2"
x // “0.3"
  乘法times

0.6 * 3 // 1.7999999999999998
x = Big(0.6)
y = x.times(3) // '1.8'
  除法div

x = Big(2);
y = Big(3);
z = x.div(y) // "0.6666666667"
  绝对值abs

x = Big(-0.8)
x.abs() // ‘0.8'
  模运算mod

1 % 0.9 // 0.09999999999999998
x = Big(1)
x.mod(0.9) // '0.1'
  保留两位小数toFixed

Big(12).toFixed(2) // 12.00
```
————————————————
版权声明：本文为CSDN博主「雨中的风铃子」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qq_38990451/article/details/107402513