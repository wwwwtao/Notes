// 模版字符串
// 'asdffdsa'
// "asdfasdf"

// `asdfasdffsa`

// const xiaoming = {
// 	name: 'xiaoming',
// 	age: 14,
// 	say1: function() {
// 		console.log('我叫' + this.name.toUpperCase() + ', 我今年' + this.age + '岁!');
// 	},
// 	say2: function() {
// 		console.log(`我叫${ `Mr.${ this.name.toUpperCase() }` }, 我今年${ this.age }岁!`);
// 	}
// }

// xiaoming.say1();
// xiaoming.say2();






const getImoocCourseList = function() {
	// ajax
	return {
		status: true,
		msg: '获取成功',
		data: [{
			id: 1,
			title: 'Vue 入门',
			date: 'xxxx-01-09'
		}, {
			id: 2,
			title: 'ES6 入门',
			date: 'xxxx-01-10'
		}, {
			id: 3,
			title: 'React入门',
			date: 'xxxx-01-11'
		}]
	}
};

const { data: listData, status, msg } = getImoocCourseList();

function foo(val) {
    return val.replace('xxxx', 'xoxo');
}

if (status) {
    let arr = [];

    listData.forEach(function({ date, title }) {

        // arr.push(
        // 	'<li>\
        // 		<span>' + title + '</span>' +
        // 		'<span>' + date + '</span>' +
        // 	'</li>'
        // );

        arr.push(
            `
				<li>
					<span>${ `课程名: ${ title }` }</span>
					<span>${ foo(date) }</span>
				</li>
			`
        );

    });

    let ul = document.createElement('ul');
    ul.innerHTML = arr.join('');

    document.body.appendChild(ul);

} else {
    alert(msg);
}