;
(function($, window, document, undefined) {
    var Page = function() {
        this.init();
    };
    Page.prototype = {
        params: {
            orderBy: '',
            offset: 0,
            limit: 0,
            cartId: 0,
            keyWord: '',
            count: 0
        },
        initParams: function() {
            this.params.orderBy = 'order_sort-desc';
            this.params.offset = 0;
            this.params.limit = 4;
            this.params.cartId = Pub.searchToObject().id;
            this.params.keyWord = Pub.searchToObject().keyword;
            
        },
        init: function() {
            this.initParams();
            this.loadData();
            this.initEvent();
        },
        getData: function(me) {
            var _this = this;
            Pub.post('/Home/goods/index', {
                order_by: _this.params.orderBy,
                offset: _this.params.offset,
                limit: _this.params.limit,
                cart_id: _this.params.cartId,
                keyword: _this.params.keyWord
            }, function(response) {
                if (response.error_code === 0) {
                    _this.params.count = response.data.count;
                    _this.params.offset += _this.params.limit;
                    _this.listData(me, response.data.list);
                }
            });
        },
        listData: function(me, data) {
            var _this = this;
            var html = '';
            if (data.length > 0) {
                for (var i in data) {
                    html += '<li>' +
                        '<a href="' + Pub.getHtmlUrl('html/goods/cont.html') + '?id=' + data[i].id + '">' +
                        '<div class="img">' +
                        '<span></span><img src="' + data[i].goods_img + '">' +
                        '</div>' +
                        '<div class="info">' +
                        '<div class="name">' + data[i].goods_name + '</div>' +
                        '<div class="brief">' +
                        '<h5>' + data[i].goods_brief + '</h5>' +
                        '</div>' +
                        '<div class="tag">';
                    if (data[i].is_new == 1) {
                        html += '<span class="new">新品</span>';
                    }
                    if (data[i].is_hot == 1) {
                        html += '<span class="hot">热卖</span>';
                    }

                    html += '</div>' +
                        '<div class="price">' +
                        '<span>￥' + data[i].goods_price + '</span><del>￥' + data[i].market_price + '</del><em>评论' + data[i].comment_count + '条</em>' +
                        '</div>' +
                        '</div>' +
                        '</a>' +
                        '</li>';
                    if (_this.params.offset >= _this.params.count) {
                        // 锁定
                        me.lock('down');
                        // 无数据
                        me.noData();
                        break;
                    }

                }
                $('#list').append(html);
                me.resetload();
            } 
            if(parseInt(_this.params.count) === 0){
            	$('#list').append('<div class="nothing">暂无数据！</div>');
                $('#list').siblings().remove();
            }

        },
        loadData: function(){
        	var _this = this;
            $('#list_container').dropload({
                scrollArea: window,
                domUp: {
                    domClass: 'dropload-up',
                    domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
                    domUpdate: '<div class="dropload-update">↑释放刷新</div>',
                    domLoad: '<div class="dropload-load"><span class="loading"></span>刷新中...</div>'
                },
                domDown: {
                    domClass: 'dropload-down',
                    domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                    domLoad: '<div class="dropload-load"><span class="loading"></span>数据加载中...</div>',
                    domNoData: '<div class="dropload-noData"><!--数据已全部加载！--></div>'
                },
                loadUpFn: function(me) {
                    setTimeout(function() {
                        window.location.reload();
                    }, 600);
                    me.resetload();
                },
                loadDownFn: function(me) {
                    _this.getData(me);
                },
                threshold: 150,
                autoLoad: true,
                distance: 50
            });
        },
        toSearch: function(){
        	var url = Pub.getHtmlUrl('html/search.html');
        	location.href = url;
        },
        initEvent: function() {
            var _this = this;
            //搜索
            $('#txt_search').on('click',_this.toSearch);
            $('#sub_search').on('click',_this.toSearch);
            //综合排序	
            $(".sort1").on("click", function() {
				$("#list").empty();
				$(this).siblings().removeClass("active");
				$(this).siblings().removeClass("active-up");
				$(this).siblings().addClass("acnone");
				$(this).removeClass("acnone");
				$(this).addClass("active");
				_this.params.offset = 0;
				_this.params.orderBy = "order_sort-desc";
				$('#list_container').find('.dropload-down').remove();
				_this.loadData();
			});
            //销量排序	
            $(".sort2").on("click", function() {
				$("#list").empty();
				$(this).siblings().removeClass("active");
				$(this).siblings().removeClass("active-up");
				$(this).siblings().addClass("acnone");
				if($(this).is(".acnone")) {					
					$("#list").empty();
					$(this).removeClass("acnone");
					$(this).addClass("active");
					_this.params.offset = 0;
					_this.params.orderBy = "order_sales-desc";
					$('#list_container').find('.dropload-down').remove();
					_this.loadData();
				} else if($(this).is(".active")) {
					$("#list").empty();
					$(this).removeClass("active");
					$(this).addClass("active-up");
					$(this).children("i").html("&#xe6d7;");
					_this.params.offset = 0;
					_this.params.orderBy = "order_sales-asc";
					$('#list_container').find('.dropload-down').remove();
					_this.loadData();
				} else if($(this).is(".active-up")) {
					$("#list").empty();
					$(this).removeClass("active-up");
					$(this).addClass("active");
					$(this).children("i").html("&#xe6d8;");
					_this.params.offset = 0;
					_this.params.orderBy = "order_sales-desc";
					$('#list_container').find('.dropload-down').remove();
					_this.loadData();
				}
			});
		//价格排序	
		$(".sort3").on("click", function() {
			$("#list").empty();
			$(this).siblings().removeClass("active");
			$(this).siblings().removeClass("active-up");
			$(this).siblings().addClass("acnone");
			if($(this).is(".acnone")) {
				$("#list").empty();
				$(this).removeClass("acnone");
				$(this).addClass("active");
				_this.params.offset = 0;
				_this.params.orderBy = "order_price-desc";               
				$('#list_container').find('.dropload-down').remove();
				_this.loadData();
			} else if($(this).is(".active")) {
				$("#list").empty();
				$(this).removeClass("active");
				$(this).addClass("active-up");
				$(this).children("i").html("&#xe6d7;");
				_this.params.offset = 0;
				_this.params.orderBy = "order_price-asc";
				$('#list_container').find('.dropload-down').remove();
				_this.loadData();
			} else if($(this).is(".active-up")) {
				$("#list").empty();
				$(this).removeClass("active-up");
				$(this).addClass("active");
				$(this).children("i").html("&#xe6d8;");
				_this.params.offset = 0;
				_this.params.orderBy = "order_price-desc";
				$('#list_container').find('.dropload-down').remove();
				_this.loadData();
			}
		});
        }

    };
    return new Page();
})(jQuery, window, document)


// var listData = [];
// var search = Pub.searchToObject();
// if(search.keyword){
// 	var keyWord = decodeURI(search.keyword)
// }

// // 获取数据的参数
// var params = {
// 	cat_id: search.id,
// 	offset: 0,
// 	limit: 4,
// 	order_by: "order_sort-desc",
// 	keyword: keyWord
// };

// // 是否还有数据，根据返回的count判断
// var active = true;

// var getData = function() {
// 	if(active) {
// 		Pub.post('/Home/goods/index', params, function(response) {
// 			if(response.error_code == 0) {
// 				params.offset += params.limit;
// 				listing(response.data.list); // 只更新新加的数据                
// 				if(response.data.count < 5) {
// 					$("#pullUp").hide();
// 				} else {
// 					$("#pullUp").show();
// 				}
// 			}
// 		});
// 	}
// };

// $(document).ready(function() {
//     $("#txt_search").on("click",toSearch);
//     $("#submit_search").on("click",toSearch);
// 		$("#list").empty();
// 		//获取列表
// 		getData();
// 		//综合排序
// 		$(".sort1").on("click", function() {
// 				$("#list").empty();
// 				$(this).siblings().removeClass("active");
// 				$(this).siblings().removeClass("active-up");
// 				$(this).siblings().addClass("acnone");
// 				$(this).removeClass("acnone");
// 				$(this).addClass("active");
// 				params.offset = 0;
// 				params.order_by = "order_sort-desc";
// 				getData();
// 			})
// 			//销量
// 		$(".sort2").on("click", function() {
// 				$("#list").empty();
// 				$(this).siblings().removeClass("active");
// 				$(this).siblings().removeClass("active-up");
// 				$(this).siblings().addClass("acnone");
// 				if($(this).is(".acnone")) {
// 					$("#list").empty();
// 					$(this).removeClass("acnone");
// 					$(this).addClass("active");
// 					params.offset = 0;
// 					params.order_by = "order_sales-desc";
// 					getData();
// 				} else if($(this).is(".active")) {
// 					$("#list").empty();
// 					$(this).removeClass("active");
// 					$(this).addClass("active-up");
// 					$(this).children("i").html("&#xe6d7;");
// 					params.offset = 0;
// 					params.order_by = "order_sales-asc";
// 					getData();
// 				} else if($(this).is(".active-up")) {
// 					$("#list").empty();
// 					$(this).removeClass("active-up");
// 					$(this).addClass("active");
// 					$(this).children("i").html("&#xe6d8;");
// 					params.offset = 0;
// 					params.order_by = "order_sales-desc";
// 					getData();
// 				}
// 			})
// 			//价格
// 		$(".sort3").on("click", function() {
// 			$("#list").empty();
// 			$(this).siblings().removeClass("active");
// 			$(this).siblings().removeClass("active-up");
// 			$(this).siblings().addClass("acnone");
// 			if($(this).is(".acnone")) {
// 				$("#list").empty();
// 				$(this).removeClass("acnone");
// 				$(this).addClass("active");
// 				params.offset = 0;
// 				params.order_by = "order_price-desc";
// 				getData();
// 			} else if($(this).is(".active")) {
// 				$("#list").empty();
// 				$(this).removeClass("active");
// 				$(this).addClass("active-up");
// 				$(this).children("i").html("&#xe6d7;");
// 				params.offset = 0;
// 				params.order_by = "order_price-asc";
// 				getData();
// 			} else if($(this).is(".active-up")) {
// 				$("#list").empty();
// 				$(this).removeClass("active-up");
// 				$(this).addClass("active");
// 				$(this).children("i").html("&#xe6d8;");
// 				params.offset = 0;
// 				params.order_by = "order_price-desc";
// 				getData();
// 			}
// 		})



// })

// function toSearch(){
// 	var url = Pub.getHtmlUrl('html/search.html');
// 	location.href=url;
// }

// function wordClear() {
// 	var word = $("#word").val();
// 	if(word != '') {
// 		$(".clear-word").show();
// 	} else {
// 		$(".clear-word").hide();
// 	}
// }

// function listing(data) {
// 	var html = "";
// 	if(data.length > 0) {
// 		for(var i in data) {
// 			html += '<li>' +
// 				'<a href="' + Pub.getHtmlUrl('html/goods/cont.html') + '?id=' + data[i].id + '">' +
// 				'<div class="img">' +
// 				'<span></span><img src="' + data[i].goods_img + '">' +
// 				'</div>' +
// 				'<div class="info">' +
// 				'<div class="name">' + data[i].goods_name + '</div>' +
// 				'<div class="brief">' +
// 				'<h5>' + data[i].goods_brief + '</h5>' +
// 				'</div>' +
// 				'<div class="tag">';
// 			if(data[i].is_new == 1) {
// 				html += '<span class="new">新品</span>';
// 			}
// 			if(data[i].is_hot == 1) {
// 				html += '<span class="hot">热卖</span>';
// 			}

// 			html += '</div>' +
// 				'<div class="price">' +
// 				'<span>￥' + data[i].goods_price + '</span><del>￥' + data[i].market_price + '</del><em>评论' + data[i].comment_count + '条</em>' +
// 				'</div>' +
// 				'</div>' +
// 				'</a>' +
// 				'</li>';
// 		}
// 		$("#list").append(html);
// 	} else {
// 		active = false;
// 		$("#list").append('<p class="no-list-warning">抱歉，暂无列表！</p>')
// 	}
// 	myScroll.refresh();
// }
// var myScroll,
// 	pullDownEl, pullDownOffset,
// 	pullUpEl, pullUpOffset,
// 	generatedCount = 0;

// function pullDownAction() {
// 	window.location.reload();
// }

// function pullUpAction() {
// 	if(active) {
// 		setTimeout(getData, 1000);
// 	}
// }
