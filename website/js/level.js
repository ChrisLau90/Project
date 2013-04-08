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
        //this.updateColRect(0, settings.width, 0, settings.height);
    },

    onCollision: function(res, obj){
        $("#tutorialBox").slideUp();

        if(!this.isEnd){
            obj.health = 0;
        }
        else{
            me.state.pause();
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
            $("#levelCompleteMenu").slideDown();

            jsApp.unbindKeys();

            $("#submitScore").click(function(){
                var record = {};
                record.name = $("#nameInput").val();
                record.score = totalScore;

                $.ajax({
                    data: record,
                    type: 'POST',
                    url: '/score',
                    statusCode: {
                        200: function(){
                            console.log(record + submitted);
                        },
                        400: function(xhr, textStatus, errorThrown) {
                            console.log('Could not post score to database');
                        }
                    },
                    complete: function(xhr, status) {

                    }
                })
            });

            $("#retry2").click(function(){
                jsApp.bindKeys();
                $("#levelCompleteMenu").slideUp();
                me.state.change(me.state.PLAY);
            });

            $("#levelSel2").click(function(){
                jsApp.bindKeys();
                $("#levelCompleteMenu").slideUp();
                $("#jsapp").fadeOut(function(){
                    $("#menu").fadeIn();
                })
            });

            $("#exit2").click(function(){
                jsApp.bindKeys();
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
