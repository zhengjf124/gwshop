!function(i,t,e,a){var n=function(){this.init()};n.prototype={init:function(){this.getData()},getData:function(){var i=this;Pub.post("/Home/NoticeOrder/NoticeIntegral",{},function(t){0===t.error_code&&i.integralData(t.data.list)})},integralData:function(t){i("#integral_aide").empty();var e="";if(t&&t.length>0){for(var a in t)e+='<li><div class="time">'+t[a].add_time+'</div><div class="box"><a href="#"><h4>'+t[a].title+'</h4><div class="content">'+t[a].note+"</div></a></div></li>";i("#integral_aide").append(e)}else i("#integral_aide").append('<div class="nothing">暂无消息！</div>')}};new n}(jQuery,window,document);