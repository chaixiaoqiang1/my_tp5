/*	项目名称：梧桐
 *	文件名称：梧桐系统框架内框架首页Js文件
 *	开发时间：2017/04/25
 * 	开发人员：398146685@qq.com
 * */

layui.use(['slimscroll','layer'], function(){
	var slimscroll = layui.slimscroll;
	var layer = layui.layer;
	$("#second_nav").slimScroll({height:"100%",opacity: .4,railOpacity:.9});
	$("#menu_b").slimScroll({height:"100%",opacity: .4,railOpacity:.9});

	$('.refresh_iframe').mouseenter(function(){
		layer.tips('刷新当前页', '.refresh_iframe',{
			time: 2000,
			skin: 'layui-layer-refresh'
		});
	});

});

$(function(){
	//窗口内容高度自适应
	$('.page_content').height($(window).height()-47+'px');
	$(window).resize(function(){
		$('.page_content').height($(window).height()-47+'px');
	});
	//添加向右工具
	addTurnRight();



	/*子菜单显示*/
	var $body = $('body');
	var $nav_box = $('#nav_box');
	var $secondNav = $('#second_nav');
	var $thirdNav = $('#third_nav');
	var couldRun = true;
	$body.on('click', '#menu_b ul li',function(event){
		$('#mask').addClass('show');
		if(couldRun) {
			couldRun = false;
			$secondNav.empty();
			$thirdNav.empty();
			$(this).addClass('active').siblings().removeClass('active');
			var $childCont = $(this).find('.submenu_wrapper').html();
			$(this).parent().addClass('active').siblings().removeClass('active');
			setTimeout(function(){
				$secondNav.append($childCont).fadeIn();
			},300);
			$nav_box.css({
				'width': '160px',
				'borderRight': '1px solid #eeeeee',
				'boxShadow': '0 3px 10px rgba(0, 0, 0, .2)'
			});

			// 一秒后将变为可运行
			setTimeout(function(){
				couldRun = true;
			},300);
		}
		event.stopPropagation();

	});

	//二级菜单模块点击伸缩
	$body.on('click','#nav_box .submenu_ul .colla_item .colla_title',function(event){
		var $collapse = $(this).closest('div.colla_item');
		var $collaTitle = $collapse.find('.colla_title');
		var $button = $collaTitle.find('i');
		var $collaContent =$collapse.find('.colla_content');
		$collaContent.slideToggle(200);
		$button.toggleClass('icon-down').toggleClass('icon-upward');
		event.stopPropagation();
	});


	//移入二级菜单的时候 右侧消失
	$body.on('mouseenter','#nav_box .submenu_ul .colla_item .colla_title',function(){
		var $collapse = $(this).closest('div.colla_item');
		var $collaContent =$collapse.find('.colla_content');
		$(this).parents('.submenu_ul').find('.submenu_li').removeClass('active');
		$thirdNav.css('display','none');
		$thirdNav.empty();
		$nav_box.css({
			'width': '160px'
		});
	});

	//二级菜单控制显示三级菜单
	$body.on('mouseenter', '#nav_box .submenu_ul .submenu_li a', function(){
		$thirdNav.empty();
		$(this).parents('.submenu_ul').find('.submenu_li').removeClass('active');
		$(this).parent().addClass('active');
		var hasTag = $(this).attr('tag') == undefined;
		if(!hasTag){
			var thirdCont = $(this).siblings('.third_nav').html();
			$thirdNav.stop().append(thirdCont).fadeIn('200');
			$nav_box.css({
			'width': '330px'
			});
		}else{
			$nav_box.css({
				'width': '160px'
			});
		}
	});

	//点击文档，隐藏菜单
	$('#mask').click(function(){
		$(this).removeClass('show');
		setTimeout(function(){
			$('#second_nav').empty();
			$('#third_nav').empty();
			$nav_box.css({
				'width': '0',
				'padding': '0',
				'borderRight': 'none',
				'boxShadow': 'none'
			});
			$('#menu_b ul li').removeClass('active');
		},200)
	});

	//刷新当前iframe
	$('.refresh_iframe').on('click',function(){
		var $that = $('.page_content.show').find('iframe');
		var $iframe = $that.attr('src');
		$that.attr('src', $iframe);
	});



	//常用工具打开、缩回
	$('.toolbar_b .toolbar_down').click(function(){
		$(this).find('i').toggleClass('icon-down').toggleClass('icon-upward');
		$('.toolbar_b .toolbar_list').slideToggle(200);
	});


	//常用工具打开、缩回
	$('.toolbar_b .toolbar_list li a').click(function(){
		$(this).parents('.toolbar_b').find('.toolbar_down').find('i').toggleClass('icon-upward').toggleClass('icon-down');
		$('.toolbar_b .toolbar_list').slideToggle(200);
	});

	//顶部TAB控制IFRAME切换
	$body.on('click', '.page_tabs_b .page_tabs_content a',function(){
		var index = $(this).index();
		$(this).addClass('active').siblings().removeClass('active');
		$('.page_content').eq(index).addClass('show').siblings().removeClass('show');
	});

	//关闭顶部tab标签
	$body.on('click','.page_tabs_b .page_tabs_content a i',function(event){
		/*
		 * 其实只需要判断当前点击的这个tab的li标签是否有active 就可以知道外面是否还有active标签
		 * 如果hasActive是true 那说明剩余就没有active的li标签了
		 * */
		var hasActive=$(this).parent('a').hasClass('active');
		var Tabli=$(this).parent('a').index();
		$('.page_content').eq(Tabli).remove();
		$(this).parent('a').remove();

		if(hasActive){
			$('.page_tabs_b .page_tabs_content a:last').addClass('active');
			$('.page_content:last').addClass('show').siblings('.page_content').removeClass('show');
		}else{
			$('.page_content').siblings().removeClass('show');
			var divTag=$('.page_tabs_b .page_tabs_content a[class="active"]').attr('tag');
			$(".page_content[tag='"+divTag+"']").addClass('show');
		}
		event.stopPropagation();
	});

	//当TAB切换很多时，可以向左，向右
	$(".roll_left").on("click", i);
	$(".roll_right").on("click", a);
});

//通过判断tag，动态添加向右图标
function addTurnRight(){
	var obj = '<i class='+'"iconfont icon-forward"'+'></i>';
	$(".submenu_wrapper .submenu_ul .submenu_li a[tag]").append(obj);
}

function addTabBar(url,title,tag){

	//跳转到页面后，收回二三级菜单
	subMenuHide();

	//添加之前去除兄弟模块的选中状态
	$('.page_tabs_b .page_tabs_content a.active').removeClass('active');

	//根据tag标签判断这个标签是否存在，如果存在就设置成选中状态
	var $tag = $(".page_tabs_b .page_tabs_content a[tag='"+tag+"']");
	var isTag = $tag.length;

	if(!isTag){
		var Wh=$(window).height()-47;

		//添加tab标签
		var strTab = '<a href="javascript:void(0)" data-src='+url+' class="active" tag="'+tag+'">' + title + '<i class="iconfont icon-close ml-5" style="font-size: 14px;"></i></a>';
		$(".page_tabs_b .page_tabs_content").append(strTab);

		//架注入iframe
		var iframeDiv = '<div class="page_content show animated fadeInRight" tag="'+tag+'" style="height:'+Wh+'px"><div class="load_div" style="width: 100%;height: 100%;background: #ffffff; position:absolute;left: 50%;top: 50%;margin-left: -90px;margin-top: -120px;"><img src="img/page/loading.gif" /></div><iframe scrolling="yes" frameborder="0" src="'+url+'" style="display: none" onload="stateChangeFirefox(this)"></iframe></div>';
		$('.page_content').removeClass('show');
		$('.page_content:last').after(iframeDiv);
	}else{
		$tag.addClass('active').siblings('a').removeClass('active');
		$('.page_content').eq($tag.index()).addClass('show').siblings().removeClass('show');
	}


	//当在最后的时候 向前移动，并且当已经出现移动到可视区域
	e($(".page_tabs_content a.active"))

}

//iframe 状态改变
function stateChangeFirefox(_frame) {
	$(_frame).parent('.page_content').find('.load_div').css('display','none');
	_frame.style.visibility = "visible";
	_frame.style.display = "block"
}

//二三级菜单隐藏方法
function subMenuHide(){
	$('#nav_box').css({
		'width': '0',
		'padding': '0',
		'borderRight': 'none'
	});
	$('#second_nav').empty();
	$('#third_nav').empty();
	$('#menu_b ul li').removeClass('active');
	$('#mask').removeClass('show');
}

function t(t) {
	var e = 0;
	return $(t).each(function () {
		e += $(this).outerWidth(!0)
	}), e
}

function a() {
	var e = Math.abs(parseInt($(".page_tabs_content").css("margin-left"))),
		a = t($(".content_tabs_b").children().not(".page_tabs_b")),
		i = $(".content_tabs_b").outerWidth(!0) - a,
		n = 0;
	if ($(".page_tabs_content").width() < i) {
		$(".page_tabs_content").animate({
			marginLeft: 0  + "px"
		}, "fast");
		return !1
	}
	for (var s = $(".page_tabs_content a:first"), r = 0; r + $(s).outerWidth(!0) <= e;) r += $(s).outerWidth(!0), s = $(s).next();

	if (r = 0, t($(s).prevAll()) > i) {
		for (; r + $(s).outerWidth(!0) < i && s.length > 0;) r += $(s).outerWidth(!0), s = $(s).prev();
		n = t($(s).prevAll())
	}
	$(".page_tabs_content").animate({
		marginLeft: 0 - n + "px"
	}, "fast");
}

function i() {
	var e = Math.abs(parseInt($(".page_tabs_content").css("margin-left"))),
		a = t($(".content_tabs_b").children().not(".page_tabs_b")),
		i = $(".content_tabs_b").outerWidth(!0) - a,
		n = 0;
	if ($(".page_tabs_content").width() < i) return !1;
	for (var s = $(".page_tabs_content a:first"), r = 0; r + $(s).outerWidth(!0) <= e;) r += $(s).outerWidth(!0), s = $(s).next();
	for (r = 0; r + $(s).outerWidth(!0) < i && s.length > 0;) r += $(s).outerWidth(!0), s = $(s).next();
	n = t($(s).prevAll()), n > 0 && $(".page_tabs_content").animate({
		marginLeft: 0 - n + "px"
	}, "fast")
}


function e(e) {
	var a = t($(e).prevAll()),
		i = t($(e).nextAll()),
		n = t($(".content_tabs_b").children().not(".page_tabs_b")),
		s = $(".content_tabs_b").outerWidth(!0) - n,
		r = 0;
	if ($(".page_tabs_content").outerWidth() < s) {
		r = 0;
	}else if (i <= s - $(e).outerWidth(!0) - $(e).next().outerWidth(!0)) {
		if (s - $(e).next().outerWidth(!0) > i) {
			r = a;
			for (var o = e; r - $(o).outerWidth() > $(".page_tabs_content").outerWidth() - s;) r -= $(o).prev().outerWidth(), o = $(o).prev()
		}
	} else a > s - $(e).outerWidth(!0) - $(e).prev().outerWidth(!0) && (r = a - $(e).prev().outerWidth(!0));
	$(".page_tabs_content").animate({
		marginLeft: 0 - r + "px"
	}, "fast")
}



