var ScoreObject = me.HUD_Item.extend({
    init: function (x, y){
        this.parent(x, y);
        this.font = new me.BitmapFont("atascii_font", 16);
    },

    draw: function(context, x, y){
        this.font.draw(context, "SCORE: " + this.value, this.pos.x + x, this.pos.y + y);
    }
})