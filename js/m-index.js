$(function () {

    moveSlideM("#m-answer-turn1",".js-answer-change",".js-answer-circle","circle-s",4000,7.5);
    moveSlideM("#m-answer-turn2",".js-answer-change1",".js-answer-circle1","circle-s",4000,7.5);

    $("#js-feature-change").find("li").each(function (i,elem) {
        $(this).click(function () {
            $(".index-feature-content-top").hide();
            $(".index-feature-content-top").eq(i).show();
            $("#js-feature-change").find("li").removeClass("active")
            $(this).addClass("active")
        })
    })
    $(".m-tab-nav-s").find("li").each(function (i,elem) {
        $(this).click(function () {
            $(".index-works-pic").hide();
            $(".index-works-pic").eq(i).show();
            $(".m-tab-nav-s").find("li").removeClass("active")
            $(this).addClass("active")
        })
    })


    //旋转木马
    // 初始化
    var imgNum = $(".index-score-item3").size();
    var item0 = $(".index-score-item3").eq(0);
    var item1 = $(".index-score-item3").eq(1);
    var item2 = $(".index-score-item3").eq(2);
    item0.attr("class","index-score-item0");
    item1.attr("class","index-score-item1");
    item2.attr("class","index-score-item2");

    //手机左右滑动翻页
    var startX,startY,moveX,moveY;
    var d = $(".index-score-item").get(0);
    var boo = true;
    var indexScore = 1;
    function touchstart(e) {
        var target = e.targetTouches[0];
        startX = target.clientX;
        startY = target.clientY;
    }

    function touchmove(e) {
        var target = e.targetTouches[0];
        moveX = target.clientX;
        moveY = target.clientY;

        var x = moveX - startX,
            y = moveY - startY;

        // 如果x>0并且x轴上移动的距离大于y轴上移动的距离
        if(Math.abs(x) > Math.abs(y) && x > 0){    //右滑
            if(boo) {
                boo = false;
                if(indexScore==0){
                    indexScore = imgNum-1;
                }else{
                    indexScore--;
                }
                $(".js-score-circle").removeClass("circle-s");
                $(".js-score-circle").eq(indexScore).addClass("circle-s");
                if(imgNum>3){
                    $(".index-score-item2").attr("class","index-score-item3");
                    $(".index-score-item1").attr("class","index-score-item2");
                    $(".index-score-item0").attr("class","index-score-item1");
                    $(".index-score-item3").eq($(".index-score-item3").size()-1).attr("class","index-score-item0");
                    $('.index-score-item0').eq(0).insertAfter( $(".left-btn") );
                }else if(imgNum == 3){

                    $(".index-score-item2").attr("class","index-score-item0");
                    $(".index-score-item1").attr("class","index-score-item2");
                    $(".index-score-item0").eq(0).attr("class","index-score-item1");
                    $('.index-score-item0').insertAfter( $(".left-btn") );

                }else{
                    console.log("图片数量不足3张,旋转轮播无法正常轮播");
                }



                setTimeout(function () {
                    boo = true;
                }, 500)
            }

        }
        else if(Math.abs(x) > Math.abs(y) && x < 0){   //左滑
            if(boo){
                boo = false;
                if(indexScore==imgNum-1){
                    indexScore = 0;
                }else{
                    indexScore++;
                }
                $(".js-score-circle").removeClass("circle-s");
                $(".js-score-circle").eq(indexScore).addClass("circle-s");
                if(imgNum>3){
                    $(".index-score-item0").attr("class","index-score-item3");
                    $(".index-score-item1").attr("class","index-score-item0");
                    $(".index-score-item2").next().attr("class","index-score-item2");
                    $(".index-score-item2").eq(0).attr("class","index-score-item1");
                    $('.index-score-item3').eq(0).insertBefore( $(".right-btn") );
                }else if(imgNum == 3){
                    $(".index-score-item0").attr("class","index-score-item2");
                    $(".index-score-item1").attr("class","index-score-item0");
                    $(".index-score-item2").eq(1).attr("class","index-score-item1");
                    $(".index-score-item2").insertBefore( $(".right-btn") );
                }else{
                    console.log("图片数量不足3张,旋转轮播无法正常轮播");
                }


                setTimeout(function () {
                    boo = true;
                },500)
            }


        }
    }

    // 轮番图手指左右滑动
    d.addEventListener('touchstart',touchstart);
    d.addEventListener('touchmove',touchmove);
})