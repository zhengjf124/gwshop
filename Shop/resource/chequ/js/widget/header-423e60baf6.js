!function(t,a,e,i){var l=function(){this.init()};l.prototype={init:function(){this.initHeader(),this.initNav(this.initCallback)},initHeader:function(){t("#header").empty();var a='<div class="header-container"><div class="logo wow fadeInLeft"><span class="dib"></span><a href="'+Pub.getHtmlUrl("html/index.html")+'"><img src="../../images/logo-c5ce8231b4.png"></a></div><div class="qr-code wow fadeInRight"><img src="../../images/pic_qr_code-25d37382a6.png"><span>扫一扫有惊喜<br />·－</span></div><div class="user-link wow fadeIn" data-wow-delay="800ms"><a href="'+Pub.getHtmlUrl("html/user/login-64664234ad.html")+'" title="登录">登录</a><span>|</span><a href="'+Pub.getHtmlUrl("html/user/register-ef8aaf9961.html")+'">注册</a></div><img src="../../images/chart_header-2cc79ee306.png" class="header-bg wow fadeInDown"></div>';t("#header").append(a)},initNav:function(a){t("#nav").empty();var e='<div class="nav-container"><a href="'+Pub.getHtmlUrl("html/index.html")+'" class="active" id="index">首页</a><a href="'+Pub.getHtmlUrl("html/goods/list-a2943c3773.html")+'" id="list1">红珊瑚系列</a><a href="'+Pub.getHtmlUrl("html/goods/list-a2943c3773.html")+'">玳瑁系列</a><a href="'+Pub.getHtmlUrl("html/goods/list-a2943c3773.html")+'">砗磲系列</a><a href="'+Pub.getHtmlUrl("html/goods/list-a2943c3773.html")+'">玳瑁系列</a><a href="'+Pub.getHtmlUrl("html/goods/list-a2943c3773.html")+'">砗磲系列</a><div class="search"><div class="search-container"><input type="text" class="txt" id="search_words" placeholder="请输入关键词"><button class="btn" id="btn_search"></button></div></div></div>';t("#nav").append(e),a()},initCallback:function(){t(".search").on("click",function(){return t(this).find(".search-container").animate({opacity:"1",right:"0px"},200),!1}),t("#btn_search").on("click",function(){var e=t("#search_words").val(),i=e.replace(/ /g,"");if(""!=e){var l=Pub.getHtmlUrl("html/goods/list-a2943c3773.html")+"?keyword="+encodeURI(i);a.location.href=l}else cloud.explain("请输入关键词搜索！",2e3)});var e=a.location.href;e.indexOf("index")!=-1?(t(".nav-container a").removeClass("active"),t("#index").addClass("active")):e.indexOf("list")!=-1&&(t(".nav-container a").removeClass("active"),t("#list1").addClass("active"))}};new l}(jQuery,window,document);