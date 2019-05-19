(function () {

    // 订单卡片模板
    var itemTmpl =
        '<div class="order-item">' +
        '<div class="order-item-inner">' +
        '<img class="item-img" src="$poi_pic"></img>' +
        '<div class=""item-right>' +
        '<div class="item-top">' +
        '<p class="order-name one-line">$poi_name</p>' +
        '<div class="arrow"></div>' +
        '<div class="order-state">$status_description</div>' +
        '</div>' +
        '<div class="item-bottom">$getProduct</div>' +
        '</div>' +
        '</div>' +
        '$getComment' +
        ' </div>';


    /*
    * 请求数据渲染
    * param
    */
    function getList() {
        $.get('../json/orders.json',function(data){
            console.log(data);
        })
    }

    function init() {
        getList();
    }

    init();

})();