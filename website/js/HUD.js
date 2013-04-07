var ScoreObject = me.HUD_Item.extend({
    init: function (x, y){
        this.parent(x, y);
        this.font = new me.BitmapFont("atascii_font", 16);
    },

    draw: function(context, x, y){
        this.font.draw(context, "SCORE: " + this.value, this.pos.x + x, this.pos.y + y);
    }
});

var HealthObject = me.HUD_Item.extend({
    init: function (x, y){
        this.parent(x, y);
        this.font = new me.BitmapFont("atascii_font", 16);
        this.value = 100;
    },

    draw: function(context, x, y){
        this.font.draw(context, "HP: " + this.value, this.pos.x + x, this.pos.y + y);
    }
});


var AmmoObject = me.HUD_Item.extend({
    init: function (x, y){
        this.parent(x, y);
        this.font = new me.BitmapFont("atascii_font", 16);
        this.value = 0;
    },

    draw: function(context, x, y){
        this.font.draw(context, "AMMO: " + this.value, this.pos.x + x, this.pos.y + y);
    }
});

var TimerObject = me.HUD_Item.extend({
    init: function (x, y){
        this.parent(x, y);
        this.font = new me.BitmapFont("atascii_font", 16);
    },

    draw: function(context, x, y){
        this.font.draw(context, "TIME: " + this.value, this.pos.x + x, this.pos.y + y)
    }
});