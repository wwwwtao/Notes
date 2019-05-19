(function () {
    var itemTmpl = '<a class="$key btn-item href="#" >' +
        '<div class="tab-icon"></div>' +
        '<div class="btn-name">$text</div>' +
        '</a>';



    function init() {
        var items = [{
            key: "index",
            text: "首页"
        }, {
            key: "order",
            text: "订单"
        }, {
            key: "my",
            text: "我的"
        }];

        var str = "";
        items.forEach(function (item, index) {
            str += itemTmpl.replace("$key", item.key)
                .replace("$text", item.text)
        })
        $(".bottom-bar").append($(str));

        //找到当前页面的url来确定key值
        var arr = window.location.pathname.split('/');
        // console.log(arr); //"/%E4%BB%BF%E7%9C%9F%E7%BE%8E%E5%9B%A2%E5%A4%96%E5%8D%96/index/index.html"
        var page = arr[arr.length - 1].replace('.html', '');

        //将根据key值 设置a元素的active类 选中页面
        $('a.'+page).addClass('active');
    }

    init();

})();

