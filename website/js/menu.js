var level = 0;
var isLoaded = false;

var tutPoint = 0;
var tutMessages = new Array();
tutMessages[0] = "Use 'A' and 'D' or the LEFT and RIGHT arrow keys to run.";
tutMessages[1] = "Press 'L' or 'X' to jump.";
tutMessages[2] = "Collect the orbs to gain points.";
tutMessages[3] = "Press 'K' or 'C' to shoot.";
tutMessages[4] = "Use 'W' and 'S' or the UP and DOWN arrow keys to aim up and down.";
tutMessages[5] = "Collect this pickup for the Automatic Machine Gun.";
tutMessages[6] = "Collect this pickup for the Laser Gun.";
tutMessages[7] = "Collect this pickup to replenish Gigaman's health";

window.onload=function(){

    $("#tutorial").click(function(){
        level = 0;
        $("#mainMenu").fadeOut('slow', function(){
            checkLoad();
        });
    });

    $("#levelSel").click(function(){
        $("#mainMenu").fadeOut(function(){
            level = 1;
            $("#menu").fadeIn();
        });
    });

    $("#level1").click(function(){
        level = 1;
    });

    $("#start").click(function(){
        $("#menu").fadeOut('slow', function(){
            checkLoad();
        });
    });

    $("#back").click(function(){
        $("#menu").slideUp('slow', function(){
            $("#mainMenu").slideDown();
        });
    });
};

function checkLoad(){
    if(!isLoaded){
        jsApp.onload();
        isLoaded = true;
    }
    else{
        $("#jsapp").show();
        me.state.change(me.state.PLAY);
    }
}

function showPauseMenu(){
    $("#pauseMenu").slideDown(400, function(){
        $("#pauseBanner").slideDown();
        $("#resume").slideDown();
        $("#retry1").slideDown();
        $("#levelSel1").slideDown();
        $("#exit1").slideDown();

        bindClicks();
    });
}

function hidePauseMenu(){
    $("#pauseMenu").slideUp();
    $("#pauseBanner").hide();
    $("#gameOverBanner").hide();
    $("#resume").hide();
    $("#retry1").hide();
    $("#levelSel1").hide();
    $("#exit1").hide();
}

function showGameOverMenu(){
    $("#resume").hide();

    $("#pauseMenu").slideDown(400, function(){
        $("#gameOverBanner").slideDown();
        $("#retry1").slideDown();
        $("#levelSel1").slideDown();
        $("#exit1").slideDown();
    });

    bindClicks();
}

function bindClicks(){
    $("#retry1").click(function(){
        $("#tutorialBox").hide();
        me.state.change(me.state.PLAY);
        hidePauseMenu();
    });

    $("#levelSel1").click(function(){
        $("#tutorialBox").hide();
        hidePauseMenu();
        $("#jsapp").fadeOut(function(){
            $("#menu").fadeIn();
        })
    });

    $("#exit1").click(function(){
        $("#tutorialBox").hide();
        hidePauseMenu();
        $("#jsapp").fadeOut(function(){
            $("#mainMenu").fadeIn();
        })
    });
}