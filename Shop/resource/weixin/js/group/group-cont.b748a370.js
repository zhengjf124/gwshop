!function(s,o,i,a){var e=function(){this.init()};return e.prototype={params:{goodsId:0,goodsNum:1,goodsSpec:{},buyType:"buying",specPrice:"",goodsStore:0,inputNum:1,nowTime:"",limitTime:"",specList:{}},initParams:function(){this.params.goodsId=Pub.searchToObject().id,this.params.inputNum=s("#num_value").val(),this.params.nowTime=parseInt(Date.parse(new Date))/1e3},init:function(){this.initParams(),this.getData(),this.initEvent()},getData:function(){var s=this;Pub.post("/Home/Goods/detail",{id:s.params.goodsId},function(o){0===o.error_code&&(console.log(o),s.goodsPics(o.data.goods_images,s.picsEvent),s.goodsInfo(o.data,o.data.goods.limit_time,s.infoTime),s.goodsOther(o.data.goods),s.goodsCommentOne(o.data.goods_comment),s.buyGoodsInfo(o.data),s.buyGoodsSpec(o.data.specList),s.buyChooseSpec(),s.params.specPrice=o.data.spec_goods_price,s.params.limitTime=o.data.goods.limit_time,s.params.specList=o.data.specList,s.checkData())}),Pub.post("/Home/Comments/goods_comments",{},function(o){0===o.error_code&&(s.goodsCommentOne(o.data),s.commentShow(o.data))}),Pub.post("/Home/Goods/youLike",{},function(o){0===o.error_code&&s.goodsLike(o.data.goods_list)})},goodsPics:function(o,i){s("#goods_pics").empty();var a="";if(o&&o.length>0){a='<div class="focus"><a class="arrow-left"><i>&#xe603;</i></a ><a class="arrow-right"><i>&#xe604;</i></a><div class="swiper-main"><div class="swiper-container swiper1"><ul class="swiper-wrapper">';for(var e in o)o.hasOwnProperty(e)&&(a+='<li class="swiper-slide"><img src="'+o[e].image_url+'"></li>');a+='</ul></div></div><div class="pagination pagination1"></div></div>',s("#goods_pics").append(a)}i()},picsEvent:function(){var o=new Swiper(".swiper1",{pagination:".pagination1",loop:!0,grabCursor:!0});s(".arrow-left").click(function(s){s.preventDefault(),o.swipePrev()}),s(".arrow-right").click(function(s){s.preventDefault(),o.swipeNext()}),s(".pagination1 .swiper-pagination-switch").click(function(){o.swipeTo(s(this).index())})},goodsInfo:function(o,i,a){var e="";o&&(s("#goods_info").empty(),e+='<div class="name"><h2>'+o.goods.goods_name+'</h2></div><div class="times">',""!=o.goods.goods_brief&&(e+=o.goods.goods_brief),e+='</div><div class="price-storage"><div class="price"><span>￥<strong>'+o.goods.goods_price+"</strong></span><del>￥"+o.goods.market_price+'</del></div><div class="storage"><h5>评价 '+o.goods_comment+"<span>|</span>库存  "+o.goods.store_count+'</h5></div></div><div class="time-over" id="time"><h6><label class="day">0</label>天<label class="hour">00</label>时<label class="minute">00</label>分<label class="second">00</label>秒后活动结束<!--<span>(已有 1562 人参团)</span>--></h6></div>'),s("#goods_info").append(e),a(i)},infoTime:function(s){Pub.countDown(s,"#time")},goodsOther:function(o){s("#goods_other").empty();var i="";1!==parseInt(o.is_new)&&1!==parseInt(o.is_hot)||(i+="<p><strong>促销</strong>",1===parseInt(o.is_new)&&(i+="<span><font>新</font> 最新推出</span>"),1===parseInt(o.is_hot)&&(i+='<span><font class="hot">热</font> 热门商品</span>'),i+="</p>"),i+="<p><strong>服务</strong><span><i>&#xe637;</i>广为独家原创</span><span><i>&#xe637;</i>全场包邮</span></p>",s("#goods_other").append(i)},goodsCommentOne:function(o){s("#goods_comment_one").empty();var i="";o&&o.length>0?(i+='<div class="judge-bottom"><div class="judge-list"><ul>',i+='<li><div class="name"><img src="'+o.list[0].headimgurl+'"><strong>'+o.list[0].user_name+"</strong><span>"+o.list[0].add_name+'</span></div><div class="brief"><h5>'+o.list[0].content+"</h5></div></li>",i+='</ul></div></div><div class="judge-more" id="goods_comment_more"><a>查看全部'+o.count+"条评价 ></a></div>"):s("#goods_comment_one").append('<div class="nothing" style="">暂无评论！</div>')},goodsLike:function(o){s("#goods_like").empty();var i="";if(o&&o.length>0){i+='<div class="maybe-like"><h3>你可能会喜欢</h3></div><div class="list-sm"><ul>';for(var a in o)o.hasOwnProperty(a)&&(i+='<li><a href="'+Pub.getHtmlUrl("html/goods/cont.fb80c266.html")+"?id="+o[a].id+'"><div class="img"><span></span><img src="'+o[a].goods_img+'"></div><div class="info"><div class="name"><h4>'+o[a].goods_name+'</h4></div><div class="price"><h4>￥'+o[a].goods_price+"</h4></div></div></a></li>");i+="</ul></div>"}s("#goods_like").append(i),s("#goods_like").css("margin-top","10px")},goodsCont:function(o){s("#xiangqing_show").empty();var i="";""!=o?(i+='<div class="goods-detail">'+o.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"')+"</div>",s("#xiangqing_show").append(i)):s("#xiangqing_show").append('<div class="nothing">暂无内容！</div>')},contentData:function(){var s=this;Pub.post("/Home/Goods/content",{id:s.params.goodsId},function(o){if(0===o.error_code){console.log(o),s.goodsCont(o.data.goods_desc);var i=o.data.goods_desc;sessionStorage.setItem("goodCont",i)}})},commentShow:function(o){s("#pingjia_show").empty();var i="";if(o.list&&o.list.length>0){i+='<div class="judge-bottom"><div class="judge-score"><h3>总体评分</h3><p>';for(var a=0;a<5;a++)i+=a<o.total_score?'<i class="active">&#xe62d;</i>':"<i>&#xe62d;</i>";i+='</p></div><div class="judge-list"><h3>商品评价</h3><ul>';for(var e in o.list)o.list.hasOwnProperty(e)&&(i+='<li><div class="name"><img src="'+o.list[e].headimgurl+'"><strong>'+o.list[e].user_name+"</strong><span>"+o.list[e].add_time+'</span></div><div class="brief"><h5>'+o.list[e].content+"</h5></div></li>");i+="</ul></div></div>",s("#pingjia_show").append(i)}else s("#pingjia_show").append('<div class="nothing">暂无评论！</div>')},buyGoodsInfo:function(o){s("#goods_buy_info").empty();var i="";i+='<div class="img"><span></span>',o.goods_images.length>0&&(i+='<img src="'+o.goods_images[0].image_url+'">'),i+='</div><div class="info"><div class="name"><a><h3>'+o.goods.goods_name+'</h3></a></div><div class="price"><span>￥<strong id="goods_price">'+o.goods.goods_price+"</strong></span><del>￥"+o.goods.market_price+"</del></div></div>",s("#goods_buy_info").append(i)},buyGoodsSpec:function(o){var i=this;s("#spec_list").empty();var a="";if(""!=o){for(var e in o)if(o.hasOwnProperty(e)){i.params.goodsSpec[e]=null,a+="<dl><dt>"+e+"</dt><dd>";for(var n in o[e])o[e].hasOwnProperty(n)&&(a+='<label data-index="'+o[e][n].item_id+'">'+o[e][n].item+"</label>");a+="</dd></dl>"}s("#spec_list").append(a)}else s("#spec_list").parent().hide()},buyChooseSpec:function(){var o=this;s("#spec_list dl dd label").on("click",function(){var i=s(this).parent().siblings().text(),a=parseInt(s(this).attr("data-index")),e=[];s(this).siblings().removeClass("active"),s(this).addClass("active"),o.params.goodsSpec[i]=a;for(var n in o.params.goodsSpec)o.params.goodsSpec.hasOwnProperty(n)&&e.push(o.params.goodsSpec[n]);e=e.join("_");var t=o.params.specPrice[e].price;s("#goods_price").text(t),o.params.goodsStore=o.params.specPrice[e].store_count,s("#qty").show(),s(".spec").css("border-bottom","1px solid #fff")})},postData:function(){var s=this;Pub.post("/Home/Cart/add",{goods_id:s.params.goodsId,goods_num:s.params.goodsNum,goods_spec:s.params.goodsSpec,buy_type:s.params.buyType},function(s){if(0===s.error_code){var o=Pub.getHtmlUrl("html/shopping/balance.a20704ba.html")+"?id="+s.data.cart_id;location.href=o}})},checkData:function(){var o=this,i=Pub.toUnix(o.params.limitTime);i<o.params.nowTime&&s("#btn_buy").parent().addClass("disabled").css("background","#999")},initEvent:function(){var o=this;s("#shangpin").on("click",function(){s(this).siblings().removeClass("active"),s(this).addClass("active"),s("#shangpin_show").fadeIn(),s("#xiangqing_show").hide(),s("#pingjia_show").hide(),s("html,body").scrollTop(0)}),s("#xiangqing,#btn_content").on("click",function(){s(this).siblings().removeClass("active"),s(this).addClass("active"),s("#shangpin_show").hide(),s("#xiangqing_show").fadeIn(),s("#pingjia_show").hide(),s("html,body").scrollTop(0);var i=sessionStorage.getItem("goodCont");""!=i&&null!=i?o.goodsCont(i):o.contentData(),s("#xiangqing").siblings().removeClass("active"),s("#xiangqing").addClass("active")}),s("#pingjia").on("click",function(){s(this).siblings().removeClass("active"),s(this).addClass("active"),s("#shangpin_show").hide(),s("#xiangqing_show").hide(),s("#pingjia_show").fadeIn(),s("html,body").scrollTop(0)}),s("#num_minus").on("click",function(){o.params.inputNum>1&&o.params.inputNum<parseInt(o.params.goodsStore)+1?(s("#num_plus").removeClass("disabled"),s("#num_value").val(--o.params.inputNum)):1===parseInt(o.params.inputNum)&&(s(this).addClass("disabled"),cloud.msg("商品数量不能小于1","80%",2e3)),o.params.goodsNum=s("#num_value").val()}),s("#num_plus").on("click",function(){o.params.inputNum>0&&o.params.inputNum<o.params.goodsStore?(s("#num_minus").removeClass("disabled"),s("#num_value").val(++o.params.inputNum)):parseInt(o.params.inputNum)===parseInt(o.params.goodsStore)&&(s("#num_plus").addClass("disabled"),cloud.msg("您选购的商品超出了库存啦","80%",2e3)),o.params.goodsNum=s("#num_value").val()}),s("#btn_buy").on("click",function(){s("#buy_shade").fadeIn(),s("#buy_show").slideDown(),s("html").css("overflow-y","hidden")}),s("#buy_shade").on("click",function(){s("#buy_show").slideUp(),s("#buy_shade").fadeOut(),s("html").css("overflow-y","auto")}),s("#sub_buy").on("click",function(){if(""!=o.params.specList)for(var s in o.params.goodsSpec)if(o.params.goodsSpec.hasOwnProperty(s)&&null===o.params.goodsSpec[s])return cloud.msg("请选择"+s+"参数","80%",2e3),!1;o.postData()})}},new e}(jQuery,window,document);