$(document).ready(function(){
    // listen .nav-link event
    $('.nav-link').click(function(e){
        // stop default page skip
        e.preventDefault();

        // 获取被点击链接的href属性
        var href = $(this).attr('href');

        // 更新iframe的src属性为链接的href
        $('#content-iframe').attr('src', href);
    });
});