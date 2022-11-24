## Input常用的正则表达式
```html
<input 
  v-model="fromData.fpNum" 
  @input="fpNumInput" 
/>
```

```js
fpNumInput(e) {
  const o = e.target;
  const inputRule = /^(0+)|[^\d]+/g  //修改inputRule 的值 
  this.$nextTick(function() {
    this.fromData.fpNum = o.value.replace(inputRule , '');
  })
}

// 只能输入数字正整数
const zz2 = new RegExp("^[0-9]*[1-9][0-9]*$");

// 1.只能输入数字
const inputRule = /[^\d]/g	 

// 2.只能输入字母
const inputRule = /[^a-zA-Z]/g		

// 3.只能输入数字和字母
const inputRule =/[\W]/g

// 4.只能输入小写字母
const inputRule =/[^a-z]/g

// 5.只能输入大写字母
const inputRule =/[^A-Z]/g

// 6.只能输入数字和字母和下划线
const inputRule =/[^\w_]/g //下划线也可以改成%

// 7.只能输入中文
const inputRule =/[^\u4E00-\u9FA5]/g

// 8.只能输入数字和小数点
const inputRule =/[^\d.]/g

```


## input控制输入框十位整数位两位小数位，其他字符不让输入

```html
<input type="text" placeholder="请输入金额" v-model="orderMoney" @input="checkInput" />
```

```js
checkInput() {
 this.orderMoney = this.orderDealInputVal(this.orderMoney);
},

// 五位整数位一位小数位，其他字符不让输入
export function orderDealInputValTwo(value) {
  value = (value.toString()).replace(/^0*(0\.|[1-9])/, "$1");
  value = (value.toString()).replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
  value = (value.toString()).replace(/^\./g, ""); //验证第一个字符是数字而不是字符
  value = (value.toString()).replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
  value = (value.toString()).replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  value = (value.toString()).replace(/^(\-)*(\d*)\.(\d).*$/, "$1$2.$3"); //只能输入1个小数
  value =
    value.indexOf(".") > 0 ?
    value.split(".")[0].substring(0, 5) + "." + value.split(".")[1] :
    value.substring(0, 5);
  return value;
}

// 十位整数位两位小数位，其他字符不让输入
export function orderDealInputVal(value) {
	value = value.replace(/^0*(0\.|[1-9])/, "$1");
	value = value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
	value = value.replace(/^\./g, ""); //验证第一个字符是数字而不是字符
	value = value.replace(/\.{1,}/g, "."); //只保留第一个.清除多余的
	value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
	value = value.replace(/^(\-)*(\d*)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
	value =
	  value.indexOf(".") > 0 ?
	  value.split(".")[0].substring(0, 9) + "." + value.split(".")[1] :
	  value.substring(0, 9);
	return value;
}


// 十五位正负数位两位小数位，其他字符不让输入
export const clearNoNum = value => {
  value = value.replace(/[^-\d.]/g, ""); //清除"-","数字"和"."以外的字符
  value = value.replace(/^[.]/, ""); //禁止第一个字符为.
  value = value.replace("-.", ""); //禁止前两个字符为-.
  value = value.replace(/\-{2,}/g, "-"); //只保留第一个-, 清除多余的
  value = value.replace("-", "$##$##$").replace(/\-/g, "").replace("$##$##$", "-");
  value = value.replace(/\.{2,}/g, "."); //只保留第一个., 清除多余的
  value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
  value = value.indexOf(".") > 0 ? value.split(".")[0].substring(0, 15) + "." + value.split(".")[1] : value.substring(0, 15);
  return value;
};

```
