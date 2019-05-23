// 对象的解构赋值

// const obj = {
// 	saber: '阿尔托利亚',
// 	archer: '卫宫'
// };
// const { saber, archer1 } = obj;

// ------------------------------------------

// 稍微复杂的解构条件

// const player = {
// 	nickname: '感情的戏∫我没演技∆',
// 	master: '东海龙王',
// 	skill: [{
// 		skillName: '龙吟',
// 		mp: '100',
// 		time: 6000
// 	},{
// 		skillName: '龙卷雨击',
// 		mp: '400',
// 		time: 3000
// 	},{
// 		skillName: '龙腾',
// 		mp: '900',
// 		time: 60000
// 	}]
// };

// const { nickname } = player;
// const { master } = player;
// const { skill: [ skill1, { skillName }, { skillName: sklName } ] } = player;

// const { skill } = player;
// const [ skill1 ] = skill;


// ------------------------------------------

// 结合扩展运算符

const obj = {
	saber: '阿尔托利亚',
	archer: '卫宫',
	lancer: '瑟坦达'
};

const { saber, ...oth } = obj;
// const obj1 = {
// 	archer: '卫宫',
// 	lancer: '瑟坦达'
// }

// const obj = {
// 	saber: '阿尔托利亚',
// 	...obj1,
// };

// ------------------------------------------

// 如何对已经申明了的变量进行对象的解构赋值

// let age;
// const obj = {
// 	name: '小明',
// 	age: 22
// };

// ({ age } = obj);

// ------------------------------------------

// 默认值

// let girlfriend = {
// 	name: '小红',
// 	age: undefined,
// };

// let { name, age = 24, hobby = ['学习'] } = girlfriend;

// ------------------------------------------
// ------------------------------------------

// 提取对象属性

// const { name, hobby: [ hobby1 ], hobby } = {
// 	name: '小红',
// 	hobby: ['学习']
// };

// ------------------------------------------

// 使用对象传入乱序的函数参数

// function AJAX({
// 	url,
// 	data,
// 	type = 'get'
// }) {
// 	// var type = option.type || 'get';

// 	// console.log(option);
// 	console.log(type);
// };

// AJAX({
// 	data: {
// 		a: 1
// 	},
// 	url: '/getinfo',
// });

// ------------------------------------------

// 获取多个 函数返回值

// function getUserInfo(uid) {
// 	// ...ajax

// 	return {
// 		status: true,
// 		data: {
// 			name: '小红'
// 		},
// 		msg: '请求成功'
// 	};
// };

// const { status, data, msg: message } = getUserInfo(123);

// ------------------------------------------


