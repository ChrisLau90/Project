window.onload = function(){

    $("#register").click(function(){
        console.log('ha');
        $("#loginContainer").slideUp(function(){
            $("#loginForm").hide();
            $("#regForm").show();
            $("#loginContainer").slideDown();
        });
    });

    $("#loginButton").click(function(){
        console.log('ha');
        $("#loginContainer").slideUp(function(){
            $("#regForm").hide();
            $("#loginForm").show();
            $("#loginContainer").slideDown();
        });
    });
}

