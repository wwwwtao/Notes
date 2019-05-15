<?php
/*
// 1.定义字典保存商品信息
$products = array("nz"=>array("title"=>"甜美女装", "des"=>"人见人爱,花间花开,甜美系列", "image"=>"images/1.jpg"),
    "bb"=>array("title"=>"奢华驴包", "des"=>"送女友,送情人,送学妹,一送一个准系列", "image"=>"images/2.jpg"),
    "tx"=>array("title"=>"键盘拖鞋", "des"=>"程序员专属拖鞋, 屌丝气息浓郁, 你值得拥有", "image"=>"images/3.jpg"));
// 2.获取前端传递的参数
$name = $_GET["name"];
//echo $name;
// 3.根据前端传入的key,获取对应的字典
$product = $products[$name];
//print_r($product);
// 4.将小字典中的内容取出来返回给前端
echo $product["title"];
echo "|";
echo $product["des"];
echo "|";
echo $product["image"];
*/

/*
header("content-type:text/xml; charset=utf-8");

echo file_get_contents("10-ajax-test.xml");
*/

echo file_get_contents("10-ajax-test.txt");

