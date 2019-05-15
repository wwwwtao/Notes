<?php
//php中需要返回xml数据 执行结果有中文 都必须在顶部设置下面这条代码
header("content-type:text/xml; charset=utf-8");
echo file_get_contents("info.xml");
