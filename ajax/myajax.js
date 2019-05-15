function obj2str(obj) {
    /*{
        "userName":"wt",
        "userPwd":"123456"
        "t":"26262652651"
    }
    */
    obj.t = new Date().getTime();

    var res = [];
    for (var key in obj) {
        //在url中不能出现中文 用encodeURIComponent转码 只能出现字母/数字/下划线/ascii码
        res.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])) //[userName=wt,userPwd=123456]
    }
    return res.join("&") //userName=wt&userPwd=123456
}

function ajax(url, obj, timeout, success, error) {
    // 0.将对象转换为字符串 
    var str = obj2str(obj);//key=value&key=value

    // 1.创建异步对象
    var xmlhttp;
    if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    }
    else {// code for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    /* open(method,url,async)	
    规定请求的类型、URL 以及是否异步处理请求。*/
    xmlhttp.open("GET", url + "?" + str, true);

    /* send(string)	
    将请求发送到服务器。string：仅用于 POST 请求 */
    xmlhttp.send();

    //监听状态变化
    xmlhttp.onreadystatechange = function (ev1) {
        // 状态码为4
        if (xmlhttp.readyState === 4) {
            clearInterval(timeid);
            // 判断是否请求成功
            if (xmlhttp.status >= 200 && xmlhttp.status < 300 || xmlhttp.status === 304) {
                // 结果返回 --处理
                // console.log("接收到服务器返回的数据")
                success(xmlhttp);
            } else {
                // console.log("没接受到服务器返回的数据")
                error(xmlhttp);
            }
        }
    }   

    //判断外界是否传入了超时时间
    if(timeout){
        var timeid = setInterval(function(){
            console.log("中断请求")
            xmlhttp.abort();
            clearInterval(timeid);
        },timeout)
    }
}