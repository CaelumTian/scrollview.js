;
(function($) {
	var defaults = {
		sectionContainer: "section", //指定单页面外部容器
		easing: "ease", //页面切换缓动效果
		animationTime: 1000, //切换时间（毫秒）
		pagination: true, //是否显示导航
		updateURL: false, //切换页面是否更新网页url
		supportOld: false, //是否兼容老版本浏览器
		keyboard: true, //是否可以用方向键控制
		beforeMove: null, //页面切换前回调
		afterMove: null, //页面切换后回调
		loop: true, //当前页面为最后一个是，继续切换是否可以
		swipeAnim:"default",   //滚动动画效果
		responsiveFallback: false, //是否当浏览器宽度为某一个指定值的时候，去除该插件效果，如果想实现这种效果，那么可以指定一个宽度值
		direction: 'vertical' // 页面切换方向，可选值为 "vertical"垂直 和"horizontal"水平. 默认 "vertical" 
	}
	$.fn.scrollview = function(options) {
		var settings = $.extend({}, defaults, options),
			element = $(this), //当前对象
			sections = $(settings.sectionContainer), //页面容器
			lastAnimation = 0, //初始化上次动画时间
			quietPeriod = 500, //动画等待时间
			total = sections.length, //总共页面数量
			paginationList = "", //导航条<li>元素设置
			movePrevent=false,	 //是否阻止触摸
			touchDown=false,     //手指已经按下，去除transition过度效果
			steps=NaN,		 //表示触摸到了第几步，解决onEnd重复
			startPos=NaN,		 //触摸起始点
			endPos=NaN,			 //触摸结束点
			offset=NaN;		     //偏移距离
		(function() {
			if(settings.direction == "horizontal"){
				for(var i=0;i<total;i++){
					$(sections[i]).css({
						"position":"absolute",
						"top":"0px",
						"left":i*100+"%"
					})
				}
			}
			if (settings.pagination) {
				var array = [];
				if ($('ul.scroll-pagination').length == 0) {
					$("body").prepend("<ul class='scroll-pagination'></ul>");
				} //不存在则设置ul导航
				for (var i = 0; i < total; i++) {
					array[i] = "<li><a data-index='" + (i + 1) + "' href='#" + (i + 1) + "'></a></li>";
				}
				paginationList = array.join(""); //循环设置li
				$('ul.scroll-pagination').html(paginationList);
				if (settings.direction === 'horizontal') {
					var $pagination = $("body").find(".scroll-pagination");
					var posLeft = ($pagination.width() / 2) * -1;
					$pagination.css({
						"marginLeft":posLeft,
						"top":(parseInt(sections.height())-30)+"px",
						"left":"50%"
					});
					$pagination.find("li").css("float","left");
				} else {
					var $pagination = $("body").find(".scroll-pagination");
					var posTop = ($pagination.height() / 2) * -1;
					$pagination.css("marginTop", posTop);
				}
			} //导航条位置
			if (window.location.hash != "" && window.location.hash != "#1") {


			} else {
				$(settings.sectionContainer + "[data-index='1']").addClass("active")
				$("body").addClass("viewing-page-1")
				if (settings.pagination == true) {
					$(".scroll-pagination li a" + "[data-index='1']").addClass("active");
				}
			} //hash信息设置+初始化设置
		})() //闭包实现关键参数设置		

		function init_scroll(event, delta) {
			var timeNow = new Date().getTime(); //获取时间戳
			if (timeNow - lastAnimation < quietPeriod + settings.animationTime) {
				console.log("本次滑动取消"); //根据时间判断是否取消滑动
				return
			} else {
				if (delta < 0) {
					element.moveDown(); //向下滑动
				} else {
					element.moveUp(); //向上滑动
				}
				lastAnimation = timeNow;
			}
		} //构造函数
		$.fn.moveDown = function() {
			var index = $(settings.sectionContainer + ".active").data("index"), //获取当前页面索引date-index，active为激活元素
				current = $(settings.sectionContainer + "[data-index='" + index + "']"), //获取当前显示元素
				next = $(settings.sectionContainer + "[data-index='" + (index + 1) + "']") //获取下一个元素
				if (next.length == 0) {
					if (settings.loop) {
						var pos = 0;
						next = $(settings.sectionContainer + "[data-index='1']"); //如果到达最后，且允许循环,下一个设置成第一个元素
					} else {
						return
					}
				} else {
					var pos = (index * 100) * -1;
				}
				/*(if (typeof settings.beforeMove == 'function'){
				settings.beforeMove( next.data("index"));
			} 回调处理函数*/
				current.removeClass("active")
				next.addClass("active");
			if (settings.pagination) {
				$(".scroll-pagination li a" + "[data-index='" + index + "']").removeClass("active");
				$(".scroll-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
			}
			$("body")[0].className = ""; //页面记录信息以备后用
			$("body")[0].className = "viewing-page-" + next.data("index");
			if (settings.updateURL) {
				var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (index + 1);
			} //连接处理，未完成......
			$(this).transformPage(settings, pos, next.data("index")); //调用运动处理函数
		}
		$.fn.moveUp = function() {
			var index = $(settings.sectionContainer + ".active").data("index"),
				current = $(settings.sectionContainer + "[data-index='" + index + "']"),
				next = $(settings.sectionContainer + "[data-index='" + (index - 1) + "']");
			if (next.length == 0) {
				if (settings.loop) {
					var pos = ((total - 1) * 100) * -1;
					next = $(settings.sectionContainer + "[data-index='" + total + "']");
				} else {
					return
				}
			} else {
				var pos = ((next.data("index") - 1) * 100) * -1;
			}
			if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index")); //回调函数
			current.removeClass("active");
			next.addClass("active");
			if (settings.pagination) {
				$(".scroll-pagination li a" + "[data-index='" + index + "']").removeClass("active");
				$(".scroll-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
			}
			$("body")[0].className = ""; //页面记录信息以备后用
			$("body")[0].className = "viewing-page-" + next.data("index");
			if (settings.updateURL) {
				var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (index + 1);
			} //连接处理，未完成......
			$(this).transformPage(settings, pos, next.data("index")); //调用运动处理函数
		}
		$.fn.moveTo = function(page_index) {
			var current = $(settings.sectionContainer + ".active");
			var goPage = $(settings.sectionContainer + "[data-index='" + (page_index) + "']");
			if (goPage.length > 0) {
				/*加入前回调函数*/
				current.removeClass("active")
				goPage.addClass("active")
				$(".scroll-pagination li a" + ".active").removeClass("active");
				$(".scroll-pagination li a" + "[data-index='" + (page_index) + "']").addClass("active");
				$("body")[0].className = "";
				$("body")[0].className = "viewing-page-" + goPage.data("index");
				var pos = ((page_index - 1) * 100) * -1;
				$(this).transformPage(settings, pos, page_index);
			}
		}
		$.fn.transformPage = function(settings, pos, index) {
			if (defaults.supportOld && $('html').hasClass('ie8')) {
				console.log("降级处理");
			} else {
				$(this).css({
					"-webkit-transform": (settings.direction == 'horizontal') ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
					"-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
					"-moz-transform": (settings.direction == 'horizontal') ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
					"-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
					"-ms-transform": (settings.direction == 'horizontal') ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
					"-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
					"transform": (settings.direction == 'horizontal') ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
					"transition": "all " + settings.animationTime + "ms " + settings.easing
				});
			}
			//此处加入监听函数，监听css3动画完成情况
		}

		//移动适配

		function onStart(event){
			if(movePrevent){
				return false;
			}
			touchDown=true;   //按下
			settings.direction === "horizontal" ? startPos=event.pageX:startPos=event.pageY;
			steps=1;
		}
		function onMove(event){
			if(movePrevent === true || touchDown === false){
				return false;
			}
			settings.direction === "horizontal" ? endPos=event.pageX:endPos=event.pageY;
			scrollToMove();
		}
		function onEnd(event){
			console.log(steps);
			if(movePrevent === true && steps !=2){
				return false;
			}else{
				touchDown=false;  //移开
				settings.direction === "horizontal" ? endPos=event.pageX:endPos=event.pageY;
			}
			if(settings.direction === "vertical" && steps === 2){
				var comPos=endPos-startPos,
					index = $(settings.sectionContainer + ".active").data("index");
				if(Math.abs(comPos)<50){
					element.css({
						"-webkit-transform": "translate3d(0," + (parseInt(index-1)*-100) + "%,0)",
						"-webkit-transition": "all " + 500 + "ms ",
						"transform": "translate3d(0," + (parseInt(index-1)*-100) + "%,0)",
						"transition": "all " + 500 + "ms "
					})   //完成归位
				}else{
					if(comPos<0){
						element.moveDown(); //向下滑动
					}else{
						element.moveUp(); //向下滑动
					}
				}
			}
			steps=3;
		}
		function scrollToMove(){
			if(defaults.swipeAnim === "cover"){

			}
			else if(defaults.swipeAnim === "default"){
				 //这里暂时制作一组垂直的
				var	pageHeight  = document.documentElement.clientHeight,
					comPos=endPos-startPos,
					index = $(settings.sectionContainer + ".active").data("index"),
					current = $(settings.sectionContainer + "[data-index='" + index + "']"), 
					pre=$(settings.sectionContainer + "[data-index='" + (index - 1) + "']"),
					next = $(settings.sectionContainer + "[data-index='" + (index + 1) + "']");
				if(settings.direction === "vertical" && endPos < startPos){
					if(next.length === 0){
						console.log("已经到达最后一个");
						return false;    //不加入循环
					}
					var current_index=parseInt(index)-1;
					element.css({
						"-webkit-transform": "translate3d(0," + (comPos-pageHeight*current_index) + "px,0)",
						"-webkit-transition": "all " + 0 + "ms ",
						"transform": "translate3d(0," + (comPos-pageHeight*current_index) + "px,0)",
						"transition": "all " + 0 + "ms "
					})
				} //向下滑
				if(settings.direction === "vertical" && endPos >= startPos){
					if(pre.length === 0){
						return false;    //不加入循环
					}
					var current_index=parseInt(index)-1;
					element.css({
						"-webkit-transform": "translate3d(0," + (comPos-pageHeight*current_index) + "px,0)",
						"-webkit-transition": "all " + 0 + "ms ",
						"transform": "translate3d(0," + (comPos-pageHeight*current_index) + "px,0)",
						"transition": "all " + 0 + "ms "
					})
				}
			}
			steps=2;
		}
		$(document).on("wheel mousewheel DOMMouseScroll", function(event) {
			event.preventDefault();
			var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail * 40;
			init_scroll(event, delta);
		}).on("touchstart",function(event){
			event.preventDefault();
			onStart(event.originalEvent.changedTouches[0]);    //触摸这里需要看看，貌似有问题
		}).on("touchmove",function(event){
			event.preventDefault();
			onMove(event.originalEvent.changedTouches[0]);
		}).on("touchend",function(event){
			event.preventDefault();
			onEnd(event.originalEvent.changedTouches[0]);
		})

		$("ul.scroll-pagination").on("click", "a", function(event) {
			event.preventDefault();
			var page_index = $(this).data("index");
			element.moveTo(page_index);
		}) //绑定导航条跳转事件
	}
})(jQuery)