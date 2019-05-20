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

    var page = 0;
    var isLoading = false;

    /**
    * 渲染评价按钮
    * @param {}
    */
    function getComment(data) {
        var evaluation = !data.is_comment;

        if (evaluation) {
            return '<div class="evaluation clearfix">' +
                '<div class="evaluation-btn">评价</div>' +
                '</div>'
        }

        return '';
    }


    /*
    * 渲染总计菜品
    * param {}
    */
    function getTotalPrice(data) {
        var str = '<div class="product-item">' +
            '<span>...</span>' +
            '<div class="p-total-count">' +
            '总计' + data.product_count + '个菜，实付' +
            '<span class="total-price">¥' + data.total + '</span>' +
            '</div>' +
            '</div>';
        return str;
    }

    /*
    * 渲染具体商品
    * param {}
    */

    function getProduct(data) {
        var list = data.product_list || [];

        list.push({ type: 'more' });
        console.log(list);
        var str = "";
        list.forEach(function (item) {
            if (item.type === 'more') {
                str += getTotalPrice(data)
            } else {
                str += '<div class="product-item">'
                    + item.product_name +
                    '<div class="p-conunt">x' +
                    +item.product_count +
                    '</div>' +
                    '</div>';
            }
        })
        return str;
    }

    /*
    * 渲染列表
    * param
    */
    var str = "";
    function initContentList(list) {
        list.forEach(function (item, index) {
            var _str = itemTmpl.replace("$poi_pic", item.poi_pic)
                .replace("$poi_name", item.poi_name)
                .replace("$status_description", item.status_description)
                .replace("$getProduct", getProduct(item))
                .replace('$getComment', getComment(item))
            str = str + _str;
        })
        $(".order-list").append($(str));
    }

    /*
    * 请求数据
    * param
    */
    function getList() {
        isLoading = true;
        setTimeout(function () {
            $.get('../json/orders.json', function (data) {
                console.log(data);
                var list = data.data.digestlist || [];

                initContentList(list);
                isLoading = false;
            })
            page++;
        }, 500)
    }

    //事件节流定时器
    var timer = null;
    window.addEventListener("scroll", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            $(".wrap").css("padding-bottom", "1.333333rem")  //因为不是向上滑动事件 所以到底的时候触发不了 除非往上滑 再往下滑 才会继续触发事件
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var clientHeight = document.documentElement.clientHeight || window.innerHeight;
            var scrollHeight = document.documentElement.scrollHeight;

            // 事件提前量
            var preDis = 30;
            if ((scrollTop + clientHeight) >= (scrollHeight - preDis)) {
                //最多加载3页
                if (page < 3) {
                    //是否正在加载中
                    if (isLoading) {
                        return
                    }
                    getList();
                } else {
                    $(".loading").html("加载完成")
                    $(".wrap").css("padding-bottom", "0.333333rem")
                }
            }
        }, 50)

    })

    function init() {
        getList();
    }

    init();

})();