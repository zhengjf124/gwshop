!function(i,n,s,t){var o=function(){this.init()};o.prototype={init:function(){this.getData(),this.getDataUsed(),this.initEvent()},getData:function(){var n=this;Pub.post("/Home/Coupons/index/",{status:100},function(s){0===s.error_code&&(n.couponList(s.data.list),i("#count").text(s.data.count))})},getDataUsed:function(){Pub.post("/Home/Coupons/index/",{status:300},function(n){0===n.error_code&&i("#count_used").text(n.data.count)})},couponList:function(n){i("#coupon_list").empty();var s="";if(n&&n.length>0){for(var t in n)s+='<li><div class="img"><span></span><img src="../../images/pic-yhq.502d2baf.jpg"></div><div class="name"><div class="name-center"><h3>'+n[t].title+"</h3><p>使用期限   "+n[t].date+'</p></div></div><div class="info"><h4>￥<span>'+n[t].money+"</span></h4><h5>满"+n[t].condition+'使用</h5><div class="icon-used"></div><div class="round-left"></div><div class="round-right"></div></div></li>';i("#coupon_list").append(s)}else i("#coupon_list").css("border","none"),i("#coupon_list").append('<div class="nothing">您还没有优惠券！</div>')},couponListUsed:function(n){i("#coupon_list").empty();var s="";if(n&&n.length>0){for(var t in n)s+='<li><div class="img"><span></span><img src="../../images/pic-yhq.502d2baf.jpg"></div><div class="name"><div class="name-center"><h3>'+n[t].title+"</h3><p>使用期限   "+n[t].date+'</p></div></div><div class="info used"><h4>￥<span>'+n[t].money+"</span></h4><h5>满"+n[t].condition+'使用</h5><div class="icon-used"></div><div class="round-left"></div><div class="round-right"></div></div></li>';i("#coupon_list").append(s)}else i("#coupon_list").css("border","none"),i("#coupon_list").append('<div class="nothing">您还没有使用过优惠券哦！</div>')},initEvent:function(){var n=this;i("#coupon").on("click",function(){i(this).siblings().removeClass("active"),i(this).addClass("active"),n.getData()}),i("#coupon_used").on("click",function(){i(this).siblings().removeClass("active"),i(this).addClass("active"),Pub.post("/Home/Coupons/index/",{status:300},function(i){0===i.error_code&&n.couponListUsed(i.data.list)})})}};new o}(jQuery,window,document);