!function(t){t.shopCart=function(i){function e(){var e=0,a=0,n=new Array,l=0;t("#"+i.shopCartBoxId+" li").each(function(){var i=t(this).find("input[cartlevel=2]").prop("checked");if(i){var r=parseFloat(t(this).find(".CartShopPrice").html()),o=parseInt(t(this).find(".Input_CartListNum").val()),s=parseFloat((r*o).toFixed(2));e=(parseFloat(e)+s).toFixed(2),a++,n[l]=parseInt(t(this).find("input[cartlevel=2]").val()),l++}}),t("#selectNum").html(a),r.html("￥"+e);var o=JSON.stringify(n);localStorage.setItem("CartIdArray",o)}var a=t("#"+i.shopCartBoxId),r=t("#"+i.TotalAmountBoxId);this.starShoppingCart=function(){t("input[cartlevel=1]").bind("click",function(){var i=a.find("input[cartlevel=2]");t(this).prop("checked")?i.prop("checked",!0):i.prop("checked",!1),e()}),a.delegate("input[cartlevel=2]","click",function(){e()}),a.delegate(".bt_CartPlus","click",function(){var i=t(this).parent().find(".Input_CartListNum"),a=parseInt(i.val()),r=t(this).parents("li").find(".CartShopPrice"),n=t(this).parents("li").find(".CartListTotalAmount"),l=parseFloat(r.html());a++,i.val(a);var o=(l*a).toFixed(2);n.text(o),t(this).parents("li").find(".goods_num").html(a),e()}),a.delegate(".bt_CartReduce","click",function(){var i=t(this).parent().find(".Input_CartListNum"),a=parseInt(i.val()),r=t(this).parents("li").find(".CartShopPrice"),n=t(this).parents("li").find(".CartListTotalAmount"),l=parseFloat(r.html());a--,a<1&&(a=1),i.val(a);var o=(l*a).toFixed(2);n.text(o),t(this).parents("li").find(".goods_num").html(a),e()}),a.delegate(".delCartList","click",function(){var i=confirm("确定删除此商品吗？");if(i){var a=t(this).parents("li").find("input[cartlevel=2]"),r=a.val(),n=t(this).parents("li");Pub.post("/Home/Cart/delete",{id:r},function(t){0==t.error_code&&(n.remove(),webToast("删除成功","middle",2e3))}),e()}})}}}(jQuery);