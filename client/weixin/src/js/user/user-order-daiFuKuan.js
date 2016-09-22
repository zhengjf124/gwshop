(function($) {
    function Page() {
        this.init();
    }
    Page.prototype = {
        init: function() {
            this.initEvent();
            this.getData();
        },
        getData: function() {
            var self = this;
            Pub.post('/Home/order/index', {}, function(response) {
                if (response.error_code == 0) {
                    self.orderList(response.data.list);
                    self.initEv();
                }
            });
        },
        orderList: function(data) {
            $("#order_list").empty();
            var html = '';
            if (data && data.length > 0) {
                for (var i in data) {
                    if (data[i].order_status == 100) {
                        html += '<div class="order-item">' +
                            '<div class="order-status">' +
                            '<a href="' + Pub.getHtmlUrl('html/user/user-order-cont.html') + '?id=' + data[i].id + '">' +
                            '<span>' + data[i].order_sn + '</span>' +
                            '<strong>待付款</strong>' +
                            '</a>' +
                            '</div>' +
                            '<div class="complete-goods">' +
                            '<a href="' + Pub.getHtmlUrl('html/user/user-order-cont.html') + '?id=' + data[i].id + '"><ul>';
                        for (var j in data[i].goods) {
                            html += '<li>' +
                                '<div class="img"><span></span><img src="' + data[i].goods[j].goods_img + '">' +
                                '</div>' +
                                '<div class="info">' +
                                '<div class="name">' +
                                '<h4>' + data[i].goods[j].goods_name + '</h4>' +
                                '</div>' +
                                '<div class="sizes">';
                            var str = data[i].goods[j].spec_key_name.split(" ");
                            for (var k in str) {
                                html += '<h4>' + str[k] + '</h4>';
                            }
                            html += '</div>' +
                                '<div class="price">' +
                                '<h4>￥ ' + data[i].goods[j].goods_price + '</h4>' +
                                '<h3>X ' + data[i].goods[j].goods_num + '</h3>' +
                                '</div>' +
                                '</div>' +
                                '</li>';
                        }
                        html += '</ul></a>' +
                            '<div class="complete-total">' +
                            '<h3 style="text-align: right;">实付款： <span>￥ ' + data[i].order_amount + '</span></h3>' +
                            '</div>' +
                            '<div class="handle">' +
                            '<button class="order-cancel" data-index="' + data[i].id + '">取消订单</button><button class="order-pay" data-index="' + data[i].id + '">立即支付</button>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                    }
                }
                $("#order_list").append(html);
            }
        },
        // 相关事件
        initEvent: function() {
            //订单栏目显示
            $("#order_menu").on("click", function() {
                $("#order_menu_show").show();
                $("#order_menu_black").show();
            })
            $("#order_menu_black").on("click", function() {
                $("#order_menu_show").hide();
                $("#order_menu_black").hide();
            })
        },
        initEv: function() {
            var _this = this;
            // 立即支付
            $(".order-pay").on("click", function() {
                var index = $(this).attr("data-index");
                var self = this;
                Pub.post('/Home/Pay/toPay', {
                    order_id: index
                }, function(response) {
                    console.log(response);
                    if (response.error_code == 0) {
                        _this.payCall(response.data.jsApiParameters);
                    } else { //支付接口没调成功，应该跳到订单列表在次支付
                        cloud.msg(response.message, '50%', 2000);
                    }
                });
            });

            // 取消订单
            $(".order-cancel").on("click", function() {
                var index = $(this).attr("data-index");
                var self = this;
                cloud.asked('您确定要取消订单吗', function() {
                    Pub.post('/Home/order/cancel', {
                        id: index
                    }, function(response) {
                        if (response.error_code === 0) {
                            cloud.explain('订单已取消！', 'success', 2000);
                            $(self).parent().parent().parent().fadeOut();
                        }
                    });

                }, function() {
                    cloud.msg('您选择了取消', '50%', 2000);
                });

            });
        },
        //微信支付
        apiCall: function(str) {
            var obj = jQuery.parseJSON(str);
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                obj,
                function(res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        cloud.explain('支付成功！！！', 'success', 3000);
                        setTimeout(function() {
                            location.href = Pub.getHtmlUrl('html/user/user-order.html');
                        }, 3000);
                    } else {
                        cloud.explain('支付失败！！！', 2000);
                        setTimeout(function() {
                            location.reload();
                        }, 3000);
                    }
                }
            );
        },
        payCall: function(data) {
            var _this = this;
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', _this.apiCall(data), false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', _this.apiCall(data));
                    document.attachEvent('onWeixinJSBridgeReady', _this.apiCall(data));
                }
            } else {
                _this.apiCall(data);
            }
        }

    }

    // 实例化Page方法
    new Page();
})(jQuery)
