$('document').ready(function(){

    var data;

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

        news = data.getData();

        let jsonfile = JSON.stringify({html: news});

        $.ajax({
            url: '/writenews',
            method: 'POST',
            dataType: "json",
            data: jsonfile,
            contentType: "application/json",
            success: function(result) {
                console.log(result.status);
            }
        })

    })

}); 