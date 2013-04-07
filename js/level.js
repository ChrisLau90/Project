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

