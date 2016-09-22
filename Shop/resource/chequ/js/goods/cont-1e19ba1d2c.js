!function(a,s,t,o){var e=function(){this.init()};e.prototype={params:{goodsId:0,specPrice:{},goodsSpec:{},inputNum:1,goodsStore:0,goodsNum:1,buyType:"",specList:{}},init:function(){this.initParams(),this.getData(),this.contentData(),this.initEvent()},initParams:function(){this.params.goodsId=Pub.searchToObject().id,this.params.inputNum=a(".num-value").val()},getData:function(){var a=this;Pub.post("/Home/Goods/detail",{id:a.params.goodsId},function(s){console.log(s),0===parseInt(s.error_code)&&(a.picsData(s.data.goods_images,a.picsEvent),a.initData(s.data.goods),a.goodsSpec(s.data.specList),a.chooseGoodsSpec(),a.params.specPrice=s.data.spec_goods_price,a.params.specList=s.data.specList,a.dataEvent())})},picsData:function(s,t){if(s&&s.length>0){var o="";a("#pics_small").empty();for(var e in s)s.hasOwnProperty(e)&&(o+='<li><img src="'+s[e].image_url+'"></li>');a("#pics_small").append(o),t()}},picsEvent:function(){var s=a("#pics_small li:nth-child(1) img").attr("src");a("#pics_big").attr("src",s),a("#pics_small li:nth-child(1)").addClass("active"),a("#pics_small li").on("hover",function(){var s=a(this).find("img").attr("src");a(this).is(".active")?a(this).removeClass("active"):(a(this).siblings().removeClass("active"),a(this).addClass("active"),a("#pics_big").attr("src",s))})},initData:function(s){a("#ny_local").html('位置：<a href="'+Pub.getHtmlUrl("html/index.html")+'">首页</a><span>&gt;</span>某某商品系列<span>&gt;</span>'+s.goods_name),a(".name").html("<h3>"+s.goods_name+'</h3><div class="brief">'+s.goods_brief+"</div>"),a("#price").html(s.goods_price),a("#price_del").html(s.goods_price),a("#storeCount").html(s.store_count)},goodsSpec:function(s){var t=this;if(""!==s){var o="";a("#specs").empty();for(var e in s)if(s.hasOwnProperty(e)){t.params.goodsSpec[e]=null,o+='<div class="spec"><span><em>'+e+'</em>：</span><div class="spec-right">';for(var i in s[e])s[e].hasOwnProperty(i)&&(o+='<label data-id="'+s[e][i].item_id+'">'+s[e][i].item+"<i></i></label>");o+="</div></div>"}a("#specs").append(o)}},chooseGoodsSpec:function(){var s=this;a(".spec-right label").on("click",function(){var t=a(this).parent().siblings().find("em").text(),o=parseInt(a(this).attr("data-id")),e=[];a(this).siblings().removeClass("active"),a(this).addClass("active"),s.params.goodsSpec[t]=o;for(var i in s.params.goodsSpec)s.params.goodsSpec.hasOwnProperty(i)&&e.push(s.params.goodsSpec[i]);e=e.join("_");var n=s.params.specPrice[e].price;a("#price").text(n),s.params.goodsStore=s.params.specPrice[e].store_count,a(".nums").show(),a("#store").text(s.params.goodsStore),s.params.inputNum=1,a(".num-value").val("1"),a(".num-minus").addClass("disabled"),a(".num-plus").removeClass("disabled")})},dataEvent:function(){var s=this;a(".num-minus").on("click",function(){s.params.inputNum>1&&s.params.inputNum<parseInt(s.params.goodsStore)+1?(a(".num-plus").removeClass("disabled"),a(".num-value").val(--s.params.inputNum)):1===parseInt(s.params.inputNum)&&(a(this).addClass("disabled"),cloud.msg("商品数量不能小于1","50%",2e3)),s.params.goodsNum=a(".num-value").val()}),a(".num-plus").on("click",function(){s.params.inputNum>0&&s.params.inputNum<s.params.goodsStore?(a(".num-minus").removeClass("disabled"),a(".num-value").val(++s.params.inputNum)):parseInt(s.params.inputNum)===parseInt(s.params.goodsStore)&&(a(".num-plus").addClass("disabled"),cloud.msg("您选购的商品超出了库存啦","50%",2e3)),s.params.goodsNum=a(".num-value").val()})},postData:function(){var a=this;Pub.post("/Home/Cart/add",{goods_id:a.params.goodsId,goods_num:a.params.goodsNum,goods_spec:a.params.goodsSpec,buy_type:a.params.buyType},function(s){if(0===parseInt(s.error_code))if("cart"===a.params.buyType)cloud.explain("已成功加入购物车！","success",2e3);else{var t=Pub.getHtmlUrl("html/shopping/balance-095e55510b.html")+"?cartId="+s.data.cart_id;location.href=t}})},contentData:function(){var a=this;Pub.post("/Home/Goods/content",{id:a.params.goodsId},function(s){if(0===parseInt(s.error_code)){a.goodsCont(s.data.goods_desc);var t=s.data.goods_desc;sessionStorage.setItem("goodCont",t)}})},goodsCont:function(s){a("#cont_content").empty();var t="";""!=s?(t+=s.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"'),a("#cont_content").append(t)):a("#cont_content").append('<div class="nothing">暂无内容！</div>')},initEvent:function(){var s=this;a("#btn_buy").on("click",function(){if(s.params.buyType="buying",""!=s.params.specList)for(var a in s.params.goodsSpec)if(s.params.goodsSpec.hasOwnProperty(a)&&null===s.params.goodsSpec[a])return cloud.msg("请选择"+a+"参数","50%",2e3),!1;return s.postData(),!1}),a("#btn_cart").on("click",function(){if(s.params.buyType="cart",""!=s.params.specList)for(var a in s.params.goodsSpec)if(s.params.goodsSpec.hasOwnProperty(a)&&null===s.params.goodsSpec[a])return cloud.msg("请选择"+a+"参数","50%",2e3),!1;return s.postData(),!1})}};new e}(jQuery,window,document);