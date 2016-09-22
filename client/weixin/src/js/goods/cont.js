;
(function($, window, document, undefined) {
    var Page = function() {
        this.init();
    };
    Page.prototype = {
        params: {
            goodsId: 0,
            goodsNum: 1,
            goodsSpec: {},
            buyType: 'buying',
            specPrice: '',
            goodsStore: 0,
            inputNum: 1,
            nowTime:'',
            limitTime:'',
            specList:{}
        },
        initParams: function() {
            this.params.goodsId = Pub.searchToObject().id;
            this.params.inputNum = $('.num_value').val();
            this.params.nowTime = parseInt(Date.parse(new Date()))/1000;
        },
        init: function() {
            this.initParams();
            this.getData();
            this.initEvent();
        },
        getData: function() {
            var _this = this;
            Pub.post('/Home/Goods/detail', { id: _this.params.goodsId }, function(response) {
                if (response.error_code === 0) {
                    _this.goodsPics(response.data.goods_images, _this.picsEvent);
                    _this.goodsInfo(response.data);
                    _this.goodsOther(response.data.goods);
                    _this.goodsCommentOne(response.data.goods_comment);
                    _this.buyGoodsInfo(response.data);
                    _this.buyGoodsSpec(response.data.specList);
                    _this.buyChooseSpec();
                    _this.params.specPrice = response.data.spec_goods_price;
                    _this.params.limitTime = response.data.goods.limit_time;
                    _this.params.specList = response.data.specList;
                    _this.checkCollect();
                }
            });
            Pub.post('/Home/Comments/goods_comments', {}, function(response) {
                if (response.error_code === 0) {
                    _this.goodsCommentOne(response.data);
                    _this.commentShow(response.data);
                }
            });
            Pub.post('/Home/Goods/youLike', {}, function(response) {
                if (response.error_code === 0) {
                    _this.goodsLike(response.data.goods_list);
                }
            });
        },
        goodsPics: function(data, callback) {
            $('#goods_pics').empty();
            var html = '';
            if (data && data.length > 0) {
                html = '<div class="focus">' +
                    '<a class="arrow-left"><i>&#xe603;</i></a >' +
                    '<a class="arrow-right"><i>&#xe604;</i></a>' +
                    '<div class="swiper-main">' +
                    '<div class="swiper-container swiper1">' +
                    '<ul class="swiper-wrapper">';
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        html += '<li class="swiper-slide"><img src="' + data[i].image_url + '"></li>';
                    }
                }
                html += '</ul>' +
                    '</div>' +
                    '</div>' +
                    '<div class="pagination pagination1"></div>' +
                    '</div>';
                $('#goods_pics').append(html);
            };
            callback();
        },
        picsEvent: function() {
            var swiper = new Swiper('.swiper1', {
                pagination: '.pagination1',
                loop: true,
                grabCursor: true
            });
            $('.arrow-left').click(function(e) {
                e.preventDefault()
                swiper.swipePrev()
            });
            $('.arrow-right').click(function(e) {
                e.preventDefault()
                swiper.swipeNext()
            });
            $('.pagination1 .swiper-pagination-switch').click(function() {
                swiper.swipeTo($(this).index())
            })
        },
        goodsInfo: function(data) {
            var html = '';
            if (data) {
                $('#goods_info').empty();
                html += '<div class="name">' +
                    '<h2>' + data.goods.goods_name + '</h2>' +
                    '</div>' +
                    '<div class="times">';
                if (data.goods.goods_brief != '') {
                    html += data.goods.goods_brief;
                }
                html += '</div>' +
                    '<div class="price-storage">' +
                    '<div class="price"><span>￥<strong>' + data.goods.goods_price + '</strong></span><del>￥' + data.goods.market_price + '</del></div>' +
                    '<div class="storage">' +
                    '<h5>评价 ' + data.goods_comment + '<span>|</span>库存  ' + data.goods.store_count + '</h5>' +
                    '</div>' +
                    '</div>';
            }
            $('#goods_info').append(html);
        },
        goodsOther: function(data) {
            $('#goods_other').empty();
            var html = '';
            if (parseInt(data.is_new) === 1 || parseInt(data.is_hot) === 1) {
                html += '<p><strong>促销</strong>';
                if (parseInt(data.is_new) === 1) {
                    html += '<span><font>新</font> 最新推出</span>';
                }
                if (parseInt(data.is_hot) === 1) {
                    html += '<span><font class="hot">热</font> 热门商品</span>';
                }
                html += '</p>';
            }
            html += '<p><strong>服务</strong><span><i>&#xe637;</i>广为独家原创</span><span><i>&#xe637;</i>全场包邮</span></p>';
            $('#goods_other').append(html);
        },
        goodsCommentOne: function(data) {
            $('#goods_comment_one').empty();
            var html = '';
            if (data && data.length > 0) {
                html += '<div class="judge-bottom">' +
                    '<div class="judge-list">' +
                    '<ul>';
                html += '<li>' +
                    '<div class="name">' +
                    '<img src="' + data.list[0].headimgurl + '"><strong>' + data.list[0].user_name + '</strong><span>' + data.list[0].add_name + '</span>' +
                    '</div>' +
                    '<div class="brief">' +
                    '<h5>' + data.list[0].content + '</h5>' +
                    '</div>' +
                    '</li>';
                html += '</ul>' +
                    '</div>' +
                    '</div>' +
                    '<div class="judge-more" id="goods_comment_more">' +
                    '<a>查看全部' + data.count + '条评价 ></a>' +
                    '</div>';
            } else {
                $('#goods_comment_one').append('<div class="nothing" style="">暂无评论！</div>');
            }
        },
        goodsLike: function(data) {
            $('#goods_like').empty();
            var html = '';
            if (data && data.length > 0) {
                html += '<div class="maybe-like">' +
                    '<h3>你可能会喜欢</h3>' +
                    '</div>' +
                    '<div class="list-sm">' +
                    '<ul>';
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        html += '<li>' +
                            '<a href="' + Pub.getHtmlUrl('html/goods/cont.html') + '?id=' + data[i].id + '">' +
                            '<div class="img">' +
                            '<span></span><img src="' + data[i].goods_img + '">' +
                            '</div>' +
                            '<div class="info">' +
                            '<div class="name">' +
                            '<h4>' + data[i].goods_name + '</h4>' +
                            '</div>' +
                            '<div class="price">' +
                            '<h4>￥' + data[i].goods_price + '</h4>' +
                            '</div>' +
                            '</div>' +
                            '</a>' +
                            '</li>';
                    }
                }
                html += '</ul>' +
                    '</div>';
            }
            $('#goods_like').append(html);
            $('#goods_like').css('margin-top', '10px');
        },
        goodsCont: function(data) {
            $('#xiangqing_show').empty();
            var html = '';
            if (data != '') {
                html += '<div class="goods-detail">' + data.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"') + '</div>';
                $('#xiangqing_show').append(html);
            } else {
                $('#xiangqing_show').append('<div class="nothing">暂无内容！</div>');
            }

        },
        contentData: function() {
            var _this = this;
            Pub.post('/Home/Goods/content', { id: _this.params.goodsId }, function(response) {
                if (response.error_code === 0) {
                    _this.goodsCont(response.data.goods_desc);
                    var cont = response.data.goods_desc;
                    sessionStorage.setItem('goodCont', cont);
                }
            });
        },
        commentShow: function(data) {
            $('#pingjia_show').empty();
            var html = '';
            if (data.list && data.list.length > 0) {
                html += '<div class="judge-bottom">' +
                    '<div class="judge-score">' +
                    '<h3>总体评分</h3>' +
                    '<p>';
                for (var s = 0; s < 5; s++) {
                    if (s < data.total_score) {
                        html += '<i class="active">&#xe62d;</i>';
                    } else {
                        html += '<i>&#xe62d;</i>';
                    }
                }
                html += '</p>' +
                    '</div>' +
                    '<div class="judge-list">' +
                    '<h3>商品评价</h3>' +
                    '<ul>';
                for (var i in data.list) {
                    if (data.list.hasOwnProperty(i)) {
                        html += '<li>' +
                            '<div class="name">' +
                            '<img src="' + data.list[i].headimgurl + '"><strong>' + data.list[i].user_name + '</strong><span>' + data.list[i].add_time + '</span>' +
                            '</div>' +
                            '<div class="brief">' +
                            '<h5>' + data.list[i].content + '</h5>' +
                            '</div>' +
                            '</li>';
                    }
                }
                html += '</ul>' +
                    '</div>' +
                    '</div>';
                $('#pingjia_show').append(html);
            } else {
                $('#pingjia_show').append('<div class="nothing">暂无评论！</div>');
            }
        },
        buyGoodsInfo: function(data) {
            $('.goods-buy-info').empty();
            var html = '';
            html += '<div class="img">' +
                '<span></span>';
            if (data.goods_images.length > 0) {
                html += '<img src="' + data.goods_images[0].image_url + '">';
            }
            html += '</div>' +
                '<div class="info">' +
                '<div class="name">' +
                '<a><h3>' + data.goods.goods_name + '</h3></a>' +
                '</div>' +
                '<div class="price">' +
                '<span>￥<strong class="goods-price">' + data.goods.goods_price + '</strong></span>' +
                '<del>￥' + data.goods.market_price + '</del>' +
                '</div>' +
                '</div>';
            $('.goods-buy-info').append(html);
        },
        buyGoodsSpec: function(data) {
        	var _this = this;
            $('.spec-container').empty();
            var html = '';
            if (data != '') {
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                    	_this.params.goodsSpec[i] = null;
                        html += '<dl>' +
                            '<dt>' + i + '</dt>' +
                            '<dd>';
                        for (var j in data[i]) {
                            if (data[i].hasOwnProperty(j)) {
                                html += '<label data-index="' + data[i][j].item_id + '">' + data[i][j].item + '</label>';
                            }
                        }
                        html += '</dd>' +
                            '</dl>';
                    }
                }
                $('.spec-container').append(html);
            } else {
                $('.spec-container').parent().hide();
            }
        },
        buyChooseSpec: function() {
            var _this = this;
            $('.spec-container dl dd label').on('click', function() {
                var ind = $(this).parent().siblings().text();
                var val = parseInt($(this).attr('data-index'));
                var spec = [];
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                _this.params.goodsSpec[ind] = val;
                for (var i in _this.params.goodsSpec) {
                    if (_this.params.goodsSpec.hasOwnProperty(i)) {
                        spec.push(_this.params.goodsSpec[i]);
                    }
                }
                spec = spec.join('_');
                var price = _this.params.specPrice[spec].price;
                $('.goods-price').text(price);
                _this.params.goodsStore = _this.params.specPrice[spec].store_count;
                $('.qty').show();
                $('.spec').css('border-bottom', '1px solid #fff');
            });
        },
        cartPostData: function(){
        	var _this = this;
        	Pub.post('/Home/Cart/add',{
        		goods_id: _this.params.goodsId,
        		goods_num: _this.params.goodsNum,
        		goods_spec: _this.params.goodsSpec,
                buy_type: 'cart'
        	},function(response){
        		if(response.error_code === 0){
        			$('#cart_show').slideUp();
        			$('#cart_shade').fadeOut();
        			cloud.explain('已成功加入购物车!','success',2000);
        		}
        	});
        },
        buyPostData: function(){
        	var _this = this;
        	Pub.post('/Home/Cart/add',{
        		goods_id: _this.params.goodsId,
        		goods_num: _this.params.goodsNum,
        		goods_spec: _this.params.goodsSpec,
        		buy_type: _this.params.buyType
        	},function(response){
        		if(response.error_code === 0){
        			var url = Pub.getHtmlUrl('html/shopping/balance.html')+'?id='+response.data.cart_id;
        			location.href = url;
        		}
        	});
        },
        checkCollect: function(){
        	var _this = this;
        	Pub.post('/Home/Collect/isCollect',{goods_id: _this.params.goodsId},function(response){
        		if(response.error_code === 0){
        			if(response.data.status === 0){
        				$("#collect").removeClass("active");
        			}else if(response.data.status === 1){
        				$("#collect").addClass("active");
        			}
        		}
        	});
        },
        addCollect: function(){
        	var _this = this;
        	Pub.post('/Home/Collect/add',{goods_id: _this.params.goodsId},function(response){
        		if(response.error_code === 0){
        			cloud.explain('收藏成功！','success',2000);
        		}
        	});
        },
        cancelCollect: function(){
        	var _this = this;
        	Pub.post('/Home/Collect/cancel',{goods_id: _this.params.goodsId},function(response){
        		if(response.error_code === 0){
        			cloud.explain('您已取消收藏了！','',2000);
        		}
        	});
        },
        initEvent: function() {
            var _this = this;
            //商品
            $('#shangpin').on('click', function() {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                $('#shangpin_show').fadeIn();
                $('#xiangqing_show').hide();
                $('#pingjia_show').hide();
                $('html,body').scrollTop(0);
            });
            //详情
            $('#xiangqing,#btn_content').on('click', function() {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                $('#shangpin_show').hide();
                $('#xiangqing_show').fadeIn();
                $('#pingjia_show').hide();
                $('html,body').scrollTop(0);
                var contCache = sessionStorage.getItem('goodCont');
                if (contCache != '' && contCache != null) {
                    _this.goodsCont(contCache);
                } else {
                    _this.contentData();
                }
                $('#xiangqing').siblings().removeClass('active');
                $('#xiangqing').addClass('active');
            });
            //评价
            $('#pingjia').on('click', function() {
                $(this).siblings().removeClass('active');
                $(this).addClass('active');
                $('#shangpin_show').hide();
                $('#xiangqing_show').hide();
                $('#pingjia_show').fadeIn();
                $('html,body').scrollTop(0);
            });
            //数量加减
            $('.num_minus').on('click', function() {
                if (_this.params.inputNum > 1 && _this.params.inputNum < (parseInt(_this.params.goodsStore)) + 1) {
                    $('.num_plus').removeClass('disabled');
                    $('.num_value').val(--_this.params.inputNum);
                } else if (parseInt(_this.params.inputNum) === 1) {
                    $(this).addClass('disabled');
                    cloud.msg('商品数量不能小于1', '80%', 2000);
                }
                _this.params.goodsNum = $('.num_value').val();
            });
            $('.num_plus').on('click', function() {
                if (_this.params.inputNum > 0 && _this.params.inputNum < _this.params.goodsStore) {
                    $('.num_minus').removeClass('disabled');
                    $('.num_value').val(++_this.params.inputNum);
                } else if (parseInt(_this.params.inputNum) === parseInt(_this.params.goodsStore)) {
                    $('.num_plus').addClass('disabled');
                    cloud.msg('您选购的商品超出了库存啦', '80%', 2000);
                }
                _this.params.goodsNum = $('.num_value').val();
            });
            //收藏
            $('#collect').on('click',function(){
            	if($(this).is('.active')){
            		$(this).removeClass('active');
            		_this.cancelCollect();
            	}else{
            		$(this).addClass('active');
            		_this.addCollect();
            	}
            });
            //加入购物车
            $('#btn_cart').on('click', function() {
                $('#cart_shade').fadeIn();
                $('#cart_show').slideDown();
                $('html').css("overflow-y", "hidden");               
            });
            $('#cart_shade').on('click', function() {
                $('#cart_show').slideUp();
                $('#cart_shade').fadeOut();
                $('html').css("overflow-y", "auto");
            });
            $('#sub_cart').on('click',function(){
            	if(_this.params.specList != ''){      		
            		for(var i in _this.params.goodsSpec){
            			if(_this.params.goodsSpec.hasOwnProperty(i)){
            				if(_this.params.goodsSpec[i] === null){
            					cloud.msg('请选择'+i+'参数','80%',2000);
            					return false;
            				}
            			}
            		}
            	}
            	_this.cartPostData();           	

            });
            //立即购买
            $('#btn_buy').on('click', function() {
                $('#buy_shade').fadeIn();
                $('#buy_show').slideDown();
                $('html').css("overflow-y", "hidden");               
            });
            $('#buy_shade').on('click', function() {
                $('#buy_show').slideUp();
                $('#buy_shade').fadeOut();
                $('html').css("overflow-y", "auto");
            });
            $('#sub_buy').on('click',function(){
            	if(_this.params.specList != ''){      		
            		for(var i in _this.params.goodsSpec){
            			if(_this.params.goodsSpec.hasOwnProperty(i)){
            				if(_this.params.goodsSpec[i] === null){
            					cloud.msg('请选择'+i+'参数','80%',2000);
            					return false;
            				}
            			}
            		}
            	}
            	_this.buyPostData();           	

            });
            // var backUrl = document.referrer;
            // var backAppid = backUrl.indexOf('appid');
            // console.log(backAppid);
            // console.log(typeof(backAppid));
            // $('.return').on('click',function(){
            //     if(backAppid !== -1 ){
            //     window.history.go(-2);   
            // }else{
            //     window.history.go(-1);
            // }
            // });
            
        }
    };
    return new Page();
})(jQuery, window, document)

