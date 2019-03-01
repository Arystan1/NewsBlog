$('document').ready(function(){

    $('#save_html_code').click(function(){

        //var val = editor.getData();
        var val = CKEDITOR.instances['#editor'].getData();
        alert(val);
        //alert("hey");

    })

}); 