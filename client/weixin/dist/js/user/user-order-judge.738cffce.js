!function(i){function o(){this.init()}o.prototype={init:function(){this.initEvent(),this.getData()},getData:function(){var i=this;Pub.post("/Home/order/index",{},function(o){0==o.error_code&&(i.orderList(o.data.list),i.initEv())})},orderList:function(o){i("#order_list").empty();var t="";if(o.length>0){for(var e in o)if(220==o[e].order_status){t+='<div class="order-item"><div class="order-status"><a href="'+Pub.getHtmlUrl("html/user/user-order-cont.2f5cebff.html")+"?id="+o[e].id+'"><span>'+o[e].order_sn+'</span><strong>待评价</strong></a></div><div class="complete-goods"><a href="'+Pub.getHtmlUrl("html/user/user-order-cont.2f5cebff.html")+"?id="+o[e].id+'"><ul>';for(var r in o[e].goods){t+='<li><div class="img"><span></span><img src="'+o[e].goods[r].goods_img+'"></div><div class="info"><div class="name"><h4>'+o[e].goods[r].goods_name+'</h4></div><div class="sizes">';var s=o[e].goods[r].spec_key_name.split(" ");for(var n in s)t+="<h4>"+s[n]+"</h4>";t+='</div><div class="price"><h4>￥ '+o[e].goods[r].goods_price+"</h4><h3>X "+o[e].goods[r].goods_num+"</h3></div></div></li>"}t+='</ul></a><div class="complete-total"><h3 style="text-align: right;">实付款： <span>￥ '+o[e].order_amount+'</span></h3></div><div class="handle"><button class="order-comment" data-index="'+o[e].id+'">发表评论</button></div></div></div>'}i("#order_list").append(t)}},initEvent:function(){i("#order_menu").on("click",function(){i("#order_menu_show").show(),i("#order_menu_black").show()}),i("#order_menu_black").on("click",function(){i("#order_menu_show").hide(),i("#order_menu_black").hide()})},initEv:function(){i(".order-comment").on("click",function(){var o=i(this).attr("data-index"),t=Pub.getHtmlUrl("html/user/user-judge.4adde8c4.html")+"?id="+o;location.href=t})}},new o}(jQuery);