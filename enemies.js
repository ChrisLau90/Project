var SoldierEnemy = me.ObjectEntity.extend({

    init: function(x , y, settings){
        settings.image = "enemy_soldier";
        settings.spritewidth = 72;

        this.parent(x, y, settings);

        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        // size of sprite

        // make him start from the right
        this.pos.x = x + settings.width - settings.spritewidth;

        this.setVelocity(3,5);
        this.animationspeed = me.sys.fps / 20;
        this.updateColRect(24, 30, 38, 70);

        // make it collidable
        this.collidable = true;
        // make it a enemy object
        this.type = me.game.ENEMY_OBJECT;

        this.health = 30;

        this.isActive = false;
        this.isMoving = false;
        this.aimingUp = false;
        this.aimingLeft = true;
        this.aimingDown = false;

        this.readyTimer = 0;
        this.isReady = false;
        this.forcedRun = false;

        // set animations
        this.addAnimation("stand", [0]);
        this.addAnimation("step", [1]);
        this.addAnimation("run", [2,3,4,5,6,7,8,9,10,11]);
        this.addAnimation("aimUp", [12]);
        this.addAnimation("aimDown", [13]);
    },

    // manage the enemy movement
    update: function() {
        // do nothing if not visible
        if (!me.game.viewport.isVisible(this)) {
            return false;
        }

        /*
        if (!this.isActive){
            this.isActive = true;
        }
        */

        if(!this.isReady){
            this.readyTimer++;
            if(this.readyTimer == 30){
                this.isReady = true;
            }
        }

        this.checkAnimation();

        if (this.alive) {
            if(!this.isReady){
                this.updateVel();
            }
            else if (this.playerInSight()){
                this.vel.x = 0;
                this.isMoving = false;
            }
            else {
                this.updateVel();
            }

        } else {
            this.vel.x = 0;
            this.isMoving = false;
        }

        // check and update movement
        this.updateMovement();
        // update animation if necessary
        if (this.vel.x!=0 || this.vel.y!=0) {
            // update object animation
            this.parent();
            return true;
        }
        return false;
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
        if(this.aimingUp){
            this.setCurrentAnimation("aimUp",function(){
                this.setCurrentAnimation("step", function(){
                    this.setCurrentAnimation("run");
                    this.setAnimationFrame();
                });
            });
        }
        else if(this.aimingDown){
            this.setCurrentAnimation("aimDown",function(){
                this.setCurrentAnimation("step", function(){
                    this.setCurrentAnimation("run");
                    this.setAnimationFrame();
                });
            });
        }
    },

    playerInSight: function(){
        var inSight = false;
        var player = me.game.getEntityByName("mainPlayer")[0];
        var angle = this.angleTo(player);

        //console.log(angle);
        //3.141592653589793
        //1.570796327


        if(this.aimingLeft){
            if (angle == 3.141592653589793){
                inSight = true;
            }
            else if(angle > 1.57 && angle < 1.8){
                inSight = true;
                this.aimingDown = true;
            }
            else if(angle > -1.57 && angle < -1.8){
                inSight = true;
                this.aimingUp = true;
            }
            else {
                inSight = false;
                this.aimingDown = false;
                this.aimingUp = false;
            }
        }
        else {
            if (angle == 0){
                inSight = true;
            }
            else if (angle < 1.57 && angle > 1.2){
                inSight = true;
                this.aimingDown = true;
            }
            else if (angle < -1.57 && angle > -1.2){
                inSight = true;
                this.aimingUp = true;
            }
            else {
                inSight = false;
                this.aimingDown = false;
                this.aimingUp = false;
            }
        }

        /*
        if(this.aimingLeft && angle == 3.141592653589793){
            inSight = true;
        }
        else if (!this.aimingLeft && angle == 0 ){
            inSight = true;
        }
        else if (angle > -1.54 && angle < -1.6){
            inSight = true;
            this.aimingUp = true;
            this.isMoving = false;
        }
        else if (angle > 1.54 && angle < 1.6){
            inSight = true;
            this.aimingDown = true;
            this.isMoving = false;
        }
        else {
            inSight = false;
            this.aimingUp = false;
            this.aimingDown = false;
        }
        */
        return inSight;
    },

    updateVel: function(){
        if (this.aimingLeft && this.pos.x <= this.startX) {
            this.aimingLeft = false;
        } else if (!this.aimingLeft && this.pos.x >= this.endX) {
            this.aimingLeft = true;
        }
        // make it walk
        this.flipX(this.aimingLeft);
        this.isMoving = true;
        this.vel.x += (this.aimingLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
    },

    shoot: function(){

        //create new bullet
        var xAdjust = this.pos.x;
        var yAdjust = this.pos.y;

        if(this.aimingDown){
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

    takeDamage: function(value){
        this.health -= value;
        console.log(value + " damage taken. Health: " + this.health);
    },

    setReady: function(){
        this.isReady = true;
    }
});

var RollerEnemy = me.ObjectEntity.extend({
    init: function(){
        settings.image = "roller";
        settings.spritewidth = 72;

        this.parent(x, y, settings)

        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;

        this.pos.x = x + settings.width - settings.spritewidth;

        this.setVelocity(3,5);
        this.animationspeed = me.sys.fps / 20;

        this.collidable = true;

        this.type = me.game.ENEMY_OBJECT;

        this.addAnimation("roll", [0,1,2]);
        this.addAnimation("fall", [3,4,5,6,7,8]);
    },

    update: function(){
        if(!me.game.viewport.isVisible(this)){
            return false;
        }

        if(this.pos.x >= this.endX) {
            this.vel.x += -this.accel.x + timer.tick;
        }
    }
})