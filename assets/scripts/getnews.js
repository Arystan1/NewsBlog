$('document').ready(function(){

    VK.Widgets.Comments("vk_comments", {limit: 10, attach: "*"});

    $('.news_blog').click(function(){

        var id = $(this).find('.news_whole_text').text();
        $('#flex_container').html(id + '<div id=\"vk_comments\"></div>');

    })

})
