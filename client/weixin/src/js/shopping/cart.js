;
(function($, window, document, undefined) {
    var Page = function() {
        this.init();
    };
    Page.prototype = {
        params: {
            cart_total: [],
            cartId_all: [],
            price_total: 0,
            list_data: {},
            goodsParams: []

        },
        init: function() {
            this.getData();
        },
        getData: function() {
            var _this = this;
            Pub.post('/Home/Cart/index', {}, function(response) {
                if (response.error_code === 0) {
                    _this.params.list_data = response.data.list;
                    _this.cartList(response.data.list);
                    _this.cartIdAll(response.data.list);
                    _this.initEvent();

                }
            });
        },
        cartList: function(data) {
            $('#cart_list').empty();
            var html = '';
            if (data && data.length > 0) {
                for (var i in data) {
                    html += '<li>' +
                        '<div class="check">' +
                        '<label data-index="' + data[i].id + '"><i>&#xe619;</i></label>' +
                        '</div>' +
                        '<div class="img">' +
                        '<a href="'+Pub.getHtmlUrl('html/goods/cont.html')+'?id='+data[i].goods_id+'"><span></span><img src="' + data[i].goods_img + '"></a>' +
                        '</div>' +
                        '<div class="info">' +
                        '<a class="edit" data-count="' + data[i].store_count + '">编辑</a>' +
                        '<div class="name">' +
                        '<h3>' + data[i].goods_name + '</h3>' +
                        '</div>' +
                        '<div class="sizes">';
                    var spec = data[i].spec_key_name.split(' ');
                    for (var j in spec) {
                        html += '<p>' + spec[j] + '</p>';
                    }
                    html += '</div>' +
                        '<div class="price"><span>￥ <font>' + data[i].goods_price + '</font><del>￥' + data[i].market_price + '</del></span><em>X <font>' + data[i].goods_num + '</font></em></div>' +
                        '<div class="edit-sizes">' +
                        '<span>';
                    for (var j in spec) {
                        html += '<label>' + spec[j] + '</label>';
                    }
                    html += '</span><i>&#xe6d8;</i > ' +
                        '</div>' +
                        '<div class="edit-container">' +
                        '<div class="qty">' +
                        '<button class="num-minus"><i>&minus;</i></button><input type="text" value="' + data[i].goods_num + '" class="num-number" /><button class="num-plus"><i>&#43;</i></button>' +
                        '</div>' +
                        '<a class="delect" data-index="' + data[i].id + '">删除</a>' +
                        '</div>' +
                        '</div>' +
                        '</li>';
                }
                $('#cart_list').append(html);
            } else {
                $('#cart_list').append(html);
            }
        },
        initEvent: function() {
            var _this = this;

            //选择商品
            $('.check label').on('click', function() {
                var index = $(this).attr('data-index'),
                    goodPrice = $(this).parent().siblings('.info').find('.price').find('span').find('font').text(),
                    goodNum = $(this).parent().siblings('.info').find('.price').find('em').find('font').text(),
                    goodPriceTotal = (goodPrice * goodNum).toFixed(2);
                if ($(this).is('.active')) {
                    $(this).removeClass('active');
                    $('.check-total label').removeClass('active');
                    var index = $(this).attr('data-index');
                    _this.params.cartId_all = Pub.deleteByValue(_this.params.cartId_all, index);
                    _this.params.price_total -= parseFloat(goodPriceTotal);
                    $('#total_price').text(_this.params.price_total.toFixed(2));
                    _this.countNum();
                    var ali = $('#cart_list li');
                    if($('#count_num').text() != ali.length){
                       $('.check-total label').removeClass('active'); 
                       $('#del_all').css('visibility','hidden');
                    }

                } else{
                    $(this).addClass('active');
                    _this.params.cartId_all.push(index);
                    _this.params.price_total += parseFloat(goodPriceTotal);
                    $('#total_price').text(_this.params.price_total.toFixed(2));
                    _this.countNum();
                    var ali = $('#cart_list li');
                    if($('#count_num').text() == ali.length){
                       $('.check-total label').addClass('active'); 
                       $('#del_all').css('visibility','visible');
                    }
                }
            });

            //全选
            $('.check-total label').on('click', function() {
                if ($(this).is('.active')) {
                    $(this).removeClass('active');
                    $('.check label').removeClass('active');
                    _this.params.cartId_all = [];
                    $('#total_price').text('0');
                    _this.countNum();
                    $('#del_all').css('visibility','hidden');
                } else {
                    $(this).addClass('active');
                    $('.check label').addClass('active');
                    _this.params.cartId_all = _this.params.cart_total;
                    _this.priceTotal(_this.params.list_data);
                    $('#total_price').text(_this.params.price_total.toFixed(2));
                    _this.countNum();
                    $('#del_all').css('visibility','visible');
                }

            });
            //结算           
            $('#submit_balance').on('click', function() {
                if ($('#count_num').text() > 0 && $('.cart-edit').text() === '编辑全部') {
                    _this.postData();
                }else if($('#count_num').text() == 0){
                    cloud.explain('请您先选择商品，再结算！',3000);
                }else if($('.cart-edit').text() == '完成'){
                    cloud.explain('请您编辑完成后，再结算！',3000);
                }
            });
            // 数量加减
            $(".num-minus").on('click', function() {
                var input = $(this).siblings('input');
                var quantity = parseInt(input.val());
                if (quantity > 1) {
                    input.val(--quantity);
                    $(this).removeClass('disabled');
                } else {
                    $(this).addClass('disabled');
                }
            });
            $(".num-plus").on('click', function() {
                var input = $(this).siblings('input');
                var quantity = parseInt(input.val());
                input.val(++quantity);
            });
            //编辑
            $('.edit').on('click', function() {
                var num = $(this).siblings('.edit-container').find('.qty').find('.num-number').val();
                var count = $(this).attr('data-count');
                var cartId = $(this).parent().siblings('.check').find('label').attr('data-index');

                if ($(this).text() === '编辑') {
                    $(this).text('完成');
                    $(this).siblings('.sizes').hide();
                    $(this).siblings('.price').hide();
                    $(this).siblings('.edit-sizes').show();
                    $(this).siblings('.edit-container').show();
                    $(this).attr('data-boolean','true');
                } else {
                    $(this).text('编辑');
                    $(this).siblings('.sizes').show();
                    $(this).siblings('.price').show();
                    $(this).siblings('.edit-sizes').hide();
                    $(this).siblings('.edit-container').hide();
                    $(this).attr('data-boolean','false');
                    if (num <= parseInt(count)) {
                        num = num;
                    } else if (num > parseInt(count)) {
                        num = count;
                    }
                    $(this).siblings('.price').find('em').find('font').text(num);
                    Pub.post('/Home/Cart/editGoods', { goods: [{ cart_id: cartId, goods_num: num }] }, function(response) {
                        if (response.error_code === 0) {}
                    });
                }
            });
            //编辑全部
            $('.cart-edit').on('click', function() {
                if ($(this).text() === '编辑全部') {
                    $(this).text('完成');
                    $('#cart_list li').find('.edit').hide();
                    $('#cart_list li').find('.sizes').hide();
                    $('#cart_list li').find('.price').hide();
                    $('#cart_list li').find('.edit-sizes').show();
                    $('#cart_list li').find('.edit-container').show();
                    $('#del_all').css('visibility','visible');
                } else {
                    $(this).text('编辑全部');
                    $('#cart_list li').find('.edit').show();
                    $('#cart_list li').find('.sizes').show();
                    $('#cart_list li').find('.price').show();
                    $('#cart_list li').find('.edit-sizes').hide();
                    $('#cart_list li').find('.edit-container').hide();
                    $('#del_all').css('visibility','hidden');
                    $('#cart_list li').each(function() {
                        var id = $(this).find('.check').find('label').attr('data-index');
                        var num = $(this).find('input').val();
                        var count = $(this).find('.info').find('.edit').attr('data-count');
                        if (num <= parseInt(count)) {
                            num = num;
                        } else if (num > parseInt(count)) {
                            num = count;
                        }
                        $(this).find('.price').find('font').text(num);
                        _this.params.goodsParams.push({ cart_id: parseInt(id), goods_num: parseInt(num) });
                    });                   
                    Pub.post('/Home/Cart/editGoods', { goods: _this.params.goodsParams }, function(response) {
                        if (response.error_code === 0) {
                        }
                    });
                    
                }


            });


            //删除
            $('.delect').on('click', function() {
                var self = this;
                var cartId = $(this).attr('data-index');
                cloud.asked('您确定要删除吗？', function() {
                    _this.delectGood(cartId,function(){
                        $(self).parent().parent().parent().fadeOut();
                    });
                    
                }, function() {
                    cloud.msg('您选择了“取消”！', '50%', 2000);
                });
            })
            //删除全部
            $('#del_all').on('click',function(){
                cloud.asked('您确定要删除吗？', function() {
                    _this.delectGood(_this.params.cartId_all,function(){
                        $('#cart_list').fadeOut();
                    });
                }, function() {
                    cloud.msg('您选择了“取消”！', '50%', 2000);
                });
            });

        },
        cartIdAll: function(data) {
            var _this = this;
            if (data && data.length > 0) {
                var cartId = 0;
                for (var i = 0; i < data.length; i++) {
                    cartId = data[i].id;
                    _this.params.cart_total.push(cartId);
                }

            }
        },
        postData: function() {
            var _this = this;           
            Pub.post('/Home/order/confirm', { cart_id: _this.params.cartId_all }, function(response) {
                var self = _this;
                if (response.error_code === 0) {
                    var cartIdAll = JSON.stringify(_this.params.cartId_all);
                    localStorage.setItem('cartIds', cartIdAll);
                    location.href = Pub.getHtmlUrl('html/shopping/balance.html');
                }
            });

        },
        priceTotal: function(data) {
            var _this = this;
            _this.params.price_total = 0;
            if (data && data.length > 0) {
                var goodsPrice = 0;
                for (var i = 0; i < data.length; i++) {
                    goodsPrice = data[i].goods_price * data[i].goods_num;
                    _this.params.price_total += goodsPrice;
                }

            }
        },
        delectGood: function(data,callback){
            Pub.post('/Home/Cart/delete', { id: data }, function(response) {
                if (response.error_code === 0) {
                    cloud.explain('删除成功！', 'success', 2000);
                }
            });
            callback();
        },
        countNum: function() {
            var selectNum = 0;
            $('.check label').each(function() {
                if ($(this).is('.active')) {
                    ++selectNum;
                }
            })
            $('#count_num').text(selectNum);
        }

    };
    new Page();
})(jQuery, window, document);



// var password = '';
// $('#cartList').html('');
// $('#selectNum').html(0);

// $(document).ready(function() {


//  /*
//  //判断是否已经缓存登录
//  if(localStorage.password == undefined){
//      password = GetLogin();
//  }else{
//      password = localStorage.getItem("password"); 
//      //alert(password);  
//  }
//  //登录模块
//  function GetLogin(){
//      Pub.post(website+'/Home/Login/login', {user_name:'lihoqi',password:'3593256'}, function(response){
//          if (response.error_code == 0) {
//              //console.log(response);                    
//              localStorage.setItem("password",response.data.passport);
//              return response.data.passport;
//              //var value = localStorage.getItem("password"); 
//              //alert(value);
//          }
//      }); 
//  }
//  */

//  GetCart();//获取购物车列表


//  var cart = new $.shopCart({     
//      shopCartBoxId:'cartList',//订单列表根目录ID
//      TotalAmountBoxId:'TotalAmount',//用于存放计算总金额的ID
//  });

//  cart.starShoppingCart();


//  //显示所有编辑
//  $('.cart-edit').click(function(){
//      var dataShowAll = $(this).attr('dataShow');
//      if(dataShowAll == 1){
//          $('#cartList').find('.editBox').each(function(){
//              $(this).hide(); 
//          });

//          var goods = new Array();
//          var goodsKey = 0;

//          $('#cartList li').each(function(){

//              goods[goodsKey] = {};

//              var buyNum = $(this).find('.Input_CartListNum').val();
//              var carId = $(this).find('input[cartlevel=2]').val();   

//              goods[goodsKey] = {cart_id:carId,goods_num:buyNum};     
//              goodsKey++ ;                
//          });

//          //console.log(goods);
//          changeCartNum(goods);//更新商品数量           

//          $(this).attr('dataShow',0);
//          $(this).text('编辑全部');
//      }else{
//          $('#cartList').find('.editBox').each(function(){
//              $(this).show(); 
//          });
//          $(this).attr('dataShow',1);
//          $(this).text('完成编辑');
//      }

//  });

//  //编辑显示
//  $('#cartList').delegate(".edit","click",function(){

//      var dataShowAll = $('.cart-edit').attr('dataShow');
//      if(dataShowAll == 1){//如果编辑全部被单击就不能用单个编辑
//          return;
//      }   

//      $(this).parent().find('.editBox').show();
//      $(this).html('完成');
//      $(this).addClass('edit_ok');

//      //$('.editBox').show();
//  })


//  //编辑完成
//  $('#cartList').delegate(".edit_ok","click",function(){
//      $(this).html('编辑');
//      $(this).removeClass('edit_ok');
//      var goods = new Array();
//      var buyNum = $(this).parents('li').find('.Input_CartListNum').val();
//      var carId = $(this).parents('li').find('input[cartlevel=2]').val();

//      goods[0] = {};

//      goods[0] = {cart_id:carId,goods_num:buyNum};

//      //console.log(goods);
//      changeCartNum(goods);//更新商品数量


//      $(this).parents('li').find('.editBox').hide();

//      //$('.editBox').show();
//  })



//  //更新购物车商品数量
//  function changeCartNum(goods){
//      Pub.post('/Home/Cart/editGoods', {/*_passport:password,*/goods:goods}, function(response) {
//          if (response.error_code == 0) {
//              //console.log(response);
//              webToast("恭喜您，修改成功","middle",2000);
//          }else{
//              webToast(response.message,"middle",2000);
//          }
//          //console.log(response);
//      }); 
//  }

//  //获取购物车商品信息
//  function GetCart(){
//      Pub.post('/Home/Cart/index', {/*_passport:password*/}, function(response) {
//          if (response.error_code == 0) {
//              console.log(response);

//              $('#cart_list').html('');
//              var cartHtml = '';

//              $.each(response.data.list, function(key, value) {

//                  cartHtml += '<li>'+
//                              '<div class="check">'+
//                                  '<label><input name="" type="checkbox" value="'+value.id+'" cartlevel="2" class="check"></label>'+
//                              '</div>'+
//                              '<div class="img">'+
//                                  '<span></span><img src="'+value.goods_img+'">'+//图片
//                              '</div>'+
//                              '<div class="info">'+
//                                      '<a class="edit">编辑</a>'+
//                                      '<div class="name">'+
//                                          '<h3>'+value.goods_name+'</h3>'+//名称
//                                      '</div>'+
//                                      '<div class="sizes">'+
//                                          '<p>'+value.spec_key_name+'</p>'+//规格属性
//                                          //'<p>规格：1920*1200</p>'+
//                                      '</div>'+
//                                      '<div class="CartShopPrice" style="display:none">'+value.goods_price+'</div>'+//单价
//                                      '<div class="price"><span>￥ <span class="CartListTotalAmount">'+value.goods_price+'</span><del>￥'+value.market_price+'</del></span><em>X <i class="goods_num">'+value.goods_num+'</i></em></div>'+
//                                      '<!--编辑-->'+
//                                      '<div class="editBox" style="display:none">'+
//                                          '<div class="edit-sizes">'+
//                                              '<span><label>属性：白色</label><label>规格：1920*1200</label></span><i>&#xe6d8;</i>'+
//                                          '</div>'+
//                                          '<div class="edit-container">'+
//                                              '<div class="qty">'+
//                                                  '<button class="bt_CartReduce"><i>&minus;</i></button><input class="Input_CartListNum" type="text" value="'+value.goods_num+'" /><button class="bt_CartPlus"><i>&#43;</i></button>'+
//                                              '</div>'+
//                                              '<a class="delect delCartList">删除</a>'+
//                                          '</div>'+
//                                      '</div>'+
//                                      '<!--编辑:over-->'+
//                                  '</div>'+
//                              '</li>'

//              }); //  end each

//              $('#cartList').append(cartHtml);

//          }
//      }); 
//  }

//  /*
//  //添加到购物车
//  addCart();
//  function addCart(){
//      Pub.post('http://gwshop.usrboot.com/Home/Cart/add', {goods_id:5,goods_num:1,_passport:password,goods_spec:{'内存':1,'颜色':3}}, function(response) {
//          if (response.error_code == 0) {
//              console.log(response);
//          }
//      });
//  }*/





// })
