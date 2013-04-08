window.onload = function(){

    $("#registerButton").click(function(){
        $("#loginContainer").slideUp(function(){
            $("#loginForm").hide();
            $("#regForm").show();
            $("#loginContainer").slideDown();
        });
    });

    $("#loginButton").click(function(){
        $("#loginContainer").slideUp(function(){
            $("#regForm").hide();
            $("#loginForm").show();
            $("#loginContainer").slideDown();
        });
    });
}

