$(function () {
    $("#navShow").click(function () {
        $(this).hide();
        $("#navHide").show();
        $("nav").stop().animate({"right":0})
    })
    $("#navHide").click(function () {
        $(this).hide();
        $("#navShow").show();
        $("nav").stop().animate({"right":"-5.6rem"})
    })

    $("#navMenu").find("h4").each(function (i,elem) {
        $(this).click(function () {

            if($(this).hasClass("active")){
                $("#navMenu").find(".u-arrow-up").hide();
                $(this).find(".u-arrow-down").show();
                $("#navMenu").find("div").hide();
                $(this).removeClass("active");
            }else{
                $("#navMenu").find(".u-arrow-down").show();
                $("#navMenu").find(".u-arrow-up").hide();
                $(this).find(".u-arrow-down").hide();
                $(this).find(".u-arrow-up").show();
                $("#navMenu").find("h4").removeClass("active");
                $(this).addClass("active");
                $("#navMenu").find("div").hide();
                $(this).parent().find("div").show();
            }
        })
    })
})