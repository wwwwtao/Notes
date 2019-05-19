(function () {

    // 商家详情模板字符串
    var itemTmpl = '<div class="r-item-content">' +
        '<img class="item-img" src=$pic_url />' +
        '$brand' +
        '<div class="item-info-content">' +
        '<p class="item-title">$name</p>' +
        '<div class="item-desc clearfix">' +
        '<div class="item-score">$wm_poi_score</div>' +
        '<div class="item-count">月售$monthNum</div>' +
        '<div class="item-distance">&nbsp;$distance</div>' +
        '<div class="item-time">$mt_delivery_time&nbsp;|</div>' +
        '</div>' +
        '<div class="item-price">' +
        '<div class="item-pre-price">$min_price_tip</div>' +
        '</div>' +
        '<div class="item-others">' +
        '$others' +
        '</div>' +
        '</div>' +
        '</div>';

    // 页码
    var page = 0;
    // 是否在加载中
    var isLoading = false;

    /** 
     *  获取商家列表数据
     * param
     */
    function getList() {
        isLoading = true;
        setTimeout(() => {
            $.get('../json/homelist.json', function (data) {
                console.log(data);
                var list = data.data.poilist || [];

                initContentList(list);
                isLoading = false;
            })
            page++;
        }, 1000);
    }

    /**
     *  获取是否是品牌商家 新到商家
     * param {} data
     */
    function getBrand(data) {
        if (data.brand_type) {
            return '<div class="brand brand-pin">品牌</div>'
        } else {
            return '<div class="brand brand-xin">新到</div>'
        }
    }

    /**
     *  获取月销数量
     * param {} data
     */
    function getMonthNum(data) {
        var num = data.month_sale_num;
        if (num > 999) {
            return "999+";
        }
        return num;
    }
    /**
     *  渲染商家活动
     * param {} data
     */
    function getOthers(data) {
        var Array = data.discounts2;

        var str = "";

        Array.forEach(function (item, index) {

            var _str = '<div class="other-info">' +
                '<img src=$icon_url  class="other-tag" />' +
                '<p class="other-content">$info</p>' +
                '</div>';

            _str = _str.replace("$icon_url", item.icon_url)
                .replace("$info", item.info)

            str += _str;
        })
        return str;
    }

    /**
     *  渲染商家列表数据
     * param []
     */
    function initContentList(list) {
        list.forEach(function (item, index) {
            var str = itemTmpl
                .replace("$pic_url", item.pic_url)
                .replace("$name", item.name)
                .replace("$distance", item.distance)
                .replace("$min_price_tip", item.min_price_tip)
                .replace("$mt_delivery_time", item.mt_delivery_time)

                .replace("$brand", getBrand(item))
                .replace("$monthNum", getMonthNum(item))
                .replace("$others", getOthers(item))
                .replace("$wm_poi_score", new StarScore(item.wm_poi_score).getStars())

            $(".list-wrap").append($(str));
        })
    }

    //事件节流定时器
    var timer = null;
    window.addEventListener("scroll", function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            var clientHeight = document.documentElement.clientHeight || window.innerHeight;
            var scrollHeight = document.documentElement.scrollHeight;

            // 事件提前量
            var paoDis = 30;
            if ((scrollTop + clientHeight) >= (scrollHeight - 30)) {
                //最多加载3页
                if (page < 3) {
                    //是否正在加载中
                    if (isLoading) {
                        return
                    }
                    getList();
                } else {
                    $(".loading").html("加载完成")
                }
            }
        }, 100)

    })



    function init() {
        getList();
    }

    init();
})();