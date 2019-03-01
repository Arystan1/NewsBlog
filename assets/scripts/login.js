function CheckPasswords(pass, rep_pas) {

    if(pass != rep_pas || pass.length != rep_pas.length)
    {
        alert("Passwords is NOT equal!");
        return false;
    }

    if(pass.length <= 7)
    {
        alert("Password length IS NOT enough!");
        return false;
    }

    return true;

}

$('document').ready(function(){

    $('#login').click(function(){

        var email = $("input[name=email]").val();
        var password = $("input[name=password]").val();

        if(email != '' && password != '')
        {
            password = $.MD5(password).toUpperCase();

            $.ajax({
                url: '/login',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    email: email,
                    password: password
                }),
                success: function(result) {
                    console.log(result.status);
                    alert(result.status);
                }
            });
        }

    });

    $('#signin').click(function(){

        var nickname = $("input[name=nickname]").val();
        var email = $("input[name=email]").val();
        var password = $("input[name=password]").val();
        var repeated_password = $("input[name=repeated-password]").val();

        if (CheckPasswords(password, repeated_password))
        {
            password = $.MD5(password).toUpperCase();

            $.ajax({
                
                url: '/signin',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    nickname: nickname,
                    email: email,
                    password: password
                }),
                success: function(result) {
                    console.log(result.status);
                    alert(result.status);
                }

            });
        }

    });

});