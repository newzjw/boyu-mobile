//下面轮播图要配合样式一起使用，样式要写正确

//淡入淡出轮播图函数：需要引入jq
function fadeSlide(elemPic,elemWheel,styleWheel,type,t,prevBtn,nextBtn) {  //elemPic:图片或包裹图片的外层元素  elemWheel：滚轮元素集合 styleWheel：滚轮active样式class名称 type：1滚轮移入移出事件 2滚轮点击事件 t：轮播时间   注意：图片元素集合等于滚轮元素集合,按钮参数可选
    var currentIndex = 0,
        interval,
        hasStarted = false, //是否已经开始轮播
        length = $(elemPic).length;

    //将除了第一张图片隐藏
    $(elemPic).eq(0).css("position","relative");
    $(elemPic).not(":first").hide();
    //将第一个slider-item设为激活状态
    $(elemWheel).eq(0).addClass(styleWheel);
    //隐藏向前、向后翻按钮
    $('.slider-page').hide();

    //鼠标上悬时显示向前、向后翻按钮,停止滑动，鼠标离开时隐藏向前、向后翻按钮，开始滑动

    if(type == 1){
        $(elemPic).hover(function() {
            stop();
            $('.slider-page').show();
        }, function() {
            $('.slider-page').hide();
            start();
        });
        $(elemWheel).each(function (i,elem) {
            $(elem).hover(function() {
                stop();
                var _styleWheel = "." + styleWheel;
                var preIndex = $(elemWheel).index($(_styleWheel));
                currentIndex = i;
                play(preIndex, currentIndex);
            }, function() {
                start();
            });
        })
    }else if(type == 2){
        $(elemWheel).each(function (i,elem) {
            $(elem).click(function() {
                stop();
                var _styleWheel = "." + styleWheel;
                var preIndex = $(elemWheel).index($(_styleWheel));
                currentIndex = i;
                play(preIndex, currentIndex);
                start();
            });
        });
    }


    $(prevBtn).unbind('click');
    $(prevBtn).bind('click', function() {
        pre();
    });
    $(nextBtn).unbind('click');
    $(nextBtn).bind('click', function() {
        next();
    });

    /**
     * 向前翻页
     */
    function pre() {
        var preIndex = currentIndex;
        currentIndex = (--currentIndex + length) % length;
        play(preIndex, currentIndex);
    }
    /**
     * 向后翻页
     */
    function next() {
        var preIndex = currentIndex;
        currentIndex = ++currentIndex % length;
        play(preIndex, currentIndex);
    }
    /**
     * 从preIndex页翻到currentIndex页
     * preIndex 整数，翻页的起始页
     * currentIndex 整数，翻到的那页
     */
    function play(preIndex, currentIndex) {
        $(elemPic).eq(preIndex).css("position","absolute");

        $(elemPic).eq(preIndex).fadeOut(500).parent().children().eq(currentIndex).fadeIn(1000).css("position","relative");
        $(elemWheel).removeClass(styleWheel);
        $(elemWheel).eq(currentIndex).addClass(styleWheel);
    }

    /**
     * 开始轮播
     */
    function start() {
        if(!hasStarted) {
            hasStarted = true;
            interval = setInterval(next, t);
        }
    }
    /**
     * 停止轮播
     */
    function stop() {
        clearInterval(interval);
        hasStarted = false;
    }

    //开始轮播
    start();
}



//宽度自适应浏览器窗口，高度固定的轮播图PC端
function moveSlide(elemTotal,elemPic,elemWheel,styleWheel,t,prevBtn,nextBtn) {  //elemTotal:包裹图片的外层总元素,elemPic:包裹图片的外层元素li之类,按钮参数可选
    $(elemWheel).eq(0).addClass(styleWheel);
    var booBtn = true;
    var booTurn = true;
    var timer = null;
    var num = 0;
    var leftValue = null;
    var i = -1;
    var imgWidth = 1920;
    var imgNum =  $(elemPic).length; //轮番的图片数量
    var ulWidth = imgNum*imgWidth + "px";
    $(elemTotal).css("width",ulWidth);    //动态设置包裹图片的外层标签的宽度
    $(elemWheel).css({"zIndex":"100","position":"relative"});    //设置滚轮的层级最上面
    function toResize() {    //图片宽度自适应居中函数
        var viewWidth = document.documentElement.clientWidth;
        if(viewWidth>1200){
            $(elemPic).find("img").each(function(k,elem){
                $(elem).css("left",-(imgWidth-viewWidth)/2);
            })
        }
    }

    toResize();

    $(window).resize(function(){  //浏览器窗口变化事件
        toResize();
    })


    // 轮番图开始的函数
    function turnStart() {
        timer = setInterval(function () {
            num = num-imgWidth;
            leftValue = num + "px";
            i++;
            if(num==-imgWidth*imgNum){
                $(elemPic).eq(0).css("position","relative");
                $(elemPic).eq(0).css("left",imgWidth*imgNum+"px");
                $(elemWheel).eq(i).removeClass(styleWheel);
                $(elemWheel).eq(0).addClass(styleWheel);


                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear',function () {
                    $(elemPic).eq(0).css("position","static");
                    $(elemTotal).css("left",0);
                    i=-1;
                    num = 0;
                    leftValue = "-1920px";
                });
            }else{
                $(elemWheel).eq(i).removeClass(styleWheel);
                $(elemWheel).eq(i+1).addClass(styleWheel);
                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear');

            }
        },t)
    }

    turnStart();//开始轮番

    $(elemTotal).mouseover(function () {   // 轮番图鼠标移入停止轮番
        clearInterval(timer);
    })
    $(elemTotal).mouseout(function () {   // 轮番图鼠标移出继续轮番
        turnStart();
    })
    $(elemWheel).mouseover(function () {   // 轮番图鼠标移入停止轮番
        clearInterval(timer);
    })
    $(elemWheel).mouseout(function () {   // 轮番图鼠标移出继续轮番
        turnStart();
    })

    //点击轮番滚轮时执行切换
    $(elemWheel).each(function(j,elem) {   //一参：元素下标    二参 : 每个元素
        $(elem).click(function () {
                // var _styleWheel = "." + styleWheel;
                //
                // $(_styleWheel).removeClass(styleWheel);
                // $(this).addClass(styleWheel);
                // $(elemTotal).css("left",-imgWidth*j+"px");
                // num = -imgWidth*j;
                // i = j-1;
            if(booTurn && j != i+1){

                booTurn = false;
                $(elemWheel).removeClass(styleWheel);
                $(this).addClass(styleWheel);

                if(j>(i+1)){      //左滚
                    $(elemPic).eq(j).css("position", "relative");
                    $(elemPic).eq(j).css("left", -imgWidth*(j-i-2) + "px");
                    leftValue = -imgWidth * (i+2);
                }else if(j<(i+1)){    //右滚
                    $(elemPic).eq(j).css("position", "relative");
                    $(elemPic).eq(j).css("left", imgWidth*(i-j) + "px");
                    $(elemPic).eq(j).css("zIndex", 99);
                    leftValue = -imgWidth * i;
                }

                $(elemTotal).animate({"left": leftValue}, 1000, 'linear', function () {
                    $(elemPic).eq(j).css("position", "static");
                    $(elemTotal).css("left", -imgWidth * j + "px");
                    booTurn = true;
                });
                num = -imgWidth * j;
                i = j - 1;
            }

        });
    })

    //左按钮
    $(prevBtn).click(function () {
        if(booBtn){
            booBtn=false;
            num = num-imgWidth;
            leftValue = num + "px";
            i++;

            if(num==-imgWidth*imgNum){
                $(elemPic).eq(0).css("position","relative");
                $(elemPic).eq(0).css("left",imgWidth*imgNum+"px");
                $(elemWheel).eq(i).removeClass(styleWheel);
                $(elemWheel).eq(0).addClass(styleWheel);

                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear',function () {
                    $(elemPic).eq(0).css("position","static");
                    $(elemTotal).css("left",0);
                    i=-1;
                    num = 0;
                    leftValue = "-1920px";
                    booBtn = true;
                });
            }else{
                $(elemWheel).eq(i).removeClass(styleWheel);
                $(elemWheel).eq(i+1).addClass(styleWheel);
                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear',function () {
                    booBtn = true;
                });

            }
        }
    })

    //右按钮
    $(nextBtn).click(function () {
        if(booBtn){
            booBtn=false;
            num = num+imgWidth;
            leftValue = num + "px";
            i--;
            if(num == imgWidth){
                $(elemPic).eq(imgNum-1).css("position","relative");
                $(elemPic).eq(imgNum-1).css("left",-imgWidth*imgNum+"px");
                $(elemWheel).eq(0).removeClass(styleWheel);
                $(elemWheel).eq(imgNum-1).addClass(styleWheel);

                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear',function () {
                    $(elemPic).eq(imgNum-1).css("position","static");
                    $(elemTotal).css("left",-imgWidth*(imgNum-1)+"px");
                    i=imgNum-2;
                    num = -imgWidth*(imgNum-1);
                    booBtn = true;
                });
            }else{
                $(elemWheel).eq(i+2).removeClass(styleWheel);
                $(elemWheel).eq(i+1).addClass(styleWheel);
                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear',function () {
                    booBtn = true;
                });

            }
        }
    })

    $(nextBtn).mouseover(function () {   // 轮番图鼠标移入停止轮番
        clearInterval(timer);
    })
    $(prevBtn).mouseover(function () {   // 轮番图鼠标移入停止轮番
        clearInterval(timer);
    })


}

<!--宽度100%，高度自适应滚动轮播-->
function moveSlideRem(elemTotal,elemPic,elemWheel,styleWheel,t,prevBtn,nextBtn) {  //elemTotal:包裹图片的外层总元素,elemPic:包裹图片的外层元素li之类,按钮参数可选
    $(elemWheel).eq(0).addClass(styleWheel);
    var booBtn = true;
    var booTurn = true;
    var timer = null;
    var num = 0;
    var leftValue = null;
    var i = -1;
    var imgWidth = 19.2;
    var imgNum =  $(elemPic).length; //轮番的图片数量
    var ulWidth = imgNum*imgWidth + "rem";
    $(elemTotal).css("width",ulWidth);    //动态设置包裹图片的外层标签的宽度
    $(elemWheel).css({"zIndex":"100","position":"relative"});    //设置滚轮的层级最上面

    // 轮番图开始的函数
    function turnStart() {
        timer = setInterval(function () {
            num = num-imgWidth;
            leftValue = num + "rem";
            i++;
            if(num==-imgWidth*imgNum){
                $(elemPic).eq(0).css("position","relative");
                $(elemPic).eq(0).css("left",imgWidth*imgNum+"rem");
                $(elemWheel).eq(i).removeClass(styleWheel);
                $(elemWheel).eq(0).addClass(styleWheel);


                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear',function () {
                    $(elemPic).eq(0).css("position","static");
                    $(elemTotal).css("left",0);
                    i=-1;
                    num = 0;
                    leftValue = "-19.2rem";
                });
            }else{
                $(elemWheel).eq(i).removeClass(styleWheel);
                $(elemWheel).eq(i+1).addClass(styleWheel);
                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear');

            }
        },t)
    }

    turnStart();//开始轮番

    $(elemTotal).mouseover(function () {   // 轮番图鼠标移入停止轮番
        clearInterval(timer);
    })
    $(elemTotal).mouseleave(function () {   // 轮番图鼠标移出继续轮番
        turnStart();
    })
    $(elemWheel).mouseover(function () {   // 轮番图鼠标移入停止轮番
        clearInterval(timer);
    })
    $(elemWheel).mouseleave(function () {   // 轮番图鼠标移出继续轮番
        turnStart();
    })

    //点击轮番滚轮时执行切换
    $(elemWheel).each(function(j,elem) {   //一参：元素下标    二参 : 每个元素
        $(elem).click(function () {
            if(booTurn && j != i+1){

                booTurn = false;
                $(elemWheel).removeClass(styleWheel);
                $(this).addClass(styleWheel);

                if(j>(i+1)){      //左滚
                    $(elemPic).eq(j).css("position", "relative");
                    $(elemPic).eq(j).css("left", -imgWidth*(j-i-2) + "rem");
                    leftValue = -imgWidth * (i+2) + "rem";
                }else if(j<(i+1)){    //右滚
                    $(elemPic).eq(j).css("position", "relative");
                    $(elemPic).eq(j).css("left", imgWidth*(i-j) + "rem");
                    $(elemPic).eq(j).css("zIndex", 99);
                    leftValue = -imgWidth * i + "rem";
                }

                $(elemTotal).animate({"left": leftValue}, 1000, 'linear', function () {
                    $(elemPic).eq(j).css("position", "static");
                    $(elemTotal).css("left", -imgWidth * j + "rem");
                    booTurn = true;
                });
                num = -imgWidth * j;
                i = j - 1;
            }

        });
    })

    //左按钮
    $(prevBtn).click(function () {
        if(booBtn){
            booBtn=false;
            num = num-imgWidth;
            leftValue = num + "rem";
            i++;

            if(num==-imgWidth*imgNum){
                $(elemPic).eq(0).css("position","relative");
                $(elemPic).eq(0).css("left",imgWidth*imgNum+"rem");
                $(elemWheel).eq(i).removeClass(styleWheel);
                $(elemWheel).eq(0).addClass(styleWheel);

                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear',function () {
                    $(elemPic).eq(0).css("position","static");
                    $(elemTotal).css("left",0);
                    i=-1;
                    num = 0;
                    leftValue = "-19.2rem";
                    booBtn = true;
                });
            }else{
                $(elemWheel).eq(i).removeClass(styleWheel);
                $(elemWheel).eq(i+1).addClass(styleWheel);
                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear',function () {
                    booBtn = true;
                });

            }
        }
    })

    //右按钮
    $(nextBtn).click(function () {
        if(booBtn){
            booBtn=false;
            num = num+imgWidth;
            leftValue = num + "rem";
            i--;
            if(num == imgWidth){
                $(elemPic).eq(imgNum-1).css("position","relative");
                $(elemPic).eq(imgNum-1).css("left",-imgWidth*imgNum+"rem");
                $(elemWheel).eq(0).removeClass(styleWheel);
                $(elemWheel).eq(imgNum-1).addClass(styleWheel);

                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear',function () {
                    $(elemPic).eq(imgNum-1).css("position","static");
                    $(elemTotal).css("left",-imgWidth*(imgNum-1)+"rem");
                    i=imgNum-2;
                    num = -imgWidth*(imgNum-1);
                    booBtn = true;
                });
            }else{
                $(elemWheel).eq(i+2).removeClass(styleWheel);
                $(elemWheel).eq(i+1).addClass(styleWheel);
                $(elemTotal).animate({"left":leftValue} , 1000 , 'linear',function () {
                    booBtn = true;
                });

            }
        }
    })

    $(nextBtn).mouseover(function () {   // 轮番图鼠标移入停止轮番
        clearInterval(timer);
    })
    $(nextBtn).mouseleave(function () {   // 轮番图鼠标移入停止轮番
        turnStart();
    })
    $(prevBtn).mouseover(function () {   // 轮番图鼠标移入停止轮番
        clearInterval(timer);
    })
    $(prevBtn).mouseleave(function () {   // 轮番图鼠标移入停止轮番
        turnStart();
    })


}



// 手机轮播图
function moveSlideM(elemTotal,elemPic,elemWheel,styleWheel,t,distance,prevBtn,nextBtn) {
    $(elemWheel).eq(0).addClass(styleWheel);
    var imgWidth = distance;
    var count = 0;
    var timer = null;
    var turnLeft1 = 0;
    var num2 = 0;
    var booTurn = true;
    var onOff2 = true;
    var length = $(elemPic).length;//轮番图片的集合长度
    $(elemTotal).css("width",7.5*length + "rem");
    $(elemWheel).css({"zIndex":"100","position":"relative"});    //设置滚轮的层级最上面
    timer = setInterval(turnPic,t);

    function turnPic() {
        count++;
        num2 = num2 - distance;
        onOff2 = false;
        if(num2.toFixed(2) == (-distance*length).toFixed(2)){           //解决计算机小数点问题
            $(elemWheel).removeClass(styleWheel);
            count = 0;
            $(elemWheel).eq(count).addClass(styleWheel);
            $(elemPic).eq(0).css("position","relative");
            $(elemPic).eq(0).css("left",distance*length+"rem");
            $(elemTotal).animate({left:num2+"rem"} ,1000, 'linear',function () {
                $(elemPic).eq(0).css("position","static");
                num2= 0;
                $(elemTotal).css("left",0);
                onOff2 = true;
            });
        }else{
            $(elemTotal).animate({left:num2+"rem"} ,1000, 'linear',function () {
                onOff2 = true;
            });
            $(elemWheel).removeClass(styleWheel);
            $(elemWheel).eq(count).addClass(styleWheel);
        }
    }

    // 点击左右按钮
    $(prevBtn).click(function () {
        if(onOff2){
            clearInterval(timer);
            count++;
            onOff2 = false;
            num2 = num2-distance;
            turnLeft1 = num2 + "rem";
            if(num2.toFixed(2) == (-distance*length).toFixed(2)){
                $(elemWheel).removeClass(styleWheel);
                count = 0;
                $(elemWheel).eq(count).addClass(styleWheel);

                $(elemPic).eq(0).css("position","relative");
                $(elemPic).eq(0).css("left",distance*length+"rem");
                $(elemTotal).animate({"left":turnLeft1} , 500 , 'linear',function () {
                    $(elemPic).eq(0).css("position","static");
                    onOff2 = true;
                    num2 = 0;
                    $(elemTotal).css("left",0);
                    timer = setInterval(turnPic,t);
                });

            }else{
                $(elemTotal).animate({"left":turnLeft1} , 500 , 'linear',function () {
                    onOff2 = true;
                    timer = setInterval(turnPic,t);
                });
                $(elemWheel).removeClass(styleWheel);
                $(elemWheel).eq(count).addClass(styleWheel);
            }
        }
    })
    $(nextBtn).click(function () {
        if(onOff2){
            clearInterval(timer);
            count--;
            onOff2 = false;
            num2 = num2+distance;
            turnLeft1 = num2 + "rem";
            if(num2.toFixed(2) == distance){
                $(elemWheel).removeClass(styleWheel);
                count = length-1;
                $(elemWheel).eq(count).addClass(styleWheel);

                $(elemPic).eq(length-1).css("position","relative");
                $(elemPic).eq(length-1).css("left",-distance*length+"rem");
                $(elemTotal).animate({"left":distance+"rem"} , 500 , 'linear',function () {
                    $(elemPic).eq(length-1).css("position","static");
                    onOff2 = true;
                    num2 = -distance*(length-1);
                    $(elemTotal).css("left",-distance*(length-1)+"rem");
                    timer = setInterval(turnPic,t);
                });

            }else{
                $(elemTotal).animate({"left":turnLeft1} , 500 , 'linear',function () {
                    onOff2 = true;
                    timer = setInterval(turnPic,t);
                });
                $(elemWheel).removeClass(styleWheel);
                $(elemWheel).eq(count).addClass(styleWheel);
            }

        }
    })


    // 轮番图手指左右滑动
    var startX,startY,moveX,moveY;
    var d = $(elemTotal).parent().get(0);

    d.addEventListener('touchstart',function(e){
        // e.preventDefault();
        e.stopPropagation();
        var target = e.targetTouches[0];
        startX = target.clientX;
        startY = target.clientY;
    });

    d.addEventListener('touchmove',function(e){
        // e.preventDefault();
        e.stopPropagation();
        var target = e.targetTouches[0];
        moveX = target.clientX;
        moveY = target.clientY;

        var x = moveX - startX,
            y = moveY - startY;

        // 如果x>0并且x轴上移动的距离大于y轴上移动的距离
        if(Math.abs(x) > Math.abs(y) && x > 0){
            // alert('向右');
            if(onOff2){
                clearInterval(timer);
                count--;
                onOff2 = false;
                num2 = num2 + distance;
                turnLeft1 = num2 + "rem";
                if(num2.toFixed(2) == distance){     //toFixed保留小数点两位，为解决小数加减出现数字异常问题
                    $(elemWheel).removeClass(styleWheel);
                    count = length-1;
                    $(elemWheel).eq(count).addClass(styleWheel);

                    $(elemPic).eq(length-1).css("position","relative");
                    $(elemPic).eq(length-1).css("left",-distance*length+"rem");
                    $(elemTotal).animate({"left":distance+"rem"} , 500 , 'linear',function () {
                        $(elemPic).eq(length-1).css("position","static");
                        onOff2 = true;
                        num2 = -distance*(length-1);
                        $(elemTotal).css("left",-distance*(length-1)+"rem");
                        timer = setInterval(turnPic,t);
                    });

                }else{
                    $(elemTotal).animate({"left":turnLeft1} , 500 , 'linear',function () {
                        onOff2 = true;
                        timer = setInterval(turnPic,t);
                    });
                    $(elemWheel).removeClass(styleWheel);
                    $(elemWheel).eq(count).addClass(styleWheel);
                }

            }


        }
        else if(Math.abs(x) > Math.abs(y) && x < 0){
            // alert('向左');
            if(onOff2){
                clearInterval(timer);
                count++;
                onOff2 = false;
                num2 = num2-distance;
                turnLeft1 = num2 + "rem";
                if(num2.toFixed(2) == (-distance*length).toFixed(2)){
                    $(elemWheel).removeClass(styleWheel);
                    count = 0;
                    $(elemWheel).eq(count).addClass(styleWheel);

                    $(elemPic).eq(0).css("position","relative");
                    $(elemPic).eq(0).css("left",distance*length+"rem");
                    $(elemTotal).animate({"left":turnLeft1} , 500 , 'linear',function () {
                        $(elemPic).eq(0).css("position","static");
                        onOff2 = true;
                        num2 = 0;
                        $(elemTotal).css("left",0);
                        timer = setInterval(turnPic,t);
                    });

                }else{
                    $(elemTotal).animate({"left":turnLeft1} , 500 , 'linear',function () {
                        onOff2 = true;
                        timer = setInterval(turnPic,t);
                    });
                    $(elemWheel).removeClass(styleWheel);
                    $(elemWheel).eq(count).addClass(styleWheel);
                }
            }

        }
        else if(Math.abs(x) < Math.abs(y) && y > 0){
            // alert('向下');
        }
        else if(Math.abs(x) < Math.abs(y) && y < 0){
            // alert('向上');

        }

    });

    // 轮番圆点点击跳转
    $(elemWheel).each(function (j,elem) {
        $(elem).click(function () {
            if(booTurn && j != count){
                clearInterval(timer);
                booTurn = false;
                $(elemWheel).removeClass(styleWheel);
                $(this).addClass(styleWheel);

                if(j>count){      //左滚
                    $(elemPic).eq(j).css("position", "relative");
                    $(elemPic).eq(j).css("left", -imgWidth*(j-count-1) + "rem");
                    leftValue = -imgWidth * (count+1);
                }else if(j<count){    //右滚
                    $(elemPic).eq(j).css("position", "relative");
                    $(elemPic).eq(j).css("left", imgWidth*(count-j-1) + "rem");
                    $(elemPic).eq(j).css("zIndex", 99);
                    leftValue = -imgWidth * (count-1);
                }

                $(elemTotal).animate({"left": leftValue+"rem"}, 1000, 'linear', function () {
                    $(elemPic).eq(j).css("position", "static");
                    $(elemTotal).css("left", -imgWidth * j + "rem");
                    booTurn = true;
                    timer = setInterval(turnPic,t);
                });
                num2 = -imgWidth * j;
                count = j;
            }


        })
    })
}




