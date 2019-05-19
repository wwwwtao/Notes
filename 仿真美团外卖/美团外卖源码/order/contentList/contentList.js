(function(){

    // 订单卡片模版
    var itemTmpl = '<div class="order-item">'+
                        '<div class="order-item-inner">'+
                            '<img class="item-img" src=$poi_pic />'+
                            '<div class="item-right">'+
                                '<div class="item-top">'+
                                    '<p class="order-name one-line">$poi_name</p>'+
                                    '<div class="arrow"></div>'+
                                    '<div class="order-state">$status_description</div>'+
                                '</div>'+
                                '<div class="item-bottom">$getProduct</div>'+
                            '</div>'+
                        '</div>'+
                        '$getComment'+
                    '</div>';


    /**
    * 渲染评价按钮
    * @param {}
    */
    function getComment(data){
        var evaluation = !data.is_comment;

        if (evaluation) {
            return '<div class="evaluation clearfix">'+
                      '<div class="evaluation-btn">评价</div>'+
                    '</div>'
        }

        return '';
    }
    /**
    * 渲染总计菜品
    * @param {}
    */
    function getTotalPrice(data){
        var str = '<div class="product-item">'+
                      '<span>...</span>'+
                      '<div class="p-total-count">'+
                      '总计'+data.product_count+'个菜，实付'+
                      '<span class="total-price">¥'+data.total+'</span>'+
                      '</div>'+
                  '</div>';
        return str;
    }


    /**
    * 渲染具体商品
    * @param {}
    */
     function getProduct(data){
        var list = data.product_list || [];

        list.push({type:'more'});

        var str = '';
        list.forEach(function(item){

            if (item.type === 'more') {
                str += getTotalPrice(data)
            } else {
                str += '<div class="product-item">'
                            +item.product_name+
                            '<div class="p-conunt">x'+
                                +item.product_count+
                            '</div>'+
                        '</div>';
            }
        })

        return str;

     }

    /**
    * 渲染列表
    * @param []
    */
    function initContentList(list){

        list.forEach(function(item){
            var str = itemTmpl.replace('$poi_pic',item.poi_pic)
                       .replace('$poi_name',item.poi_name)
                       .replace('$status_description',item.status_description)

                       .replace('$getProduct',getProduct(item))

                       .replace('$getComment',getComment(item));



            $('.order-list').append(str);
        });


    }

    var page = 0;
    var isLoading = false;
    /**
    * 请求数据
    * @param 
    */
    function getList(){
        page++;
        isLoading = true;

        $.get('../json/orders.json', function(data){
            setTimeout(function(){
                console.log(data);
                var list = data.data.digestlist || [];

                initContentList(list);
                isLoading = false;
            },1000);
            
        });
    }

    function addEvent(){
        window.addEventListener('scroll', function(){
            var clientHeight = document.documentElement.clientHeight;
            var scrollHeight = document.body.scrollHeight;
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            
            var preDis = 30;
            if (scrollTop + clientHeight >= (scrollHeight -preDis)) {
                
                if (page < 3) {

                    if (isLoading) {
                        return;
                    }

                    getList();
                } else {
                    $('.loading').text('加载完成');
                }
                
            }
        });
    }

    function init(){
        getList();
        addEvent();
    }

    init();

})();


