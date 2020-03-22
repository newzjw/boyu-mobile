window.onload = function(){

    //为jq添加获取原始宽高的方法
    (function($){
        var
            props = ['Width', 'Height'],
            prop;

        while (prop = props.pop()) {
            (function (natural, prop) {
                $.fn[natural] = (natural in new Image()) ?
                    function () {
                        return this[0][natural];
                    } :
                    function () {
                        var
                            node = this[0],
                            img,
                            value;

                        if (node.tagName.toLowerCase() === 'img') {
                            img = new Image();
                            img.src = node.src,
                                value = img[prop];
                        }
                        return value;
                    };
            }('natural' + prop, prop.toLowerCase()));
        }
    }(jQuery));

    var windowHeight2 = $(window).height();
    $(".easyDialogWrapper-div2").css("height",windowHeight2);
    waterfall();
    dialog();
    var onOff = true;
    var startImgNum,endImgNum,newImg,newItem;

    //手机左右滑动翻页
    var index = 0;
    var startX,startY,moveX,moveY;
    var d = $(".easyDialogWrapper-div2").get(0);
    var boo = true;
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
        if(Math.abs(x) > Math.abs(y) && x > 0){
            if(boo) {
                boo = false;
                if (index < 1) {              //如果是第一张，跳到最后一张
                    index = $(".grid").find("img:eq(0)").size() - 1;
                } else {
                    index--;
                }

                urlImg = $(".grid").eq(index).find("img").eq(0).attr("src");

                var viewWidth = $(window).width()*0.9;
                var viewHeight = $(window).height()*0.8;

                var imgWidth = $(".grid").eq(index).find("img").eq(0).naturalWidth();
                var imgHeight = $(".grid").eq(index).find("img").eq(0).naturalHeight();

                var ratio = viewWidth/viewHeight; //图片显示区域宽高比
                var ratio1 = imgWidth/imgHeight; //图片原始宽高比

                if(imgWidth>viewWidth || imgHeight>viewHeight){
                    //判断到底取图片高度还是宽度
                    if(ratio1>ratio){
                        imgWidth = viewWidth;
                        imgHeight = imgWidth/ratio1;
                    }else{
                        imgHeight = viewHeight;
                        imgWidth = imgHeight*ratio1;
                    }
                }


                $(".easyDialogWrapper-div2").find("img").eq(0).attr("src", urlImg);
                $(".easyDialogWrapper-div2").find("img").eq(0).css("width", imgWidth);
                $(".easyDialogWrapper-div2").find("img").eq(0).css("height", imgHeight);

                setTimeout(function () {
                    boo = true;
                }, 500)
            }

        }
        else if(Math.abs(x) > Math.abs(y) && x < 0){
            if(boo){
                boo = false;
                if(index > ($(".grid").find("img:eq(0)").size()-2)){   //如果是最后一张，跳到第一张
                    index = 0;
                }else{
                    index++;
                }

                urlImg = $(".grid").eq(index).find("img").eq(0).attr("src");
                var viewWidth = $(window).width()*0.9;
                var viewHeight = $(window).height()*0.8;

                var imgWidth = $(".grid").eq(index).find("img").eq(0).naturalWidth();
                var imgHeight = $(".grid").eq(index).find("img").eq(0).naturalHeight();

                var ratio = viewWidth/viewHeight; //图片显示区域宽高比
                var ratio1 = imgWidth/imgHeight; //图片原始宽高比

                if(imgWidth>viewWidth || imgHeight>viewHeight){
                    //判断到底取图片高度还是宽度
                    if(ratio1>ratio){
                        imgWidth = viewWidth;
                        imgHeight = imgWidth/ratio1;
                    }else{
                        imgHeight = viewHeight;
                        imgWidth = imgHeight*ratio1;
                    }
                }

                $(".easyDialogWrapper-div2").find("img").eq(0).attr("src",urlImg);
                $(".easyDialogWrapper-div2").find("img").eq(0).css("width",imgWidth);
                $(".easyDialogWrapper-div2").find("img").eq(0).css("height",imgHeight);

                setTimeout(function () {
                    boo = true;
                },500)
            }


        }
    }


    function addPic() {
        $.ajax({
            type: "POST",
            url: "test.txt",      //提交到一般处理程序请求数据
            success:function(data){   //data为返回的数据
                if(onOff){
                    onOff = false;
                    $("#loading-img").css("display","block");
                    var html=$(".waterfall").html();
                    var arr=eval(data);
                    startImgNum = $(".grid").find("img:eq(0)").size();

                    for(var i=0;i<arr.length;i++){
                        html += "<div class='grid'>" +
                        "<img src=" + arr[i].picture + " alt='' class='grid-img'/> " +
                        "</div> "
                    }
                    $(".waterfall").eq(0).html(html);

                    endImgNum = $(".grid").find("img:eq(0)").size();
                    newImg = $(".grid").find("img:eq(0)").slice(startImgNum, endImgNum); //筛选新加载的图片
                    newItem =  $(".grid").slice(startImgNum, endImgNum);
                    newItem.css("display","none");

                    //判断新加载的图片是否加载完
                    var totalImg = newImg.size();
                    var currentImg = 0;
                    newImg.on('load',function(){
                        currentImg++;
                        if(currentImg === totalImg){
                            newItem.css("display","block");
                            waterfall();
                            setTimeout(function () {
                                onOff = true;
                            },200)
                            $("#loading-img").css("display","none");
                        }
                    })
                    dialog();
                }

            },
            error:function(xhr, type){
                console.log("请求失败");
            }
        });

    }


    $("#load-pic").click(function () {
        addPic();
    })



    function waterfall() {
        //每个格格不一定往自己序号%3这个列插入，看哪个列目前最矮，插在哪里=
        //得到所有的grid
        $grids = $(".grid");
        //用一个数组存储当前四个列的总高度
        var colHeight = [0,0];
        // console.log(colHeight);
        // 遍历小格格
        $grids.each(function(){
            //找一下当前的最短列是谁
            var minValue = _.min(colHeight); //colHeight里面的最小的值！
            //看一下最短列出现在index几的位置上
            var minIndex = _.indexOf(colHeight,minValue);//最短的值的下标
            // console.log(minIndex);
            $(this).css({
                "top" : minValue ,
                "left" : minIndex * 3.6+"rem"      //调每行间距
            });
            colHeight[minIndex] += $(this).outerHeight() + 10;
            // console.log(colHeight[minIndex]);

        })
        var maxHeight = 0;
        if(colHeight[0]>colHeight[1]){
            maxHeight = colHeight[0];
        }else{
            maxHeight = colHeight[1];
        }
        // var lastImgHeight = $(".grid").eq($(".grid").size()-1).find("img").eq(0).height();
        $(".waterfall").css("height",maxHeight); //调节高度
    }

    function dialog() {
        $(".grid").each(function (i,elem) {
            $(elem).click(function (event) {
                event.stopPropagation(); //阻止事件冒泡
                var urlImg = $(this).find("img").eq(0).attr("src");
                // var imgWidth = $(this).find("img").eq(0).css("width");
                // var imgHeight = $(this).find("img").eq(0).css("height");

                var viewWidth = $(window).width()*0.9;
                var viewHeight = $(window).height()*0.8;

                var imgWidth = $(this).find("img").eq(0).naturalWidth();
                var imgHeight = $(this).find("img").eq(0).naturalHeight();

                var ratio = viewWidth/viewHeight; //图片显示区域宽高比
                var ratio1 = imgWidth/imgHeight; //图片原始宽高比

                if(imgWidth>viewWidth || imgHeight>viewHeight){
                    //判断到底取图片高度还是宽度
                    if(ratio1>ratio){
                        imgWidth = viewWidth;
                        imgHeight = imgWidth/ratio1;
                    }else{
                        imgHeight = viewHeight;
                        imgWidth = imgHeight*ratio1;
                    }
                }

                $(".easyDialogWrapper-div2").find("img").eq(0).attr("src", urlImg);
                $(".easyDialogWrapper-div2").find("img").eq(0).css("width",imgWidth);
                $(".easyDialogWrapper-div2").find("img").eq(0).css("height", imgHeight);


                index = i;
                //防止事件创建多次
                d.removeEventListener('touchstart',touchstart);
                d.removeEventListener('touchmove',touchmove);

                // 轮番图手指左右滑动
                d.addEventListener('touchstart',touchstart);
                d.addEventListener('touchmove',touchmove);

                //打开弹出层
                easyDialog.open({
                    container : 'easyDialogWrapper2',
                    fixed : true
                });
            })
        })
    }


    //关闭弹出层
    $(".close2").click(function () {
        easyDialog.close();
    })
    $(".easyDialogWrapper-div2").click(function () {
        easyDialog.close();
    })
}

