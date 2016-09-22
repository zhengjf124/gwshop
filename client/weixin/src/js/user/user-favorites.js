;(function($,undefined) {
    function Page() {
        this.init();
    }
    Page.prototype = {
        params: {
            offset: 0,
            limit: 0,
            count: 0
        },
        init: function() {
            this.initParams();
            this.loadData();
        },
        initParams: function(){
            this.params.offset = 0;
            this.params.limit = 4;
        },
        getData: function(me) {
            var _this = this;
            Pub.post('/Home/Collect/index', {
                offset: _this.params.offset,
                limit: _this.params.limit
            }, function(response) {
                if (response.error_code === 0) {
                    _this.params.count = response.data.count;
                    _this.params.offset += _this.params.limit;
                    _this.favoritesList(me,response.data.list);
                    _this.initEvent();
                }
            });
        },
        favoritesList: function(me,data) {
            var _this = this;
            var html = '';
            if (data.length > 0) {
                for (var i in data) {
                    html += '<li>' +
                        '<div class="favorites-cancel" data-index="' + data[i].goods_id + '">' +
                        '<i>&#xe6c5;</i>' +
                        '<p>取消收藏</p>' +
                        '</div>' +
                        '<a href="' + Pub.getHtmlUrl("html/goods/cont.html") + '?id=' + data[i].goods_id + '">' +
                        '<div class="img">' +
                        '<span></span><img src="' + data[i].goods_img + '">' +
                        '</div>' +
                        '<div class="info">' +
                        '<div class="name">' + data[i].goods_name + '</div>' +
                        '<div class="brief">' +
                        '<h5>' + data[i].goods_brief + '</h5>' +
                        '</div>' +
                        '<div class="tag">';
                    if (data[i].is_hot == 1) {
                        html += '<span class="hot">热卖</span>';
                    };
                    if (data[i].is_new == 1) {
                        html += '<span class="new">新品</span>';
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
                    } 
                }
                $("#favorites_list").append(html);                
                me.resetload();
            } 
            if(parseInt(_this.params.count) === 0){
                $('#list').append('<div class="nothing">暂无数据！</div>');
                $('#list').siblings().remove();
            }

        },
        loadData: function(){
            var _this = this;
            $('#favorites').dropload({
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
                    domNoData: '<div class="dropload-noData">数据已全部加载！</div>'
                },
                loadUpFn: function(me) {
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                    me.resetload();
                    me.unlock();
                    me.noData(false);
                },
                loadDownFn: function(me) {
                    _this.getData(me);
                },
                threshold: 150,
                autoLoad: true,
                distance: 50
            });
        },
        initEvent: function() {
            $(".favorites-cancel").on("click", function() {
                var index = $(this).attr("data-index");
                var _this = this;
                cloud.asked('您确定要取消收藏吗？', function() {
                    Pub.post('/Home/Collect/cancel', { goods_id: index }, function(response) {
                        if (response.error_code == 0) {
                            cloud.explain('您已取消收藏！', 'success', 1500);
                            $(_this).parent().fadeOut();
                        }
                    });

                }, function() {
                    cloud.msg('您选择了取消！', '50%', 1500);
                });



            })
        }

    }
    new Page();
})(jQuery)
