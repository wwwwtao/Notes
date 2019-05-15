
$(function () {
    // 1.1 获取窗口宽度
    $(window).on("resize", function () {
        let c = $(window).width();
        // console.log(c);
        
        //1.2设置临界值 
        let i = c>= 800;
        
        //1.3获取所有item (放图片的盒子)
        let $a = $("#lk_carousel .item");
        // console.log($a);
        
        //1.4循环遍历设置盒子里的图片
        $a.each(function(index,item){
            //1.4.1取出图片位置字符 
            let src = i ? $(item).data("lg-img") : $(item).data("sm-img");
            // console.log(src);
            if(i){
                $(item).empty();
                let imgurl ='url("' + src + '")';
                //1.4.2设置背景
                $(item).css({
                    backgroundImage: imgurl 
                });
            }else{
                let $img="<img src='"+src+"'>";
                $(item).empty().append($img);
            }
            
        });
    });
    
    
    //2.工具提示
    $('[data-toggle="tooltip"]').tooltip();
    
    //3.产品特色滚动条 动态处理宽度
    $(window).on("resize", function () {
        let $ul=$("#lk_product .nav");
        let $alllis=$('[role="presentation"]',$ul);

        // console.log($alllis);
    
    
        // 3.1遍历li拿到每个li的宽度相加
        let totalW = 0 ;
        $alllis.each(function (index , item){
            totalW += $(item).width();
        });

        // console.log(totalW);
        
        let parentW = $ul.parent().width();
        // 3.2设置宽度 
        if(totalW > parentW){
            $ul.css({
                width: totalW+"px"
            })
        }else{
            $ul.removeAttr("style");
        }
    });
    

    // 导航处理

    let all = $("#lk-nav li");
    
    $(all[2]).on("click",function () { 
        $("html,body").animate({ scrollTop: $("#lk_hot").offset().top } , 1000);
    });


    $(window).trigger("resize"); 
});

