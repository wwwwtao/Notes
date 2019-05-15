

// var option = document.getElementById("header-nav-option");
// option.addEventListener("click",function(){

// })

// 开始写Zepto 
$(function () {
    $("#header-nav-box").on("click", function () {
        if ($(".header-nav").hasClass("nav-container-extended")) {
            $(".header-nav").removeClass("nav-container-extended");
        } else {
            $(".header-nav").addClass("nav-container-extended");
        }
    })
})