var level = 1;
var isLoaded = false;

var tutPoint = 0;
var tutMessages = new Array();
tutMessages[0] = "Use the arrow keys or WASD keys to run and aim.";
tutMessages[1] = "Use the X and C keys or the L and K keys to jump and fire.";
tutMessages[2] = "Collect the orbs to gain points.";
tutMessages[3] = "Kill the enemies to gain points.";
tutMessages[4] = "Points are also awarded for the amount of time, ammo and health left at the end of the round.";
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
            updateScoreTable(1);
            $("#menu").fadeIn();
        });
    });

    $("#level1").click(function(){
        level = 1;
        updateScoreTable(1);
    });

    $("#showAll").click(function(){
        updateScoreTable(2);
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

function updateScoreTable(urlNo){

    var url = "/score" + urlNo;

    $.ajax({
        data: {levelNo: level},
        type: 'GET',
        url: url,
        statusCode: {
            200: function(data){
                console.log(data);

                for(var i = 0; i < data.length; i++){
                    var numberCol = "<td>" + (i + 1) + "</td>";
                    var nameCol = "<td>" + data[i].name + "</td>";
                    var scoreCol = "<td>" + data[i].score + "</td>";
                    var tableRow = "<tr>" + numberCol + nameCol + scoreCol + "</tr>";
                    
                    console.log(numberCol);
                    console.log(nameCol);
                    console.log(scoreCol);
                    console.log(tableRow);

                    $("#scoreTable tr:last").after(tableRow);
                }
            },
            400: function(xhr, textStatus, errorThrown) {
                console.log('get problem...');
            }
        },
        complete: function(xhr, status) {
        }
    })
}

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
