//获取当前具体时间显示到打卡中
    var time=document.getElementById("time")
    var timer=null;
//     timer=setInterval(function(){
//     	var date=new Date();
//	   	 hour=(date.getHours()<10?"0"+date.getHours():date.getHours()); //获取系统时，
//		 minu=(date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()) //分
//		 sec=date.getSeconds()<10?"0"+date.getSeconds():date.getSeconds();
//      time.innerHTML=hour+":"+minu+":"+sec
//      //console.log(time.innerHTML)
//  },1000)
       
 var mylatitude,mylongitude;
 
	 var map = new AMap.Map('container', {
		        resizeEnable: true,
		        center: [116.304,39.012],
		        zoom: 13
             });
    var x=document.getElementById("demo");
	(function getLocation(){
	  if (navigator.geolocation){
	     navigator.geolocation.getCurrentPosition(showPosition);
	   } else{x.innerHTML="Geolocation is not supported by this browser.";}
	   })()
	    function showPosition(position){
		  	   mylatitude=position.coords.latitude;
		  	   mylongitude=position.coords.longitude
		  	  $.ajax({
			   	type:"get",
			   	url:"http://restapi.amap.com/v3/assistant/coordinate/convert?key=841ccc39e327dc1480b5eae3d459c913&locations="+mylongitude+","+mylatitude+"&coordsys=gps",
			   	async:true,
			   	success:function(data){
			   		mylongitude=data.locations.split(",")[0];
			   		mylatitude=data.locations.split(",")[1];
		               // 设置缩放级别和中心点
			        map.setZoomAndCenter(16, [mylongitude,mylatitude]);
			        // 在新中心点添加 marker 
			        var icon = new AMap.Icon({
				     });
			         var marker = new AMap.Marker({
		                map: map,
			            position: [mylongitude,mylatitude]
			         });
                 
				    lnglatXY = [mylongitude,mylatitude]; //已知点坐标
				    AMap.service(["AMap.PlaceSearch"], function() {
			        var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
			            pageSize: 5,
			            type: '公司',
			            pageIndex: 1,
			            city: "010", //城市
			            map: map,
			            panel: "panel"
			        });
			        
			        var cpoint = lnglatXY; //中心点坐标
			        placeSearch.searchNearBy('', cpoint, 200, function(status, result) {
			
			        });
			    });
				        
				    (function regeocoder() {  //逆地理编码
				        var geocoder = new AMap.Geocoder({
				            radius: 1000,
				            extensions: "all"
				        });       
				  
				        geocoder.getAddress(lnglatXY, function(status, result) {
				        	
				            if (status === 'complete' && result.info === 'OK') {
				                geocoder_CallBack(result);
				            }
				        });        
				        map.setFitView();
				    })()
				    function geocoder_CallBack(data) {
				    	
				        var address = data.regeocode.pois[1].address; //返回地址描述
				        document.getElementById("result").innerHTML = address;
				    }	
			   	  }
   				});
	         }
	    	
	    
        //点击详情重新定位
        $(document).on("click","#panel .poibox",function(){
        	var addr=$(this).find(".poi-name").html();
        	window.location.href="index.html?addr="+addr;
        })