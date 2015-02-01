## scrollview.js
<hr />
scrollview.js是一款单页面滚动切换插件，适用于全屏的网站开发；同时scrollview.js也能够作为移动端的滚动视差插件。
该插件特别为移动端进行了适配，少量加入了几个动画；同时插件还封装了css3动画效果么。以便更好的应用开发。

### 一丶使用：
HTML
```

<!--这里的section结构与data-index是必须的-->
<div id="main">
	<section data-index=1 class="page1"></section>
	<section data-index=2 class="page2"></section>
	<section data-index=3 class="page3"></section>
</div>

```
CSS引用：

```
<link rel="stylesheet" href="./css/style.css">
<link rel="stylesheet" href="./css/asset.css">
```

JS引用：

```
<script src="./js/jquery-1.11.2.js"></script>
<script src="./js/scrollview.js"></script>
<script>
    jQuery(document).ready(function($) {
		$("#main").scrollview({
			sectionContainer: "section",
		    responsiveFallback: 600,
		    loop: true
		})
	});	
</script>
```
###二丶定制：
```
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
```

