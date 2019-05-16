(function () {

    //类目的模板字符串
    var itemTmpl = '<div class="category-item" >' +
                        '<img class="item-icon" src=$url />' +
                        '<p class="item-name">$name</p>' +
                    '</div>';

    /**
     *  渲染category元素
     * param (参数的意思 这里指不需要参数)
     */
    function initCategory() {
        // 获取category的数据
        $.get('../json/head.json', function (data) {
            // console.log(data);
            // 获取到的数据 前8个
            var list = data.data.primary_filter.splice(0,8);
            // 待填充的数据盒子们
            var items = "";

            list.forEach(function(item,index){
                // 把数据替换进模板
                var str = itemTmpl.replace("$url",item.url).replace("$name",item.name);
                // 把所有数据盒子填充进来
                items += str;
            })
            // 全部append到页面上去
            $(".category-content").append(items);
        })
    }

    /**
     *  绑定item的click事件
     * param (参数的意思 这里指不需要参数)
     */
    function addClick() {
        // 用on委托给父元素 item的点击事件 
        $(".category-content").on("click",".category-item",function(){
            alert($(this).index());
        })
    }

    function init() {
        initCategory();
        addClick();
    }

    init();

})();

