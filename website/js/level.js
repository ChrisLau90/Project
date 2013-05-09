var OrbPickup = me.CollectableEntity.extend({
    init: function(x, y){
        var settings = {
            name: "pickup_orb",
            image: "pickup_orb",
            spritewidth: 16
        }
        this.parent(x, y, settings);
    },

    onCollision: function(res, obj){
        if (obj instanceof PlayerEntity) {
            me.audio.play("orb_sound");
            me.game.HUD.updateItemValue("score", 20);
            this.collidable = false;
            me.game.remove(this);
        };
    }
});

var LargeOrbPickup = me.CollectableEntity.extend({
    init: function(x, y){
        var settings = {
            name: "pickup_orb_large",
            image: "pickup_orb_large",
            spritewidth: 28
        }
        this.parent(x, y, settings);
    },

    onCollision: function(res, obj){
        if (obj instanceof PlayerEntity) {
            me.audio.play("large_orb_sound");
            me.game.HUD.updateItemValue("score", 100);
            this.collidable = false;
            me.game.remove(this);
        };
    }
});

var HealthPickup = me.CollectableEntity.extend({
    init: function(x, y){
        var settings = {
            name: "pickup_health",
            image: "pickup_health",
            spritewidth: 28
        }
        this.parent(x, y, settings);
    },

    onCollision: function(res, obj){
        if (obj instanceof PlayerEntity) {
            me.audio.play("health_sound");
            obj.health += 30;
            this.collidable = false;
            me.game.remove(this);
        };
    }
});

var AutomaticPickup = me.CollectableEntity.extend({
    init: function(x, y){
        var settings = {
            name: "pickup_automatic",
            image: "pickup_automatic",
            spritewidth: 32
        }
        this.parent(x, y, settings);
    },

    onCollision: function(res, obj){
        if (obj instanceof PlayerEntity) {
            me.audio.play("pickup_sound");
            obj.gun = 1;
            obj.ammo = 100;
            this.collidable = false;
            me.game.remove(this);
        };
    }
});

var LaserPickup = me.CollectableEntity.extend({
    init: function(x, y){
        var settings = {
            name: "pickup_laser",
            image: "pickup_laser",
            spritewidth: 32
        }
        this.parent(x, y, settings);
    },

    onCollision: function(res, obj){
        if (obj instanceof PlayerEntity) {
            me.audio.play("pickup_sound");
            obj.gun = 2;
            obj.ammo = 20;
            this.collidable = false;
            me.game.remove(this);
        };
    }
});

var MapLimit = me.InvisibleEntity.extend({
    init: function(x,y,settings){
        this.parent(x,y,settings);
        this.isEnd = settings.end;
    },

    onCollision: function(res, obj){
        $("#tutorialBox").slideUp();

        if(!this.isEnd){
            obj.health = 0;
        }
        else{
            me.state.pause();
            me.audio.stopTrack("intro_stage");
            me.audio.play("level_complete_sound");
            var score = me.game.HUD.getItemValue("score");
            var time = me.game.HUD.getItemValue("time");
            var timeBonus = time * 10;
            var health = obj.health;
            var healthBonus = health * 20;
            var ammo = obj.ammo;
            var ammoBonus = ammo * 30;
            var totalScore = score + timeBonus + healthBonus + ammoBonus;

            $("#resScore").text(score);
            $("#resTime").text(time);
            $("#bonusTime").text(timeBonus);
            $("#resHealth").text(health);
            $("#bonusHealth").text(healthBonus);
            $("#resAmmo").text(ammo);
            $("#bonusAmmo").text(ammoBonus);
            $("#resTotal").text(totalScore);

            if(level != 0){
                $("#scoreSubmit").show();
            }

            $("#levelCompleteMenu").slideDown();

            jsApp.unbindKeys();

            $("#submitScore").click(function(){
                $("#submitScore").unbind();
                var record = {};
		        record.level = level;
                record.name = $("#nameInput").val();
                record.score = totalScore;

                $("#scoreSubmit").slideUp(function(){
                    $("#databaseMessage").slideDown();
                });

                $.ajax({
                    data: record,
                    type: 'POST',
                    url: '/post',
                    statusCode: {
                        200: function(){
                            $("#databaseMessage").text("Score Submitted!");
                            console.log(record + " submitted");
                        },
                        400: function(xhr, textStatus, errorThrown) {
                            $("#databaseMessage").text("Error! Could not post to database");
                            console.log('Could not post score to database');
                        }
                    },
                    complete: function(xhr, status) {

                    }
                });
            });

            $("#retry2").click(function(){
                $("#scoreSubmit").hide();
                $("#databaseMessage").hide();
                $("#databaseMessage").text("Contacting Database...");
                $("#levelCompleteMenu").slideUp();
                me.state.change(me.state.PLAY);
            });

            $("#levelSel2").click(function(){
                $("#scoreSubmit").hide();
                $("#databaseMessage").hide();
                $("#databaseMessage").text("Contacting Database...");
                $("#levelCompleteMenu").slideUp();
                level = 1;
                $("#jsapp").fadeOut(function(){
                    $("#menu").fadeIn();
                })
            });

            $("#exit2").click(function(){
                $("#scoreSubmit").hide();
                $("#databaseMessage").hide();
                $("#databaseMessage").text("Contacting Database...");
                $("#levelCompleteMenu").slideUp();
                $("#jsapp").fadeOut(function(){
                    $("#mainMenu").fadeIn();
                })
            });
        }
    }
});

var TutorialPoint = me.InvisibleEntity.extend({
    init: function(x, y, settings){
        this.parent(x, y, settings);
        this.point = settings.number;
    },

    onCollision: function(res, obj){
        this.collidable = false;
        tutPoint = this.point;
        $("#tutorialBox").slideUp(function(){
            $("#tutorialBox").text(tutMessages[tutPoint]);
            $("#tutorialBox").slideDown();
        });
    }
})
