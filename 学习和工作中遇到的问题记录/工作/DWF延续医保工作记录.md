# 分工

服务管理
 肖银
 文
吴

# 建模工具

http://dwf.test110.yongxinxue.com/modeler-web

# swagger

http://dwf9090.test110.yongxinxue.com/swagger-ui.html#/

# dwf 文档

http://ise.thss.tsinghua.edu.cn/confluence/#all-updates

# 控件缩写大全

http://m.mamicode.com/info-detail-328345.html

## 图片

<img width="100%" src="https://raw.githubusercontent.com/wwwwtao/Notes/master/学习和工作中遇到的问题记录/工作/images/数据库表图.png">

# 步骤

1. 新建实体类
2. 新建表单实体类 页面
3. 新建表单
4. 按钮添加事件 绑定实体类 表单

```js
//获取表格中所有的的行数据对象集合
var allRowDatas = grdiAddin.getAll();


grid = this.getAddinById("CustomerGrid1")
var defs = [
    {
        headerName: '姓名',
        field: 'name'
    },
    {
        headerName: '性别',
        field: 'gender'
    },
    {
        headerName: '服务地址',
        field: 'serviceAddr'
    }
];
defs.push(grid.getOprColumnDefs())

grid.setColumnDefs(defs);

let param = [];
let param1 = {};
self = this
this.dwf_axios.post(`/omf/entities/${this.className}/objects`,param1).then(res => {
  data = res.data.data
  rowData = []
  for (let i = 0; i < data.length; i++) {
    rowData.push(data[i])
    console.log(data[i].provinceOid)
    this.dwf_axios.post(`/omf/entities/Area/objects/${data[i].provinceOid}`,param).then(res =>{
        console.log("省份")
        console.log(res)
        rowData[i].province = res.data.data.name
        this.dwf_axios.post(`/omf/entities/Area/objects/${data[i].cityOid}`,param).then(res => {
            console.log("城市")
            console.log(res)
            rowData[i].city = res.data.data.name
            this.dwf_axios.post(`/omf/entities/Area/objects/${data[i].districtOid}`,param).then(res => {
                console.log("区县")
                console.log(res)
                rowData[i].district = res.data.data.name
                rowData[i].serviceAddr = rowData[i].province + rowData[i].city + rowData[i].district + rowData[i].address
            })
        })
    })
  }
    setTimeout(function () {
        console.log("rowData")
        console.log(rowData)
    grid.setRowData(rowData);
    }, 3000)
});


```

```js

//获取表格控件
var tableAddin = this.GetAddinById("table1");
var allRowDatas = tableAddin.getAll();
console.log('allRowDatas',allRowDatas)
//搜索框
var searchStrAddin = this.GetAddinById("searchStr");
var searchStr = searchStrAddin.getValue();
//金融等级
var financial = this.GetAddinById("financial");
var financeLevel = financial.getValue();
// 地址
var JoinCascaderTree = this.GetAddinById("JoinCascaderTree");
var JoinCascader = JoinCascaderTree.getValue();
// 预约时间
var timeAppointment = this.GetAddinById("timeAppointment");
var startTime = this.GetAddinById("startTime");
var endTime = this.GetAddinById("endTime");
var timeAppointmentValue = timeAppointment.getValue();
var startTimeValue = startTime.getValue();
var endTimeValue = endTime.getValue();
let query = " ";


// //获取实体类的元模型信息
// this.queryEntity('Customer').then(res => {
//     console.log('Customer',res)
// });

function initDate (datar) {
		let month = new Date(datar).getMonth() + 1
		let strDate = new Date(datar).getDate()
		if (month >= 1 && month <= 9) {
		    month = "0" + month;
		}
		if (strDate >= 0 && strDate <= 9) {
		    strDate = "0" + strDate;
		}
			let Hours = new Date(datar).getHours();
			let Minutes = new Date(datar).getMinutes();
			if(Hours<10){
				Hours = '0' + Hours
			}
			if(Minutes<10){
				Minutes = '0' + Minutes
			}
			return new Date(datar).getFullYear() + '-' + month + '-' + strDate + ' ' + Hours + ':' + Minutes //年月日时分 带0
  }
//quert 语句
if(searchStr !== ''){
    query += `and  obj.orderNo like '%${searchStr}%'`;
}
// if(searchStr !== ''){
//     query += `and ( obj.mobile like '%${searchStr}%' or obj.serviceItemOid like '%${searchStr}%')`;
// }
if(financeLevel){
    query += `and obj.financeLevel like '%${financeLevel}%' `;
}
if(timeAppointmentValue){
    var Time = new Date();
    var sTime = new Date();
    var eTime = new Date();

    if(timeAppointmentValue === '1'){
        sTime.setDate(Time.getDate() + 1);
        eTime.setDate(Time.getDate() + 2);

        sTime = initDate(sTime)
        eTime = initDate(eTime)
    }else if(timeAppointmentValue === '2'){
        sTime.setDate(Time.getDate() + 2);
        eTime.setDate(Time.getDate() + 3);

        sTime = initDate(sTime)
        eTime = initDate(eTime)
    }else if(timeAppointmentValue === '3'){
        sTime = startTimeValue
        eTime = endTimeValue
    }

    if(timeAppointmentValue!== '0'){
     query += `and obj.appointmentTime > '${sTime}' and obj.appointmentTime < '${eTime}'`;
    }
}


console.log(query)

//获取表格中所有的的行数据对象集合
// var allRowDatas = tableAddin.getAll();


//处理表格数据的刷新


// //表格后台数据强制刷新
// this.handleQueryData({query:query,targetClass:"Order",fresh:true}).then(res=>{
//     console.log(res)
//     //后台数据强查后，store会更新,会更新相同查询条件的多对象控件(表格)
//     tableAddin.freshData(query);  //如果store有数据,就不进行后台数据查询,不然就会进行后台数据查询(可以理解为调用freshData后,一定至少发生过一次后台数据查询).这里在handleQueryData之后调用,所以不会进行后台数据查询. 用处是用指定查询的最新结果刷新表格
//     // grdiAddin.fresh(); //不执行后台数据查询,从store中获取原查询条件的最新结果刷新表格. 区别在于: 1. 查询条件为原查询条件,不能指定新的查询条件; 2. 不进行后台数据查询
//     this.msgbox.success("表格已刷新!");
// })


<template>
	<div>
        <Table :columns="columns" :data="rowData" border show-summary></Table>
	</div>
</template>

<script>
 import { Table } from 'iview';
 let _this = window.parent.dwf_ctx;
// //获取表单中的控件取值
// var Test = _this.getAddinById("控件ID");
// var name = Test.getValue();// 该方法可以获取控件的取值
export default {
	components: { Table },
	data() {
		return {
		columns: [
		        {
		            title: '项目名称',
                    children: [
                         {
                        title: '名称',
                        key: 'name'
                        },
                        {
                            title: '数量',
                            key: 'num'
                        },
                        {
                            title: '单价',
                            key: 'price'
                        },
                        {
                            title: '小计',
                            key: 'total'
                        }
                    ]
		        }
            ],
        rowData: []
		}
	},
    mounted() {
        this.getRowData()
    },
	methods: {
    	getRowData(){
            let serviceItemOid = _this.obj().right_oid
            let param = {}
            let rowData = []
            // _this.dwf_axios.get(`part01/app-ext/order/orderOid=${serviceItemOid}`,param).then(res=>{
            _this.dwf_axios.get(`part01/app-ext/order/${serviceItemOid}`,param).then(res=>{
            
            console.log('resresresresresresresresresres',res)
            const data = res.data.data 
            
            // 可能有额外的项目
            // rowData = data.materials.concat(data.extraArray)
            rowData = data.materials
            // 项目名称
            this.columns[0].title = data.serviceItemName
            //总计
            let allTotal = '' 
            
            
            
            rowData.forEach((item,i)=>{
                rowData[i].total = rowData[i].num * rowData[i].price
                allTotal = Number(allTotal) + Number(rowData[i].total)
            })
            this.rowData = rowData
            }
            
            console.log("服务费服务费服务费服务费服务费")
            
            let serviceFee = {
                name:"服务费",
                num:1,
                price:data.serviceFee
                total: data.serviceFee
            }
            this.rowData.push(serviceFee)
            
            let arr = {
                name:"合计",
                num:'',
                price:'',
                total: allTotal + data.serviceFee
            }
            this.rowData.push(arr)
            })
	    }
}
</script>

<style>

@import "../../node_modules/iview/dist/styles/iview.css";

</style>
```

预约单列表表格的金融等级 👌

费用的表格 👌

服务流程记录 👌

表格直接 改派  添加了查询条件报错   



```js
/**
 * 该插件为显示地图的插件，动态加载
 */
function setMapUnion(deptId) {
    /**
     * ajax获取联通事业部的所有项目组的销售额
     */
    var o1 = $("#acctmonth").val();
    var o2 = $("#maxMonth").val();
    var parData = {
        acctmonth : o1,
        maxMonth : o2,
        deptId : deptId
    };
    var par = JSON.stringify(parData);
    /**
     * @author Administrator
     * @params:参数设置：为地图各省份提供数据.
     */
    var provic;
    var toCash;
    $.ajax({
        url : "CompanyFeeBusinessNew!setMapUnion.action",
        data : {
            par : par
        },
        cache : true,
        async : false,
        type : "post",
        success : function(result) {
            provic = result.provic;
            toCash = result.toCash;
        }
    });
    // ----------参数的转换
    var text = null;
    if (deptId == '5271') {
        text = '联通事业部分分省份项目组销售额';
    } else if (deptId == '7658') {
        text = '电信事业部分分省份项目组销售额';
    } else {
        text = '移动事业部分分省份项目组销售额';
    }
    $("#map").css('width', $("#map").width());
    require.config({
        paths : {
            echarts : '/pure/resources/echarts'
        }
    });
    require([ 'echarts', 'echarts/chart/map' ], function DrawEchart(ec) {
        var myChart = ec.init(document.getElementById("map"));
        mapParams = {
            title : {
                text : text,
                // subtext: '纯属虚构',
                left : 'center'
            },
            tooltip : {
                trigger : 'item'
            },
            legend : {
                orient : 'vertical',
                left : 'left',
                data : [ '销售额' ]
            },
            toolbox : {
                show : true,
                orient : 'vertical',
                left : 'right',
                top : 'center',
                feature : {
                    dataView : {
                        readOnly : false
                    },
                    restore : {},
                    saveAsImage : {}
                }
            },
            visualMap : {
                min : 0,
                max : 5000000,
                text : [ 'High', 'Low' ],
                realtime : false,
                calculable : true,
                inRange : {
                    color : [ 'lightskyblue', 'yellow', 'orangered' ]
                }
            },
            dataRange : {
                min : 0,
                max : 2500000,
                x : 'left',
                selectedMode : false,
                y : 'bottom',
                text : [ 'High', 'Low' ], // 文本，默认为数值文本
                calculable : true,
                color : [ '#EE6363', '#CCCCCC' ]
            },
            series : [ {
                name : '销售额',
                type : 'map',
                mapType : 'china',
                roam : false,
                label : {
                    normal : {
                        show : true
                    },
                    emphasis : {
                        show : true
                    }
                },
                data : (function() {
                    var res = [];
                    var len = provic.length;
                    while (len--) {
                        res.push({
                            name : provic[len],
                            value : toCash[len]
                        });
                    }
                    return res;
                })(),
                itemStyle : {
                    normal : {
                        color : '#BF3EFF',
                        borderWidth : 0.5,
                        borderColor : 'black',
                        /* color: 'orange', */
                        label : {
                            show : false
                        }
                    }
                }
            } ]
        };
        myChart.setOption(mapParams);
    });
}
```