$('document').ready(function(){

    $('.news_blog').click(function(){

        var html = $(this).find('.news_whole_text').text();
        $('#flex_container').html(html);

    })

})
