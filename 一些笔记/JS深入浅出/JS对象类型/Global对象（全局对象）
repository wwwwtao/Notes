<! --------------  Global对象（全局对象） ------------------------>  
关于全局对象：全局对象只是一个对象，而不是类。既没有构造函数，也无法实例化一个新的全局对象。

属性

Infinity
代表正的无穷大的数值。
Infinity代表了超出JavaScript处理范围的数值。也就是说JS无法处理的数值都是Infinity。实践证明，JS所能处理的最大值是1.7976931348623157e+308，而最小值是5e-324。

NaN
代表非数字的值。
提示：请使用 isNaN() 方法来判断一个值是否是数字，原因是 NaN 与所有值都不相等，包括它自己。

Undefined
代表未定义的值。

提示：判断一个变量是否未定义，只能用 === undefined 运算来测试，因为 == 运算符会认为 undefined 值等价于 null，即undefined == null会返回true。

注释：null 表示无值，而 undefined 表示一个未声明的变量，或已声明但没有赋值的变量，或一个并不存在的对象属性。

方法

1、encodeURI(URIString)

功能：将字符串作为URI进行编码，返回值为URIstring 的副本。

参数：URIString(必须)：一个待编码的字符串。

该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - _ . ! ~ * ' ( ) 。
该方法的目的是对 URI 进行完整的编码，因此对以下在 URI 中具有特殊含义的 ASCII 标点符号，encodeURI() 函数是不会进行转义的：;/?:@&=+$,#
提示：如果 URI 组件中含有分隔符，比如 ? 和 #，则应当使用 encodeURIComponent() 方法分别对各组件进行编码。

2、encodeURIComponent(URIString)

功能：将字符串作为URI组件进行编码，返回值为URIstring的副本。

参数：URIString(必须)：一个待编码的字符串。

该方法不会对 ASCII 字母和数字进行编码，也不会对这些 ASCII 标点符号进行编码： - _ . ! ~ * ' ( ) 。
其他字符（比如 ：;/?:@&=+$,# 这些用于分隔 URI 组件的标点符号），都是由一个或多个十六进制的转义序列替换的。

encodeURI和encodeURIComponent的区别：

它们都是编码URL，唯一区别就是编码的字符范围，
其中encodeURI方法不会对下列字符编码 ASCII字母、数字、~!@#$&*()=:/,;?+'
encodeURIComponent方法不会对下列字符编码 ASCII字母、数字、~!*()'
所以encodeURIComponent比encodeURI编码的范围更大。
实际例子来说，encodeURIComponent会把 http:// 编码成 http%3A%2F%2F 而encodeURI却不会。

当你需要编码整个URL，然后使用这个URL，则使用encodeURI。
当你需要编码URL中的参数时，那么使用encodeURIComponent。
补充：相应的，存在decodeURI()和decodeURIComponent是用来解码的，逆向操作。

3、parseInt(string,radix)

功能：解析一个字符串，并返回一个整数。

参数：

string(必须)：待解析的字符串
radix(可选)：表示要解析的数字的基数。该值介于 2 ~ 36 之间。
如果省略该参数或其值为 0，则数字将以 10 为基础来解析。如果它以 “0x” 或 “0X” 开头，将以 16 为基数。如果该参数小于 2 或者大于 36，则 parseInt() 将返回 NaN。

4、parseFloat()

功能：解析一个字符串，并返回一个浮点数。
该函数指定字符串中的首个字符是否是数字。如果是，则对字符串进行解析，直到到达数字的末端为止。

参数：
string(必须)：待解析的字符串
提示：开头和结尾的空格是允许的。如果字符串的第一个字符不能被转换为数字，那么 parseFloat() 会返回 NaN。如果只想解析数字的整数部分，请使用 parseInt() 方法。

5、isFinite(number)

功能：用于检查其参数是否是无穷大。

参数：

number(必须)：待检测数字。
如果 number 是有限数字（或可转换为有限数字），那么返回 true。否则，如果 number 是 NaN（非数字），或者是正、负无穷大的数，则返回 false。

6、isNaN(number)

功能：用于检查其参数是否为非数字值。

参数：

number(必须)：待检测数字。
如果 number 是非数字值 NaN（或者能被转换成NaN），返回 true，否则返回 false。

7、Number(object)

功能：把对象的值转换为数字。

参数：

object(必须)：待转换的对象。 
如果参数是 Date 对象，Number() 返回从1970年1月1日至今的毫秒数，即时间戳。如果对象的值无法转换为数字，那么 Number() 函数返回 NaN。

8、String(object)

功能：把对象的值转换为字符串。

参数：

object(必须)：待转换的对象。





