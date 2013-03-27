/*--------------------------------------
	Player Entity
---------------------------------------*/
var PlayerEntity = me.ObjectEntity.extend({

	init: function(x, y, settings) {
		// call the constructor
		this.parent(x, y, settings);

		// set the default horizontal & vertical speed (accel vector)
		this.setVelocity(0.5,0);
        this.setMaxVelocity(5,10);
        this.setFriction(0.25, 0);
        this.jumpForce = 0;

        this.animationspeed = me.sys.fps / 20;

        //this.updateColRect(20, 34, 38, 70);
        this.updateColRect(24, 24, 38, 70);

		// set the display to follow the position on both axis
        this.centerOffsetX = 24;
        this.centreOffsetY = 40;
        this.viewChange = 0;
        this.cameraPos = new me.Vector2d( this.pos.x + this.centerOffsetX, this.pos.y + this.centreOffsetY);

		me.game.viewport.follow(this.cameraPos, me.game.viewport.AXIS.BOTH);
        me.game.viewport.setDeadzone(0,50);

        // set animations
        this.addAnimation("stand", [0]);
        this.addAnimation("step", [1]);
        this.addAnimation("run", [2,3,4,5,6,7,8,9,10,11]);
        this.addAnimation("jump", [12,13]);
        this.addAnimation("jump2", [14]);
        this.addAnimation("fall", [15]);
        this.addAnimation("fall2", [16]);
        this.addAnimation("land", [17]);
        this.addAnimation("damage", [18]);

        //variables
        this.health = 100;
        this.isMoving = false;
        this.aimingUp = false;
        this.aimingLeft = false;
        this.aimingDown = false;
        this.blockJump = false;
        this.isHurt = false;
        this.hitLeft = false;
        this.damageTimer = 0;
	},

	update: function() {

        if(!this.isHurt){
            this.stateMachine();
            this.checkInput();

            if(!this.isFlickering()){
                var entCol = me.game.collide(this);
                if(entCol){
                    if(entCol.obj.type == me.game.ENEMY_OBJECT){
                        this.isHurt = true;
                        this.health -= entCol.obj.power;
                        if(entCol.obj.pos.x + 12 < this.pos.x){
                            this.hitLeft = true;
                        }
                        else{
                            this.hitLeft = false;
                        }
                        this.flicker(100);
                        console.log(entCol.obj.power + " damage done. Health: " + this.health);
                    }
                }
            }
        }
        else{
            this.damageTimer++;
            this.vel.x += (this.hitLeft) ? this.accel.x * me.timer.tick : -this.accel.x * me.timer.tick;
            this.setCurrentAnimation("damage");
            if(this.damageTimer == 20){
                this.isHurt = false;
                this.damageTimer = 0;
            }
        }

        // check & update player movement
        this.updateMovement();

        this.centreOffsetY = 40 + this.viewChange;
        this.cameraPos.x = this.pos.x + this.centerOffsetX;
        this.cameraPos.y = this.pos.y + this.centreOffsetY;
        console.log(this.cameraPos.y);

        //call the update
        this.parent(this);
        return true;
    },

    checkInput: function(){

        if (me.input.isKeyPressed('left')) {
            // flip the sprite on horizontal axis
            this.flipX(true);
            // update the entity velocity
            this.vel.x -= this.accel.x * me.timer.tick;
            this.isMoving = true;
            this.aimingLeft = true;
        } else if (me.input.isKeyPressed('right')) {
            // unflip the sprite
            this.flipX(false);
            // update the entity velocity
            this.vel.x += this.accel.x * me.timer.tick;
            this.isMoving = true;
            this.aimingLeft = false;
        } else {
            //this.vel.x = 0;
            this.isMoving = false;
        }

        if(me.input.isKeyPressed('up')) {
            this.image = me.loader.getImage("player_up");
            this.aimingUp = true;
            this.aimingDown = false;
            if(this.viewChange > -80){
                this.viewChange -=4;
                //console.log(this.viewChange);
            }
        }
        else if(me.input.isKeyPressed('down')){
            this.image = me.loader.getImage("player_down");
            this.aimingUp = false;
            this.aimingDown = true;
            if(this.viewChange < 140){
                this.viewChange += 4;
                //console.log(this.viewChange);
            }
        }
        else {
            this.image = me.loader.getImage("player_right");
            this.aimingUp = false;
            this.aimingDown = false;
            if(this.viewChange > 0){
                this.viewChange-=4;
            }
            else if(this.viewChange < 0){
                this.viewChange+=4;
            }
            //console.log(this.viewChange);
        }

        this.jumpForce *= 0.7;

        if (me.input.isKeyPressed("jump")) {
            if (!this.jumping && !this.falling && !this.blockJump) {
                this.jumpForce = this.maxVel.y;
                this.jumping = true;
            }
            this.blockJump = true;
        }
        else {
            this.jumpForce = 0;
            this.blockJump = false;
        }
        this.vel.y -= this.jumpForce * me.timer.tick;

        if (me.input.isKeyPressed('shoot')){
            //SHOOT
            this.shoot();
        }
    },

    shoot: function(){
        //create new bullet

        var xAdjust = this.pos.x;
        var yAdjust = this.pos.y;

        if(this.aimingUp && this.isMoving){
            xAdjust += this.aimingLeft ? 20 : 36;
            yAdjust += 24;
        }
        else if (this.aimingDown && this.isMoving){
            xAdjust += this.aimingLeft ? 15 : 40;
            yAdjust += 95;
        }
        else if(this.aimingDown){
            xAdjust += this.aimingLeft ? 24 : 32;
            yAdjust += 98;
        }
        else if(this.aimingUp){
            xAdjust += 28;
            yAdjust += 24;
        }
        else {
            xAdjust += this.aimingLeft ? 5 : 55;
            yAdjust += 60;

        }

        me.game.add(
            new BulletEntity(xAdjust, yAdjust, this.aimingLeft, this.aimingUp, this.aimingDown),
            this.z
        );
        me.game.sort();
    },

    stateMachine: function(){
        //var velY = this.vel.y;
        switch (true) {
            case (this.vel.y < 0):
                //jump
                if (this.isCurrentAnimation("stand") || this.isCurrentAnimation("step") ||
                    this.isCurrentAnimation("run")){
                    this.setCurrentAnimation("jump", function(){
                        this.setCurrentAnimation("jump2");
                        //this.setAnimationFrame();
                    });
                }
                break;
            case (this.vel.y > 0):
                //fall
                if (this.isCurrentAnimation("jump") || this.isCurrentAnimation("jump2") ||
                    this.isCurrentAnimation("step") || this.isCurrentAnimation("run")){
                    this.setCurrentAnimation("fall", function(){
                        this.setCurrentAnimation("fall2");
                    });
                }
                break;
            case (this.vel.y == 0):
                //stand
                //this.checkAnimation();
                if (this.isCurrentAnimation("fall") || this.isCurrentAnimation("fall2")){
                    this.setCurrentAnimation("land", this.checkAnimation());
                }
                else {
                    this.checkAnimation();
                }
                break;
        }
    },

    checkAnimation: function(){
        if(!this.isMoving){
            this.setCurrentAnimation("stand", function(){
                if(this.isMoving){
                    this.setCurrentAnimation("step", function(){
                        this.setCurrentAnimation("run");
                        this.setAnimationFrame();
                    });
                }
            });
        }
        else if(this.isCurrentAnimation("land")){
            this.setCurrentAnimation("step", function(){
                this.setCurrentAnimation("run");
                this.setAnimationFrame();
            });
        }
    }
});

/**
 * Bullet Entity.
 * User: Chris
 * Date: 06/03/2013
 * Time: 15:11
 * To change this template use File | Settings | File Templates.
 */
var BulletEntity = me.ObjectEntity.extend({

    init: function(x, y, left, up, down) {

        //apply settings
        var settings = {
            name: "player_bullet",
            image: "player_bullet",
            spritewidth: 16,
            spriteheight: 12
        };

        this.parent(x, y, settings); //call the constructor
        this.gravity = 0;           //remove gravity
        this.goingLeft = left;      //check if player is going left
        this.goingUp = up;          //check if player is looking up
        this.goingDown = down;
        this.setVelocity(12, 12);   //set the default horizontal & vertical vertical speed (accel vector)
        this.collidable = true;     //set object to be collidable
        this.type = me.game.ACTION_OBJECT;  //set the object type
        this.updateColRect(8, 12, 10, 12);


        if (this.goingUp){
            this.angle = -1.570796327;
        }
        else if (this.goingDown){
            this.angle = 1.570796327;
        }

        this.addAnimation("flying", [0]);
    },

    update: function(){

        if(this.goingUp){
            this.vel.y += -this.accel.y * me.timer.tick;
        }
        else if (this.goingDown){
            this.vel.y += this.accel.y * me.timer.tick;
        }
        else{
            this.vel.x += (this.goingLeft)? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
        }

        var tempVel = this.vel.clone();
        var envCol = this.updateMovement();

        if (!me.game.viewport.isVisible(this)){
            me.game.remove(this);
        }
        else if (envCol.yprop.isSolid || envCol.xprop.isSolid){
            me.game.remove(this);
        }
        else if (envCol.yprop.isPlatform || envCol.xprop.isPlatform){
            this.vel = tempVel;
            this.computeVelocity(this.vel);
            this.pos.add(this.vel);
        }

        var entCol = me.game.collide(this);

        if(entCol){
            if(entCol.obj.type == me.game.ENEMY_OBJECT) {
                entCol.obj.takeDamage(10);
                me.game.remove(this);
            }
        }

        return true;
    },

    onCollision: function(){

    }
});