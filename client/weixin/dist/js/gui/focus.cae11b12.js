$(function(){var n=[{img:"../images/banner1.jpg",name:"banner1"},{img:"../images/banner2.jpg",name:"banner2"},{img:"../images/banner3.jpg",name:"banner3"},{img:"../images/banner4.jpg",name:"banner4"},{img:"../images/banner5.jpg",name:"banner5"}];$("#banner ul").html(""),$.each(n,function(n,e){var a='<li class="swiper-slide"><img src="'+e.img+'" alt="'+e.name+'" /></li>';$("#banner ul").append(a)});var e=new Swiper(".swiper1",{pagination:".pagination1",loop:!0,grabCursor:!0});$(".arrow-left").click(function(n){n.preventDefault(),e.swipePrev()}),$(".arrow-right").click(function(n){n.preventDefault(),e.swipeNext()}),$(".pagination1 .swiper-pagination-switch").click(function(){e.swipeTo($(this).index())})});