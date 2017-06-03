window.onload = function(){
	//调用 waterFall 函数
	waterfall("main","box");
	// onscroll事件
	// 模拟从后台获取到的json格式的数据
	var dataInt = {
		"data":[
            {"src":"0.jpg"},
            {"src":"1.jpg"},
            {"src":"2.jpg"},
            {"src":"3.jpg"},
            {"src":"4.jpg"},
            {"src":"5.jpg"},
            {"src":"6.jpg"}
		]
	}
	window.onscroll = function(){
		if( checkScrollSlide() ){
			var oParent = document.getElementById('main');// 父级对象
			for(var i=0;i<dataInt.data.length;i++){
                var oBox = document.createElement("div");
                	oBox.className = 'box';
                var oPic = document.createElement("div");
                    oPic.className = 'pic'
                var oImg = document.createElement("img");
                    oImg.src = 'images/'+ dataInt.data[i].src
                oPic.appendChild(oImg);
                oBox.appendChild(oPic);
                oParent.appendChild(oBox)

			}
		}
		//需要再次调用 waterFall 函数
		waterfall("main","box");
	}
}

// 封装 waterFall 函数

function waterfall(parent,box){
  // 将mian 下所有的 class为box的元素 取出来
  var oParent = document.getElementById(parent);
  // 调用 getByClass 函数
  var oBoxs = getByClass(oParent,box)
  // 获取整个页面显示的列数
  var oBoxW = oBoxs[0].offsetWidth;
  var cols = Math.floor(document.documentElement.clientWidth/oBoxW);
  // 设置oParent的宽度
  oParent.style.cssText = "width:"+oBoxW*cols+"px;margin:0 auto";
  // 存放每一列高度的数组 以方便找到最小高度
  var hArr = [];
  // 遍历找到最小高度的盒子
  for(var i=0; i<oBoxs.length;i++){
  	if(i<cols){
  		// 第一行
  		hArr.push(oBoxs[i].offsetHeight);
  	}
  	else{
  		// 到达第二行
  		var minH = Math.min.apply(null,hArr);//apply改变this指向 获取数组中的最小值
  		// 获取最小值在数组中的索引 以便获取最小高度的元素据父容器左侧的距离
  		var index = getMinhIndex(hArr,minH);
  		oBoxs[i].style.position = "absolute";
  		oBoxs[i].style.top = minH + 'px';
  		// oBoxs[i].style.left = oBoxW*index + 'px';
  		oBoxs[i].style.left = oBoxs[index].offsetLeft+ 'px';
  		hArr[index] += oBoxs[i].offsetHeight;//最后要加上当前新加上去的盒子的高度值
  	}
  }
}

// 封装 getByClass 函数
function getByClass(parent,clsName){
	var boxArr = [],//用来储存获取到的所有class 为 box 的元素
        oElements = parent.getElementsByTagName("*");//获取所有子元素
    // 获取特定className 元素
    for(var i=0;i<oElements.length;i++){
    	if(oElements[i].className == clsName){
    		boxArr.push(oElements[i]);
    	}
    }
    return boxArr;
}

// 封装 getMinhIndex 函数 获取最小值索引
function getMinhIndex(arr,val){
     for(var i in arr){
     	if(arr[i] == val){
     		return i
     	}
     }
}
//检测是否具备了滚动加载数据块的条件
function checkScrollSlide(){
	// 首先获取所有的数据块 并找到最后一个元素自身的高度的一半和自身距离顶部的距离之和
	var oParent = document.getElementById("main");
	var oBoxs = getByClass(oParent,'box');
    var lastBoxH = oBoxs[oBoxs.length - 1].offsetTop + Math.floor(oBoxs[oBoxs.length - 1].offsetHeight/2);
    // 获取滚动条滚动的距离
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;//混合模式与标准模式 下兼容
    // 获取可视区高度
    var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;//混合模式与标准模式 下兼容
    // 判断最后一个图片高度的一般是否进入可视区 并返回 一个布尔值
    return (scrollTop + clientHeight) > lastBoxH ?true:false;
}
