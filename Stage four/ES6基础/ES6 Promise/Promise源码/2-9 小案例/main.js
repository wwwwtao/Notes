// 页面中有个板块 需要多张图片加载完之后才能进行展示

const loadImg = src => {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.src = src;

		img.onload = void resolve(img);
		img.onerror = void reject('加载失败');
	});
};

const imgs = [
	'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1526734981&di=fe12efe9e3a76bd3bb5ac202a3c76823&imgtype=jpg&er=1&src=http%3A%2F%2Fd15.lxyes.com%2F15xm%2Fact%2F20151105%2F20%2F99112408.jpg',
	'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1252816855,3131381110&fm=27&gp=0.jpg',
	'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1906477750,651116720&fm=27&gp=0.jpg'
];

Promise.all(imgs.map(src => loadImg(src))).then(arr => {
	console.log(arr);
});
