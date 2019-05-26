// super

// 1. 作为父类构造函数调用
// 2. 作为对象的方式调用

// 1. 非静态方法中访问super -> 父类原型
// 2. 在静态方法中访问super -> 父类

// 在调用super 父类的this 始终是子类的this

class Human {
	constructor(name, age, sex, hobby) {
		this.name = name;
		this.age = age;
		this.sex = sex;
		this.hobby = hobby;
	}

	desc() {
		const { name, age, sex, hobby } = this;

		console.log(`我叫${ name }, 性别${ sex }, 爱好${ hobby }, 今年${ age }岁`);
	}

	eat() {
		console.log('吧唧吧唧');
	}

	checkThis(_this) {
		console.log(_this === this);
	}
}

Human.total = 899999999;

class FEEngineer extends Human {
	constructor(name, age, sex, hobby, skill, salary) {
		super(name, age, sex, hobby);
		this.skill = skill;
		this.salary = salary;
	}

	say() {
		// console.log(super.checkThis(this));
		console.log(this.skill.join(','));
	}

	static test() {
		console.log(super.total);
	}
}

const feer = new FEEngineer(
	'张四',
	12,
	'女',
	'洗澡',
	['es6', 'vue', 'react', 'webgl'],
	'1k'
);

feer.say();

FEEngineer.test();
