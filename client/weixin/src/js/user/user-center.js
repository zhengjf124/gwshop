/*
 * 用户中心逻辑
 */
(function($) {

    function Page() {
        this.init();
    }
    Page.prototype = {
        init: function() {
            this.getData();
            this.getNum();
        },
        getData: function() {
            Pub.post("/Home/user/detail").then(function(response) {
                if(response.error_code === 0){
                    $("#nick_name").html(response.data.nick_name);
                    $("#avatar").attr('src',response.data.headimgurl);
                }
            });
        },
        getNum: function(){
            Pub.post('/Home/user/center',{},function(response){
                if(response.error_code === 0){
                    console.log(response);
                    $('#favorites_num').text(response.data.collect);
                    $('#integral_num').text(response.data.credit);
                    $('#coupon_num').text(response.data.coupons);
                    $('#distribution_num').text(response.data.distribute);
                }
            });
        },
        //相关事件绑定及操作
        initEvent: function() {
            
        }
    };

    $(document).ready(function() {
        var page = new Page();
    });

})(jQuery);
