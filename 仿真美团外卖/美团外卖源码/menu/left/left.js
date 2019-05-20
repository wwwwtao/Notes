(function(){

    // 左侧类目item模版字符串
    var itemTmpl = '<div class="left-item">'+
                       '<div class="item-text">$getItemContent'+
                    '</div>';




    /**
     * 请求数据
     * param 
     */
    function getList(){
        $.get('../json/food.json', function(data){
            console.log(data);
            window.food_spu_tags = data.data.food_spu_tags || [];
            initContentList(window.food_spu_tags);


            window.ShopBar.changeShippingPrice(data.data.poi_info.shipping_fee || 0);
        })
    }

    /**
     * 渲染item内容
     * param obj
     */
    function getItemContent(data){
        if (data.icon) {
            return '<img class="item-icon" src='+data.icon+' />'+data.name;
        } else {
            return data.name;
        }
    }


    /**
     * 渲染列表
     * param array
     */
    function initContentList(list){
        list.forEach(function(item, index){
            var str = itemTmpl.
                      replace('$getItemContent', getItemContent(item));

            // 将item数据挂载到left-item上面
            var $target = $(str);
            $target.data('itemData',item);

            $('.left-bar-inner').append($target);
        })

        $('.left-item').first().click();
    }


    function addClick(){
        $('.menu-inner').on('click', '.left-item', function(e){
            var $target = $(e.currentTarget);

            $target.addClass('active');
            $target.siblings().removeClass('active');

            // 将数据传给右侧详情列表进行渲染
            window.Right.refresh($target.data('itemData'));
            
        });
    }


    function init(){
        getList();
        addClick();
    }


    init();


})();


