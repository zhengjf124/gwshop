!function(e,r,o,i){var s=function(){this.init()};s.prototype={params:{userName:"",password:""},init:function(){this.formCheck(),this.rmbUser(),this.initEvent()},rmbUser:function(){"true"==e.cookie("rmbUser")&&(e("#remember").attr("checked",!0),e("#user_name").val(e.cookie("username")),e("#user_pwd").val(e.cookie("password")))},formCheck:function(){e("#login_form").Validform({tiptype:function(e,r,o){if(!r.obj.is("form")){var i=r.obj.parents(".box-check").find(".Validform-info").children(".Validform_checktip");o(i,r.type),i.text(e);var s=r.obj.parents(".box-check").find(".Validform-info");if(2==r.type)s.hide();else{if(s.is(":visible"))return;r.obj.offset().left,r.obj.offset().top;s.css({right:"-200px",top:"-34px"}).show().animate({right:"3px"},200)}}},usePlugin:{passwordstrength:{minLen:6,maxLen:18,trigger:function(e,r){r||e.parents(".box-check").find(".Validform-info").hide()}}}})},postData:function(){var o=this;Pub.post("/Home/Login/login",{user_name:o.params.userName,password:o.params.password},function(o){if(0===parseInt(o.error_code)){cloud.explain("恭喜您，登录成功！","success",2e3),Pub.setSession("_passport",o.data.passport);var i=Pub.getSession("returnLink");if(null===i){var s=Pub.getHtmlUrl("html/user/user-info-4973f2b554.html");setTimeout(function(){r.location.href=s},3e3)}else setTimeout(function(){r.location.href=i},3e3)}else 10006===parseInt(o.error_code)&&(cloud.explain("密码错误！","",2e3),e("#user_pwd").val(""))})},initEvent:function(){var r=this;e("#btn_login").on("click",function(){if(r.params.userName=e("#user_name").val(),r.params.password=e("#user_pwd").val(),""===r.params.userName||""===r.params.password?cloud.explain("请填写完整信息再提交！","",2e3):r.postData(),e("#remember").attr("checked")){var o=e("#user_name").val(),i=e("#user_pwd").val();e.cookie("rmbUser","true",{expires:7}),e.cookie("username",o,{expires:7}),e.cookie("password",i,{expires:7})}else e.cookie("rmbUser","false",{expire:-1}),e.cookie("username","",{expires:-1}),e.cookie("password","",{expires:-1})}),e("#user_name").on("blur",function(){r.params.userName=e("#user_name").val();var o=this;return Pub.post("/Home/Login/checkUserNameLog",{user_name:r.params.userName},function(r){0===parseInt(r.error_code)?(e(o).siblings(".Validform-info-check").find(".Validform_checktip").removeClass("Validform_wrong").addClass("Validform_right").text("验证通过"),e(o).siblings(".Validform-info-check").fadeOut()):102===parseInt(r.error_code)&&(e(o).siblings(".Validform-info-check").find(".Validform_checktip").removeClass("Validform_right").addClass("Validform_wrong").text("用户名不存在"),e(o).siblings(".Validform-info-check").css({right:"-200px",top:"-34px"}).show().animate({right:"3px"},200))}),!1}),e("#to_index").on("click",function(){var e=Pub.getHtmlUrl("html/index.html");location.href=e}),e("#to_register").on("click",function(){var e=Pub.getHtmlUrl("html/user/register-ef8aaf9961.html");location.href=e})}};new s}(jQuery,window,document);