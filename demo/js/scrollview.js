;(function($){
	var defaults={
		sectionContainer: "section", //指定单页面外部容器
	    easing: "ease",				 //页面切换缓动效果
	    animationTime: 1000,	     //切换时间（毫秒）
	    pagination: true,            //是否显示导航
	    updateURL: false,            //切换页面是否更新网页url
	    supportOld:false,            //是否兼容老版本浏览器
	    keyboard: true,              //是否可以用方向键控制
	    beforeMove: null,            //页面切换前回调
	    afterMove: null,             //页面切换后回调
	    loop: true,                  //当前页面为最后一个是，继续切换是否可以
	    responsiveFallback: false,   //是否当浏览器宽度为某一个指定值的时候，去除该插件效果，如果想实现这种效果，那么可以指定一个宽度值
	    direction : 'vertical'       // 页面切换方向，可选值为 "vertical"水平 和"horizontal"垂直. 默认 "vertical" 
	}
	$.fn.scrollview=function(options){
		var settings=$.extend({},defaults,options),
			element=$(this), 		 //当前对象
			sections=$(settings.sectionContainer),  //页面容器
			lastAnimation = 0,       //初始化上次动画时间
        	quietPeriod = 500,       //动画等待时间
        	total = sections.length; //总共页面数量
		function init_scroll(event,delta){
			var timeNow = new Date().getTime();  //获取时间戳
			if(timeNow-lastAnimation<quietPeriod+settings.animationTime){
				console.log("本次滑动取消");    //根据时间判断是否取消滑动
				return
			}else{
				if(delta<0){
					element.moveDown();   //向下滑动
				}else{
					element.moveUp();     //向上滑动
				}
				lastAnimation=timeNow;
			}
		} //构造函数
		$.fn.moveDown=function(){
			var index=$(settings.sectionContainer +".active").data("index"),  //获取当前页面索引date-index，active为激活元素
				current=$(settings.sectionContainer + "[data-index='" + index + "']"),   //获取当前显示元素
				next=$(settings.sectionContainer + "[data-index='" + (index + 1) + "']") //获取下一个元素
			if(next.length==0){
				if(settings.loop){
					var pos=0;
					next = $(settings.sectionContainer + "[data-index='1']");   //如果到达最后，且允许循环,下一个设置成第一个元素
				}else{
					return
				}
			}else{
				var pos=(index * 100) * -1;
			}
			/*(if (typeof settings.beforeMove == 'function'){
				settings.beforeMove( next.data("index"));
			} 回调处理函数*/
			current.removeClass("active")
      		next.addClass("active");
      		/*if(settings.pagination) {
		        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
		        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
		    }  //导航设置*/
		    $("body")[0].className="";    //页面记录信息以备后用
		   	$("body")[0].className="viewing-page-"+next.data("index");
		   	if(settings.updateURL){
		   		var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index + 1);
		   	}   //连接处理，未完成......
		    $(this).transformPage(settings, pos, next.data("index"));  //调用运动处理函数
		}
		$.fn.moveUp=function(){
			var index=$(settings.sectionContainer +".active").data("index"),  
				current=$(settings.sectionContainer + "[data-index='" + index + "']"),
				next=$(settings.sectionContainer + "[data-index='" + (index - 1) + "']");
			if(next.length==0){
				if(settings.loop){
				    var pos = ((total - 1) * 100) * -1;
          			next = $(settings.sectionContainer + "[data-index='"+total+"']");
				}else{
					return
				}
			}else{
				var pos=((next.data("index") - 1) * 100) * -1;
			}
			if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));  //回调函数
			current.removeClass("active");
      		next.addClass("active");
      		/*if(settings.pagination == true) {
		    	$(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
		        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
		    } //导航设置*/
		    $("body")[0].className="";    //页面记录信息以备后用
		   	$("body")[0].className="viewing-page-"+next.data("index");
		   	if(settings.updateURL){
		   		var href = window.location.href.substr(0,window.location.href.indexOf('#')) + "#" + (index + 1);
		   	}   //连接处理，未完成......
		   	$(this).transformPage(settings, pos, next.data("index"));  //调用运动处理函数
		}
		$.fn.transformPage=function(settings, pos, index){
			if(defaults.supportOld && $('html').hasClass('ie8')){
				console.log("降级处理");
			}else{
				$(this).css({
			        "-webkit-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
			        "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
			        "-moz-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
			        "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
			        "-ms-transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
			        "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
			        "transform": ( settings.direction == 'horizontal' ) ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
			        "transition": "all " + settings.animationTime + "ms " + settings.easing
			     });
			}
			//此处加入监听函数，监听css3动画完成情况
		}
		$(document).on("wheel mousewheel DOMMouseScroll",function(event){
			event.preventDefault();
			var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail*40;
			init_scroll(event,delta);
		})
	}
})(jQuery)