(function () {
    'use strict';

    setRemUnit();
    window.addEventListener('resize', setRemUnit);
    // 1rem = viewWidth/18.75
    function setRemUnit() {
        var docEI = document.documentElement;
        var ratio = 18.75;
        var viewWidth = docEI.getBoundingClientRect().width || window.innerWidth;
        docEI.style.fontSize = viewWidth / ratio + 'px';
    }
})();
