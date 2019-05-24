// 部分新方法

// padStart padEnd

{
	let str = 'i';

	let str1 = str.padStart(5, 'mooc');
	console.log(str1);

	let str2 = str.padEnd(5, 'mooc');
	console.log(str2);
}

// repeat
{
	   

	function repeat(str, num) {
		return new Array(num + 1).join(str);
	}
	console.log(repeat('s', 3));
}

// startsWith endsWith
{
	const str = 'A promise is a promsie';

	console.log(str.startsWith('B'));
	console.log(str.startsWith('A pro'));

	console.log(str.endsWith('promsie'));
	console.log(str.endsWith('A'));
}

// includes
{
	const str = 'A promise is a promise';

	// if (str.indexOf('promise') !== -1) {
	if (~str.indexOf('promise')) {
		console.log('存在1');
	}

	if (str.includes('a promise')) {
		console.log('存在2');
	}
}
