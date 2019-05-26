// 多态

// 同一个接口 在不同情况下做不一样的事情
// 相同的接口 不同的表现

// 接口本身只是一组定义 实现都是在类里面
// 需要子类去实现的方法

class Human {
	say() {
		console.log('我是人');
	}
}

class Man extends Human {
	say() {
		super.say();
		console.log('我是小哥哥');
	}
}

class Woman extends Human {
	say() {
		super.say();
		console.log('我是小姐姐');
	}
}

new Man().say();

new Woman().say();

// 重载

class SimpleCalc {
	addCalc(...args) {
		if (args.length === 0) {
			return this.zero();
		}

		if (args.length === 1) {
			return this.onlyOneArgument(args);
		}

		return this.add(args);
	}

	zero() {
		return 0;
	}

	onlyOneArgument() {
		return args[0];
	}

	add(args) {
		return args.reduce((a, b) => a + b, 0);
	}
}

function post(url, header, params) {
	if (!params) {
		params = header;
		header = null; // undefined
	}
}

post('https://imooc.com', {
	a: 1,
	b: 2
});

