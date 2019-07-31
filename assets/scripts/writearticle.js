$('document').ready(function(){

    var data;
    var article_img;
    var article_ttl;

    DecoupledEditor
            .create( document.querySelector( '#editor-for-image' ) )
            .then( editor => {
                article_img = editor;
            } );

    DecoupledEditor
            .create( document.querySelector( '#editor-for-title' ) )
            .then( editor => {
                article_ttl = editor;
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
        let article_image = article_img.getData();
        let article_title = article_ttl.getData();
        let article = data.getData();

        if(article_image == '<p>&nbsp;</p>' || article_title == '<p>&nbsp;</p>' || article == '<p>&nbsp;</p>'){
            alert('One of the lines is empty!');
            return;
        }

        let jsonfile = JSON.stringify({
          main_img: article_image,
          main_title: article_title,
          html: article
        });

        console.log(jsonfile);
        $.ajax({
            url: '/writearticles',
            method: 'POST',
            dataType: "json",
            data: jsonfile,
            contentType: "application/json",
        });

        alert('Поздравляю! Ваша статья была опубликована!');
        window.location = 'http://localhost:3000/article';

    })

});
