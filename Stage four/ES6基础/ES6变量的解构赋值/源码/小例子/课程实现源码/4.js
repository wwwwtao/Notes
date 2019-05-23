var demo = document.createElement('div');
// var demo = document.querySelector('div');
demo.style.transition = 'all 1s';
demo.style.background = '#0f0';
demo.style.width = '400px';
demo.style.height = '400px';

document.body.appendChild(demo);
// demo.style.background = '#f0f';

requestAnimationFrame(function() {
	demo.style.background = '#f0f';
});
