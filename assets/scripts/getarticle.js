$('document').ready(function(){

    $('.article_blog').click(function(){

        var html = $(this).find('.article_whole_text').text();
        $('#flex_container').html(html);

    })

})
