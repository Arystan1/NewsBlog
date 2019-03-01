$('document').ready(function(){
    $('.news_blog').click(function(){

        var id = $(this).find('.news_whole_text').text();
        $('#flex_container').html(id);

        /*
        $.ajax({
            url: '/news/' + id,
            method: 'POST',
            data: {id: id},
            success: alert($(this).find('span').text()) 
        })
*/
    })
})