<! --------------  Date类型 ------------------------>

Date对象：封装一个时间点，提供操作时间的API。Date对象中封装的是从1970年1月1日0点至今的毫秒数。

创建Date对象4种方式

var now = new Date(); //获取客户端的当前系统时间
var date - new Date("1994/02/04 03:23:55"); //创建自定义时间
var date = new Date(yyyy, MM, dd, hh, mm, ss); //创建自定义时间

var oldDate = new Date("1994/02/04");
var newDate = new Date(oldDate); //复制一个时间对象

# 日期API
日期分量：FullYear、Month、Date、Day、Hours、Minutes、Seconds、Milliseconds。
每一个日期分量都有一个get和set方法（除了Day没有set方法），分别用于获取和设置时间对象。

# 日期的单位及范围:
年FullYear (无范围)
月Month (0~11, 0开始,没有12)
日Date (1~31, 和现实生活一样)
星期Day (0~6, 0是星期日,没有7)
时Hours (0~23. 0开始，没有24)
分Minutes (0~59)
秒Seconds (0~59)
毫秒MilliSeconds

# 常用的Date对象方法
<!-- Date()  返回当日的日期和时间。
getDate()   从 Date 对象返回一个月中的某一天 (1 ~ 31)。
getDay()    从 Date 对象返回一周中的某一天 (0 ~ 6)。
getMonth()  从 Date 对象返回月份 (0 ~ 11)。
getFullYear()   从 Date 对象以四位数字返回年份。
getYear()   请使用 getFullYear() 方法代替。
getHours()  返回 Date 对象的小时 (0 ~ 23)。
getMinutes()    返回 Date 对象的分钟 (0 ~ 59)。
getSeconds()    返回 Date 对象的秒数 (0 ~ 59)。
getMilliseconds()   返回 Date 对象的毫秒(0 ~ 999)。
getTime()   返回 1970 年 1 月 1 日至今的毫秒数。
getTimezoneOffset() 返回本地时间与格林威治标准时间 (GMT) 的分钟差。
getUTCDate()    根据世界时从 Date 对象返回月中的一天 (1 ~ 31)。
getUTCDay() 根据世界时从 Date 对象返回周中的一天 (0 ~ 6)。
getUTCMonth()   根据世界时从 Date 对象返回月份 (0 ~ 11)。
getUTCFullYear()    根据世界时从 Date 对象返回四位数的年份。
getUTCHours()   根据世界时返回 Date 对象的小时 (0 ~ 23)。
getUTCMinutes() 根据世界时返回 Date 对象的分钟 (0 ~ 59)。
getUTCSeconds() 根据世界时返回 Date 对象的秒钟 (0 ~ 59)。
getUTCMilliseconds()    根据世界时返回 Date 对象的毫秒(0 ~ 999)。
parse() 返回1970年1月1日午夜到指定日期（字符串）的毫秒数。
setDate()   设置 Date 对象中月的某一天 (1 ~ 31)。
setMonth()  设置 Date 对象中月份 (0 ~ 11)。
setFullYear()   设置 Date 对象中的年份（四位数字）。
setYear()   请使用 setFullYear() 方法代替。
setHours()  设置 Date 对象中的小时 (0 ~ 23)。
setMinutes()    设置 Date 对象中的分钟 (0 ~ 59)。
setSeconds()    设置 Date 对象中的秒钟 (0 ~ 59)。
setMilliseconds()   设置 Date 对象中的毫秒 (0 ~ 999)。
setTime()   以毫秒设置 Date 对象。
setUTCDate()    根据世界时设置 Date 对象中月份的一天 (1 ~ 31)。
setUTCMonth()   根据世界时设置 Date 对象中的月份 (0 ~ 11)。
setUTCFullYear()    根据世界时设置 Date 对象中的年份（四位数字）。
setUTCHours()   根据世界时设置 Date 对象中的小时 (0 ~ 23)。
setUTCMinutes() 根据世界时设置 Date 对象中的分钟 (0 ~ 59)。
setUTCSeconds() 根据世界时设置 Date 对象中的秒钟 (0 ~ 59)。
setUTCMilliseconds()    根据世界时设置 Date 对象中的毫秒 (0 ~ 999)。
toSource()  返回该对象的源代码。
toString()  把 Date 对象转换为字符串。
toTimeString()  把 Date 对象的时间部分转换为字符串。
toDateString()  把 Date 对象的日期部分转换为字符串。
toGMTString()   请使用 toUTCString() 方法代替。
toUTCString()   根据世界时，把 Date 对象转换为字符串。
toLocaleString()    根据本地时间格式，把 Date 对象转换为字符串。
toLocaleTimeString()    根据本地时间格式，把 Date 对象的时间部分转换为字符串。
toLocaleDateString()    根据本地时间格式，把 Date 对象的日期部分转换为字符串。
UTC()   根据世界时返回 1970 年 1 月 1 日 到指定日期的毫秒数。
valueOf()   返回 Date 对象的原始值。 -->

# 转换时间 年月日时分
```javascript
	initDate: function (datar,type) {  // type 传1 返回年月日时分 带0
		let month = new Date(datar).getMonth() + 1
		let strDate = new Date(datar).getDate()
		if (month >= 1 && month <= 9) {
		    month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
		    strDate = "0" + strDate;
		}
		if(type == 1){
			let Hours = new Date(datar).getHours();
			let Minutes = new Date(datar).getMinutes();
			if(Hours<10){
				Hours = '0' + Hours
			}
			if(Minutes<10){
				Minutes = '0' + Minutes
			}
			return new Date(datar).getFullYear() + '-' + month + '-' + strDate + ' ' + Hours + ':' + Minutes //年月日时分 带0
		}else{
			return new Date(datar).getFullYear() + '-' + month + '-' + strDate //年月日
		}
  }
```


# Number(object) !!!!

功能：把对象的值转换为数字。

参数：
object(必须)：待转换的对象。

如果参数是 Date 对象，Number() 返回从1970年1月1日至今的毫秒数，即时间戳。如果对象的值无法转换为数字，那么 Number() 函数返回 NaN。

```javascript
date = Number(new Date(date));  //传入一个可转换为Data对象的时间格式 如字符串2019/8/14 12:00:00
                                //可以用Number把Date对象转为时间戳
```
