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
        this.gunTimer = 0;

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
                this.gunTimer++;
                if(this.gunTimer % 10 == 0){
                    this.shoot();
                }
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

        /*
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
        */


        if(this.aimingLeft && angle == 3.141592653589793){
            inSight = true;
        }
        else if (!this.aimingLeft && angle == 0 ){
            inSight = true;
        }
        else if (angle > -1.50 && angle < -1.64){
            inSight = true;
            this.aimingUp = true;
            this.isMoving = false;
        }
        else if (angle > 1.50 && angle < 1.64){
            inSight = true;
            this.aimingDown = true;
            this.isMoving = false;
        }
        else {
            inSight = false;
            this.aimingUp = false;
            this.aimingDown = false;
        }

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
            new EnemyBullet(xAdjust, yAdjust, this.aimingLeft, this.aimingUp, this.aimingDown),
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

var EnemyBullet = me.ObjectEntity.extend({
    init: function(x, y, left, up, down){

        var settings = {
            name: "enemy_bullet",
            image: "enemy_bullet",
            spritewidth: 16,
            spriteheight: 12
        };

        this.parent(x, y, settings); //call the constructor
        this.gravity = 0;           //remove gravity
        this.goingLeft = left;      //check if player is going left
        this.goingUp = up;          //check if player is looking up
        this.goingDown = down;
        this.setVelocity(8, 8);   //set the default horizontal & vertical vertical speed (accel vector)
        this.collidable = true;     //set object to be collidable
        this.type = me.game.ACTION_OBJECT;  //set the object type

        if (this.goingUp){
            this.angle = -1.570796327;
        }
        else if (this.goingDown){
            this.angle = 1.570796327;
        }
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

        /*
        if(entCol){
            entCol.obj.takeDamage(10);
            me.game.remove(this);
        }
        */

        return true;
    }
});

var RollerEnemy = me.ObjectEntity.extend({
    init: function(x , y, settings){
        settings.image = "enemy_roller";
        settings.spritewidth = 76;

        this.parent(x, y, settings);

        this.startX = x;
        this.endX = x + settings.width - settings.spritewidth;
        //set moving boundaries

        this.goingLeft = settings.goingLeft;

        if(this.goingLeft){
            this.pos.x = x + settings.width - settings.spritewidth;
        }
        else{
            this.pos.x = x;
        }

        this.setVelocity(3,5);
        this.animationspeed = me.sys.fps / 20;
        this.updateColRect(-1, 0, 0, 74);

        this.collidable = true;

        this.type = me.game.ENEMY_OBJECT;

        this.health = 30;

        this.isMoving = false;

        this.addAnimation("roll", [0,1,2]);
        this.addAnimation("fall", [3,4,5,6,7,8]);
    },

    update: function(){
        if(!me.game.viewport.isVisible(this)){
            return false;
        }

        if(this.alive){
            if (this.goingLeft && this.pos.x > this.startX){
                this.isMoving = true;
                this.vel.x -= this.accel.x * me.timer.tick;
            }
            else if (!this.goingLeft && this.pos.x < this.endX){
                this.flipX(true);
                this.isMoving = true;
                this.vel.x += this.accel.x * me.timer.tick;
            }
            else{
                this.vel.x = 0;
                this.isMoving = false;
                this.die();
            }
        }

        else{
            this.vel.x = 0;
            this.isMoving = false;
            this.die();
        }

        if(this.health <= 0){
            this.alive = false;
            this.die();
        }

        this.updateMovement();
        this.checkAnimation();

        this.parent();
        return true;

    },

    checkAnimation: function(){
        if(this.isMoving){
            this.setCurrentAnimation("roll");
        }
    },

    takeDamage: function(value){
        this.health -= value;
        console.log(value + " damage taken. Health: " + this.health);
    },

    die: function(){
        this.setCurrentAnimation("fall", function(){
            me.game.remove(this);
        })
    }
});

var CannonEnemy = me.ObjectEntity.extend({
    init: function(x, y, settings){
        settings.image = "enemy_cannon";
        settings.spritewidth = 120;

        this.parent(x, y, settings);

        this.pos.x = x;

        this.setVelocity(0,5);
        this.animationspeed = me.sys.fps / 20;
        //UPDATE COLRECT

        this.goingLeft = settings.goingLeft;
        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;

        this.health = 100;

        this.idleTimer = 0;
        this.delayTimer = 0;
        this.firingTimer = 0;
        this.rocketsFired = 0;

        this.isIdle = true;
        this.isOpen = false;
        this.isDelayed = false;
        this.isFiring = false;
        this.hasFired = false;

        this.addAnimation("idle", [0,1]);
        this.addAnimation("opening", [2,3,4,5,6,7,8,9]);
        this.addAnimation("open", [10]);
        this.addAnimation("fire", [11]);
        this.addAnimation("closing", [6,5,4,3,2])
    },

    update: function(){

        if (!me.game.viewport.isVisible(this)) {
            return false;
        }

        if(this.isIdle && !this.isOpen){
            this.idleTimer++;

            if(this.idleTimer % 50 == 0 && !this.isDelayed){
                this.isIdle = false;
                this.isDelayed = true;
            }
        }
        else if(this.isDelayed && !this.hasFired){
            this.delayTimer++;
            if(this.delayTimer % 30 == 0){
                this.isDelayed = false;
                //check level + fire
            }
        }
        else if(!this.isDelayed && !this.hasFired){
            this.firingTimer++;
            if(this.firingTimer % 50 == 0){
                this.rocketsFired++;
                this.fireRocket(this.rocketsFired);

                //this.firePlasma();
                //this.isFiring = true;
            }
        }
        else if(this.isDelayed && this.hasFired){
            this.delayTimer++;
            if(this.delayTimer % 30 == 0){
                this.isDelayed = false;

            }
        }

        this.updateMovement();
        this.checkAnimation();

        this.parent();
        return true;
    },

    checkAnimation: function(){
        if(this.isIdle && !this.isOpen){
            this.setCurrentAnimation("idle");
        }
        else if(!this.isIdle && !this.isOpen){
            this.setCurrentAnimation("opening", function(){
                this.setCurrentAnimation("open");
                this.isOpen = true;
            });
        }
        else if(this.isOpen && this.isFiring){
            this.setCurrentAnimation("fire", function(){
                if (this.isOpen && !this.isFiring && this.isDelayed){
                    this.setCurrentAnimation("open", function(){
                        if (!this.isDelayed){
                            this.setCurrentAnimation("closing", function(){
                                this.setCurrentAnimation("idle", function(){
                                    this.isIdle = true;
                                    this.isOpen = false;
                                    this.hasFired = false;
                                })
                            })
                        }
                    });
                }
            });
        }
    },

    fireRocket: function(){

        this.isFiring = true;

        //create new bullet
        var xAdjust = this.pos.x;
        var yAdjust = this.pos.y + 64;

        xAdjust += (this.rocketsFired == 1) ? 18 : 60;

        me.game.add(
            new CannonRocket(xAdjust, yAdjust, this.goingLeft),
            this.z+1
        );

        if(this.rocketsFired == 2){
            this.rocketsFired = 0;
            this.isFiring = false;
            this.hasFired = true;
            this.isDelayed = true;
        }

        me.game.sort();

    },

    firePlasma: function(){
        this.isFiring = true;
        //console.log('1 ' + this.isFiring);

        var xAdjust1 = this.pos.x + 18;
        var xAdjust2 = this.pos.x + 60;
        var yAdjust = this.pos.x + 64;

        me.game.add(
            new CannonPlasma(xAdjust1, yAdjust, this.goingLeft),
            this.z+1
        );

        me.game.add(
            new CannonPlasma(xAdjust2, yAdjust, this.goingLeft),
            this.z+1
        );

        this.isFiring = false;
        this.hasFired = true;
        this.isDelayed = true;
        //console.log('1 ' + this.isFiring);

        me.game.sort();
    },

    checkPlayerLevel: function(){
        var isLevel = false;
    }
});

var CannonRocket = me.ObjectEntity.extend({
    init: function(x, y, left){
        var settings = {
            name: "enemy_cannon_rocket",
            image: "enemy_cannon_rocket",
            spritewidth: 32,
            spriteheight: 22
        };

        this.parent(x, y, settings);    //call the constructor
        this.gravity = 0;               //remove gravity
        this.goingLeft = left;          //check if player is going left
        this.setVelocity(9, 0);         //set the default horizontal & vertical vertical speed (accel vector)
        this.collidable = true;         //set object to be collidable
        this.type = me.game.ACTION_OBJECT;
    },

    update: function(){

        this.vel.x += (this.goingLeft)? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;

        var tempVel = this.vel.clone();
        var envCol = this.updateMovement();

        if (!me.game.viewport.isVisible(this) || envCol.xprop.isSolid){
            me.game.remove(this);
        }

        var entCol = me.game.collide(this);

        /*
         if(entCol){
         entCol.obj.takeDamage(10);
         me.game.remove(this);
         }
         */

        return true;
    }
});

var CannonPlasma = me.ObjectEntity.extend({
    init: function(x, y, left){
        var settings = {
            name: "enemy_cannon_plasma",
            image: "enemy_cannon_plasma",
            spritewidth: 32,
            spriteheight: 32
        };

        this.parent(x, y, settings);
        this.goingLeft = left;
        this.setVelocity(8,8);
        this.collidable = true;
        this.type = me.game.ACTION_OBJECT;

        this.addAnimation("active", [0,1,2]);
        this.setCurrentAnimation("active");
    },

    update: function(){

        this.vel.x += this.vel.x += (this.goingLeft)? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;

        this.updateMovement();

        /*
        if(!me.game.viewport.isVisible(this) || envCol.xprop.isSolid){
            console.log("shit");
            me.game.remove(this);
        }
        */

        this.parent();
        return true;

    }
});

var ChopperEnemy = me.ObjectEntity.extend({
    init: function(x, y, settings){
        settings.image = "enemy_chopper";
        settings.spritewidth = 62;

        this.parent(x, y, settings);

        this.setVelocity(2,2);
        this.animationspeed = me.sys.fps / 40;
        //UPDATE COLRECT

        this.collidable = true;
        this.type = me.game.ENEMY_OBJECT;
        this.gravity = 0;

        this.health = 30;
        this.moveAngle = Math.sin((45).degToRad());

        this.addAnimation("active",[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
        this.setCurrentAnimation("active");

    },

    update: function(){

        if(!me.game.viewport.isVisible(this)) {
            return false;
        }

        //get player entity
        var player = me.game.getEntityByName("mainPlayer")[0];

        //create vector based on player's postion
        var xDir = player.pos.x - this.pos.x;
        var yDir = player.pos.y - this.pos.y;

        //Decide distance
        xDir = (Math.abs(xDir) < 8) ? 0 : xDir.clamp(-1,1);
        yDir = (Math.abs(yDir) < 8) ? 0 : yDir.clamp(-1,1);

        if (xDir && yDir) {
            xDir *= this.moveAngle;
            yDir *= this.moveAngle;
        }

        this.vel.x = this.accel.x * xDir;
        this.vel.y = this.accel.y * yDir;

        this.updateMovement();

        this.parent();
        return true;

    }
});

var WaspEnemy = me.ObjectEntity.extend({

});
