(function(){

    // 商家详情模版字符串
    var itemTmpl = '<div class="r-item-content">'+
                        '<img class="item-img" src=$pic_url />'+
                        '$brand'+
                        '<div class="item-info-content">'+
                            '<p class="item-title">$name</p>'+
                            '<div class="item-desc clearfix">'+
                                '<div class="item-score">$wm_poi_score</div>'+
                                '<div class="item-count">月售$monthNum</div>'+
                                '<div class="item-distance">&nbsp;$distance</div>'+
                                '<div class="item-time">$mt_delivery_time&nbsp;|</div>'+
                            '</div>'+
                            '<div class="item-price">'+
                                '<div class="item-pre-price">$min_price_tip</div>'+
                            '</div>'+
                            '<div class="item-others">'+
                                '$others'+
                            '</div>'+
                        '</div>'+
                    '</div>';

    var page = 0;
    var isLoading = false;
    /** 
    *  获取商家列表数据
    *  param 
    */
    function getList(){
        page++;
        isLoading = true;
        $.get('../json/homelist.json', function(data){

            console.log(data);
            var list = data.data.poilist || [];

            initContentList(list);
            isLoading = false;
            
        });
    }

    /** 
    *  渲染是否时新到热门品牌标签
    *  param {} data
    */
    function getBrand(data){
        if (data.brand_type) {
            return '<div class="brand brand-pin">品牌</div>';
        } else {
            return '<div class="brand brand-xin">新到</div>';
        }
    }

    /** 
    *  渲染月售
    *  param {} data
    */
    function getMonthNum(data){
        var num = data.month_sale_num;

        // 大于999采用999+
        if (num > 999) {
            return '999+';
        }

        return num
    }

    /** 
    *  渲染商家活动
    *  param {} data
    */
    function getOthers(data){

        var array = data.discounts2;

        var str = '';

        array.forEach(function(item, index){

            // 内部的商家活动模版字符串
            var _str = '<div class="other-info">'+
                           '<img src=$icon_url class="other-tag" />'+
                           '<p class="other-content one-line">$info</p>'+
                        '</div>';


            // 模版字符串替换数据
            _str = _str.replace('$icon_url',item.icon_url)
                        .replace('$info', item.info);


            // 字符串拼接
            str = str + _str;
        })

        return str;
    }

    /** 
    *  渲染列表数据
    *  param []
    */
    function initContentList(list){
        list.forEach(function(item, index){
            var str = itemTmpl
                      .replace('$pic_url',item.pic_url)
                      .replace('$name',item.name)
                      .replace('$distance',item.distance)
                      .replace('$min_price_tip',item.min_price_tip)
                      .replace('$mt_delivery_time',item.mt_delivery_time)

                      .replace('$brand',getBrand(item))

                      .replace('$monthNum',getMonthNum(item))

                      .replace('$others',getOthers(item))

                      .replace('$wm_poi_score', new StarScore(item.wm_poi_score).getStars())
                      

            $('.list-wrap').append($(str));
        })

    }


    function addEvent(){
        window.addEventListener('scroll',function(){
            var clientHeight = document.documentElement.clientHeight;
            var scrollHeight = document.body.scrollHeight;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

            var proDis = 30;
            if ((scrollTop + clientHeight) >= (scrollHeight-proDis)) {
                

                // 最多滚动加载3页
                if (page < 3) {

                    // 在发送ajax请求时避免触发多次滚动加载
                    if (isLoading) {
                        return;
                    }
                    getList();
                }else {
                    $('.loading').text('加载完成');
                }

                
            }
        });
    }




    function init() {
        getList();
        addEvent();
    }

    init();
})();


