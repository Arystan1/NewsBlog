$('document').ready(function(){

    $('.video_blog').click(function(){

        var html = $(this).find('.video_whole_text').text();
        $('#flex_container').html(html);

    })

})
