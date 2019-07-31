$('document').ready(function(){

    var data;
    var video_img;
    var video_ttl;
    var video_desc;

    DecoupledEditor
            .create( document.querySelector( '#editor-for-image' ) )
            .then( editor => {
                video_img = editor;
            } );

    DecoupledEditor
            .create( document.querySelector( '#editor-for-title' ) )
            .then( editor => {
                video_ttl = editor;
            } );

    DecoupledEditor
            .create( document.querySelector( '#editor-for-description' ) )
            .then( editor => {
                video_desc = editor;
            } );

    DecoupledEditor
            .create( document.querySelector( '#editor-for-video' ) )
            .then( editor => {
                const toolbarContainer = document.querySelector( '#toolbar-container' );

                toolbarContainer.appendChild( editor.ui.view.toolbar.element );

                data = editor;
            } )
            .catch( error => {
                console.error( error );
            } );



    $('#save_html_code').click(function(){
        let video_image = video_img.getData();
        let video_title = video_ttl.getData();
        let video_description = video_desc.getData();
        let video = data.getData();

        if(video_image == '<p>&nbsp;</p>' || video_title == '<p>&nbsp;</p>' || video == '<p>&nbsp;</p>'){
            alert('One of the lines is empty!');
            return;
        }

        let jsonfile = JSON.stringify({
          main_img: video_image,
          main_title: video_title,
          html: video + video_description
        });

        console.log(jsonfile);
        $.ajax({
            url: '/writevideo',
            method: 'POST',
            dataType: "json",
            data: jsonfile,
            contentType: "application/json",
        });

        alert('Поздравляю! Ваше видео была опубликовано!');
        window.location = 'http://localhost:3000/video';

    })

});
