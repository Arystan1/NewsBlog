$('document').ready(function(){

    var data;
    var news_img;
    var news_ttl;

    DecoupledEditor
            .create( document.querySelector( '#editor-for-image' ) )
            .then( editor => {
                news_img = editor;
            } );

    DecoupledEditor
            .create( document.querySelector( '#editor-for-title' ) )
            .then( editor => {
                news_ttl = editor;
            } );

    DecoupledEditor
            .create( document.querySelector( '#editor' ) )
            .then( editor => {
                const toolbarContainer = document.querySelector( '#toolbar-container' );

                toolbarContainer.appendChild( editor.ui.view.toolbar.element );

                data = editor;
            } )
            .catch( error => {
                console.error( error );
            } );



    $('#save_html_code').click(function(){
        let news_image = news_img.getData();
        let news_title = news_ttl.getData();
        let news = data.getData();

        if(news_image == '<p>&nbsp;</p>' || news_title == '<p>&nbsp;</p>' || news == '<p>&nbsp;</p>'){
            alert('One of the lines is empty!');
            return;
        }

        let jsonfile = JSON.stringify({
          main_img: news_image,
          main_title: news_title,
          html: news
        });

        console.log(jsonfile);
        $.ajax({
            url: '/writenews',
            method: 'POST',
            dataType: "json",
            data: jsonfile,
            contentType: "application/json",
        });

        alert('Поздравляю! Ваша новость была опубликована!');
        window.location = 'http://localhost:3000/news';

    })

});
