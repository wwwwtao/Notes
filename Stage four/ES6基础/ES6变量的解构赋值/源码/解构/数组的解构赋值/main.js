// 数组的解构赋值

// const arr = [1, 2, 3, 4];
// let [a, b, c, d] = arr;

// ------------------------------------------

// 更复杂的匹配规则

// const arr = ['a', 'b', ['c', 'd', ['e', 'f', 'g']]];

// const [ , b] = arr;
// const [ , , g] = ['e', 'f', 'g']
// const [ , , [ , , g]] = ['c', 'd', ['e', 'f', 'g']];
// const [ , , [ , , [ , , g]]] = arr;

// ------------------------------------------

// 扩展运算符  ...

// const arr1 = [1, 2, 3];
// const arr2 = ['a', 'b'];
// const arr3 = ['zz', 1];
// const arr4 = [...arr1, ...arr2, ...arr3];

// const arr = [1, 2, 3, 4, 5, 6];
// const [a, b, ...c] = arr;

// ------------------------------------------

// 默认值

// const arr = [1, null, undefined];
// const [a, b = 2, c, d = 'aaa'] = arr;

// ------------------------------------------

// 交换变量

// let a = 20;
// let b = 10;

// let temp;

// temp = a;
// a = b;
// b = temp;

// [a, b] = [b, a];

// ------------------------------------------

// 接收多个 函数返回值

// function getUserInfo(id) {
//   // .. ajax

//   return [
//     true,
//     {
//       name: '小明',
//       gender: '女',
//       id: id
//     },
//     '请求成功'
//   ];
// };

// const [status, data, msg] = getUserInfo(123);
