let LogicMonster = ShootableObject.extend({
    ctor: function (typeOfMonster, level, gameMgr, id, HPRatio, isMonsterDrop){

        this._super(id);
        this.gameMgr = gameMgr
        this.clock = 0;
        this.stat = CardStat.getInstance().getStatMonster(typeOfMonster, level)
        this.gainEnergy = this.stat.gainEnergy
        if (isMonsterDrop) {
            this.gainEnergy = 0
        }

        this.baseSpeed = Utils.round(this.stat.speed * BATTLE.SQUARE_SIZE);
        this.curSpeed = this.baseSpeed;
        this.weight = this.stat.weight;

        this.listSpeedUpBuff = new NotAccumulateBuff();
        this.listSpeedDownBuff = new NotAccumulateBuff();
        this.listHpBuffUp = new NotAccumulateBuff();
        this.listHpBuffDown = new NotAccumulateBuff();
        this.listTakenDamageUpBuff = new NotAccumulateBuff();
        this.listTakenDamageDownBuff = new NotAccumulateBuff();
        this.freeze = new FreezeBuff(0, this.clock);
        this.stun = new StunBuff(0, this.clock);

        this.moveType = this.stat.moveType;
        this.alibity = this.stat.alibity;

        this.baseHp = Utils.round(this.stat.hp * HPRatio)
        this.currentHP = Utils.round(this.stat.hp * HPRatio);
        this.hitRadius = this.stat.hitRadius;

        this.currentPoint = cc.p(BATTLE.STARTING_POINT.x-1, BATTLE.STARTING_POINT.y+1)
        this.joinToCellLogic()
        this.previousPoint = cc.p(this.currentPoint.x - 1, this.currentPoint.y)

        this.position = cc.p(0, 0)
        this.position.x = 0
        this.position.y = 0
        this.nextPoint = this.getNextPoint()

        this.targetPosition = this.getTargetPositionOfCell();
        this.currentTypeDirection = 0
        this.keyHashDirection = ""
        this.isReachedTarget = false
        this.isDied = false
        this.isDiedByHole = false;

        this.countVectorDirection = 0
        this.currentVectorDirection = cc.p(0,0)
        this.speedThrown = 0;
        this.positionHole = cc.p(0, 0);

        // For UI
        this.buffHpUpAni = false;
        this.oilEffect = false;
    },

    addOilEffect: function (){
        this.oilEffect = true;
    },

    setCurrentSpeed: function (speed) {
        this.curSpeed = Utils.round(speed)
    },

    setPositionX: function (x) {
        this.position.x = Utils.round(x)
    },

    setPositionY: function (y) {
        this.position.y = Utils.round(y)
    },

    getHitRadius: function () {
        return Utils.round(this.hitRadius * BATTLE.SQUARE_SIZE);
    },

    initPosition: function (x,y) {
        this.setPositionX(x)
        this.setPositionY(y)
    },

    decreaseHP: function (amount) {
        let down = 0, up = 0;
        let buffUp = this.listTakenDamageUpBuff.getBuffActive(this.clock);
        let buffDown = this.listTakenDamageDownBuff.getBuffActive(this.clock);
        if(buffUp){
            up = buffUp.getValue();
        }
        if(buffDown){
            down = buffDown.getValue();
        }
        amount *= 1 + up - down;
        this._super(amount);
    },

    decreaseSpeed: function (amount) {
        this.baseSpeed = Math.max(0, this.baseSpeed - amount)
    },

    increaseSpeed: function (amount) {
        let typeOfMonster;
        this.baseSpeed = Math.min(gv.MONSTER_JSON.monster[typeOfMonster].speed * BATTLE.SQUARE_SIZE, this.speed + amount)
    },

    // Kiem tra xem den dich hay chua
    checkReachedTarget: function () {
        if (this.currentPoint.x == BATTLE.TARGET_POINT.x
            && this.currentPoint.y == BATTLE.TARGET_POINT.y) {
            return true
        }
        return false
    },

    updateCurrentAndPreviousPoint: function (){
        this.outCellLogic();
        this.previousPoint = cc.p(this.currentPoint.x, this.currentPoint.y)
        this.currentPoint = cc.p(this.nextPoint.x,this.nextPoint.y)
        this.joinToCellLogic();
    },

    joinToCellLogic: function (){
        this.gameMgr.addMonsterToCellTable(this, this.currentPoint.x, this.currentPoint.y);
    },
    outCellLogic: function (){
        this.gameMgr.removeMonsterOnCellTable(this, this.currentPoint.x, this.currentPoint.y);
    },

    // Kiem tra xem den vi tri can den chua de doi huong sang o tiep theo
    checkReachedCurTarget: function () {
        if(Math.abs(this.position.x - this.targetPosition.x) < BATTLE.DELTA_DISTANCE
            && Math.abs(this.position.y - this.targetPosition.y) < BATTLE.DELTA_DISTANCE){
            return true;
        }
        return false;
    },

    getTargetPositionOfCell: function () {
        var curCentral = this.getCentralOfCell(this.currentPoint.x, this.currentPoint.y);
        var centralOfCell = this.getCentralOfCell(this.nextPoint.x, this.nextPoint.y)
        return cc.p(
            Utils.round((curCentral.x + centralOfCell.x)/2),
            Utils.round((curCentral.y + centralOfCell.y)/2)
        );
    },

    // Tra ve toa do tam cua 1 o
    getCentralOfCell: function (x,y) {
        var gameMgrHeight = BATTLE.SQUARE_SIZE * BATTLE.ROWS
        return cc.p(
            Utils.round(y * BATTLE.SQUARE_SIZE + BATTLE.SQUARE_SIZE/2),
            Utils.round(gameMgrHeight - x * BATTLE.SQUARE_SIZE - BATTLE.SQUARE_SIZE/2)
        )
    },

    // Kiem tra neu vi tri tiep theo can di len thi di chuyen monster di len
    // Neu sau khi di len qua toa do can den thi fix bang dung toa do do
    moveUp: function (thisY, nextCoordinateY, dt) {
        if (thisY + BATTLE.DELTA_DISTANCE < nextCoordinateY) {
            if (this.position.y + this.curSpeed*dt > nextCoordinateY) {
                this.setPositionY(nextCoordinateY)
            } else {
                this.setPositionY(this.position.y + this.curSpeed*dt)
            }
            return true
        }
        return false
    },

    // Kiem tra neu vi tri tiep theo can di xuong thi di chuyen monster di xuong
    // Neu sau khi di xuong ma qua toa do can den thi fix bang dung toa do do
    moveDown: function (thisY, nextCoordinateY, dt) {
        if (thisY > nextCoordinateY + BATTLE.DELTA_DISTANCE) {
            if (this.position.y - this.curSpeed*dt < nextCoordinateY) {
                this.setPositionY(nextCoordinateY)
            } else {
                this.setPositionY(this.position.y - this.curSpeed*dt)
            }
            return true
        }
        return false
    },

    // Kiem tra neu vi tri tiep theo can di sang trai thi di chuyen monster di sang trai
    // Neu sau khi di sang trai qua toa do can den thi fix bang dung toa do do
    moveLeft: function (thisX, nextCoordinateX, dt) {
        if (thisX > nextCoordinateX + BATTLE.DELTA_DISTANCE){
            if (this.position.x - this.curSpeed*dt < nextCoordinateX) {
                this.setPositionX(nextCoordinateX)
            } else {
                this.setPositionX(this.position.x - this.curSpeed*dt)
            }
            return true
        }
        return false
    },

    // Kiem tra neu vi tri tiep theo can di sang phai thi di chuyen monster di sang phai
    // Neu sau khi di sang phai qua toa do can den thi fix bang dung toa do do
    moveRight: function (thisX, nextCoordinateX, dt) {
        if (thisX + BATTLE.DELTA_DISTANCE < nextCoordinateX){
            if (this.position.x + this.curSpeed*dt > nextCoordinateX) {
                this.setPositionX(nextCoordinateX)
            } else {
                this.setPositionX(this.position.x + this.curSpeed*dt)
            }
            return true
        }
        return false
    },

    move: function (thisX, thisY, nextCoordinateX, nextCoordinateY, dt) {
        var flagDown = false, flagUp = false, flagRight = false, flagLeft = false
        var centralCurrentPoint = this.getCentralOfCell(this.currentPoint.x, this.currentPoint.y)

        // Calculate turn point
        var distanceToTurn = Utils.round(BATTLE.SQUARE_SIZE * BATTLE.RATIO_DISTANCE_TO_TURN)
        var turnPointTop = centralCurrentPoint.y + distanceToTurn
        var turnPointLeft = centralCurrentPoint.x - distanceToTurn
        var turnPointBottom = centralCurrentPoint.y - distanceToTurn
        var turnPointRight = centralCurrentPoint.x + distanceToTurn

        // Di chuyen theo tung huong
        if (turnPointLeft <= thisX
            && thisX <= turnPointRight
            && turnPointBottom <= thisY
            && thisY <= turnPointTop
        )
        {
            flagDown = this.moveDown(thisY, nextCoordinateY, dt/1.41)
            flagUp = this.moveUp(thisY, nextCoordinateY, dt/1.41)
            flagRight = this.moveRight(thisX, nextCoordinateX, dt/1.41)
            flagLeft = this.moveLeft(thisX, nextCoordinateX, dt/1.41)
        }
        else {
            if (turnPointLeft <= thisX
                && thisX <= turnPointRight) {
                flagDown = this.moveDown(thisY, nextCoordinateY, dt)
                flagUp = this.moveUp(thisY, nextCoordinateY, dt)
            } else if (turnPointBottom <= thisY
                && thisY <= turnPointTop) {
                flagRight = this.moveRight(thisX, nextCoordinateX, dt)
                flagLeft = this.moveLeft(thisX, nextCoordinateX, dt)
            }
        }

        // Set keyHashDirection de update frame theo huong di chyen
        this.keyHashDirection = "" + (flagDown&1) + (flagUp&1) + (flagRight&1) + (flagLeft&1)
    },

    // tang toc
    speedUp: function (per = 0, amount = 0, timeEffect = 0){
        this.buffSpeed(this.listSpeedUpBuff, per, amount, timeEffect);
    },
    // giam toc
    speedDown: function (per = 0, amount = 0, timeEffect = 0){
        this.buffSpeed(this.listSpeedDownBuff, per, amount, timeEffect);
    },
    // thay doi toc do
    buffSpeed: function (listSpeedBuff, per = 0, amount = 0, timeEffect = 0){

        let dv =  amount + this.baseSpeed*per;
        let  buff = listSpeedBuff.getBuff(dv);
        if(buff){
            buff.setTimeEffect(timeEffect, this.clock);
        }else {
            listSpeedBuff.addBuff(new SpeedBuff(timeEffect, dv, this.clock));
        }
    },

    updateSpeed: function (){

        if(this.isFrozen() || this.isStunned() || this.speedThrown > 0){
            this.curSpeed = 0;
            return;
        }
        let down = 0, up = 0;
        let speedUpBuff = this.listSpeedUpBuff.getBuffActive(this.clock);
        let speedDownBuff = this.listSpeedDownBuff.getBuffActive(this.clock);
        if(speedUpBuff){
            up = speedUpBuff.getValue();
        }
        if(speedDownBuff){
            down = speedDownBuff.getValue();
        }
        this.setCurrentSpeed(this.baseSpeed + up - down)
    },

    //dong bang
    freezeMonster: function (time) {
        this.freeze.setTimeEffect(time, this.clock);
    },
    log: function (){
        cc.log(this.clock+" "+this.id+" "+  JSON.stringify(this.position))
        cc.log(this.currentPoint.x+ " " +this.currentPoint.y)
    },

    isCollision: function (pos1, radius1, pos2, radius2) {
        var distanceRadius = Utils.round((radius1 + radius2) * BATTLE.SQUARE_SIZE)
        if (Utils.round((pos1.x - pos2.x) * (pos1.x - pos2.x))
            + Utils.round((pos1.y - pos2.y) * (pos1.y - pos2.y))
            <= Utils.round(distanceRadius * distanceRadius)) {
            return true
        }
        return false
    },

    isCollisionBorder: function (position) {
        var listPoint = [
            cc.p(position.x + this.hitRadius* BATTLE.SQUARE_SIZE, position.y),
            cc.p(position.x - this.hitRadius* BATTLE.SQUARE_SIZE, position.y),
            cc.p(position.x, position.y + this.hitRadius* BATTLE.SQUARE_SIZE),
            cc.p(position.x, position.y - this.hitRadius* BATTLE.SQUARE_SIZE),
        ]

        for (var i = 0; i < listPoint.length; i++) {
            if (!this.isInCell(listPoint[i], this.currentPoint)
                && !this.isInCell(listPoint[i], this.nextPoint)
                && !this.isInCell(listPoint[i], this.previousPoint)) {
                return true
            }
        }
        return false
    },

    isFrontOfMonster: function (thisPosition, position, currentVector) {
        var direction = BATTLE.MAP_DIRECTION_TOP_LEFT_ORIGIN[currentVector.x + 1][currentVector.y + 1]
        switch (direction) {
            case BATTLE.LEFT:
                return position.x < thisPosition.x
            case BATTLE.RIGHT:
                return position.x > thisPosition.x
            case BATTLE.TOP:
                return position.y > thisPosition.y
            case BATTLE.BOTTOM:
                return position.y < thisPosition.y
        }
    },

    calculateKeyHashDirection: function (vectorDirection) {
        var flagDown = false, flagUp = false, flagRight = false, flagLeft = false
        if (vectorDirection.x >= 0.9) {
            flagRight = true
        }
        if (vectorDirection.x <= -0.9) {
            flagLeft = true
        }
        if (vectorDirection.y >= 0.9) {
            flagUp = true
        }
        if (vectorDirection.y <= -0.9) {
            flagDown = true
        }

        if (0<vectorDirection.x && vectorDirection.x < 0.9
            && -0.9<vectorDirection.y && vectorDirection.y < 0) {
            flagRight = true
            flagDown = true
        }

        if (0<vectorDirection.x && vectorDirection.x < 0.9
            && 0<vectorDirection.y && vectorDirection.y < 0.9) {
            flagRight = true
            flagUp = true
        }

        if (-0.9<vectorDirection.x && vectorDirection.x < 0
            && 0<vectorDirection.y && vectorDirection.y < 0.9) {
            flagLeft = true
            flagUp = true
        }

        if (-0.9<vectorDirection.x && vectorDirection.x < 0
            && -0.9<vectorDirection.y && vectorDirection.y < 0) {
            flagLeft = true
            flagDown = true
        }

        this.keyHashDirection = "" + (flagDown&1) + (flagUp&1) + (flagRight&1) + (flagLeft&1)

    },

    moveAndDodge: function (dt) {
        if (this.countVectorDirection > 0) {
            this.countVectorDirection --
            this.setPositionX(this.position.x + Utils.round(this.currentVectorDirection.x*Utils.round(this.curSpeed*dt)))
            this.setPositionY(this.position.y + Utils.round(this.currentVectorDirection.y*Utils.round(this.curSpeed*dt)))
            return
        }

        var currentVector = Utils.getInstance().getVector(this.currentPoint, this.nextPoint)
        var currentVectorDirection = Utils.getInstance().normalizeVector(
            Utils.getInstance().getVector(this.position, this.getCentralOfCell(this.nextPoint.x, this.nextPoint.y))
        )

        // Xac dinh tam duong tron lay tiep tuyen
        var sumX = 0, sumY = 0, n = 0
        for (var i = 0; i < this.gameMgr.listLogicMonster.length; i++) {
            var monster = this.gameMgr.listLogicMonster[i]
            if (this.id != monster.id
                && this.canFly() == monster.canFly()
                && this.isFrontOfMonster(this.position, monster.position, currentVector)
                && this.isCollision(this.position, this.hitRadius, monster.position, monster.hitRadius)
                ) {
                sumX += monster.position.x
                sumY += monster.position.y
                n++
            }
        }

        // Co xay ra va cham
        if (n != 0){
            var centralCircle = cc.p(Utils.round(sumX/n), Utils.round(sumY/n))

            var newVector = Utils.getInstance().getVector(this.position, centralCircle)
            var newVectorDirection = Utils.getInstance().normalizeVector(newVector)

            var vectorDirection1 = cc.p(-newVectorDirection.y, newVectorDirection.x)
            var vectorDirection2 = cc.p(newVectorDirection.y, -newVectorDirection.x)

            var vectorDirection = Utils.getInstance().getCosAngle2Vector(currentVectorDirection, vectorDirection1) >=0 ? vectorDirection1 : vectorDirection2;
            var newPos = cc.p(
                this.position.x + Utils.round(vectorDirection.x*Utils.round(this.curSpeed*dt)),
                this.position.y + Utils.round(vectorDirection.y*Utils.round(this.curSpeed*dt))
            )
            if (!this.isCollisionBorder(newPos)) {
                this.countVectorDirection = 5
                this.currentVectorDirection = vectorDirection
                this.setPositionX(newPos.x)
                this.setPositionY(newPos.y)

                this.calculateKeyHashDirection(vectorDirection)
            } else {
                this.setPositionX(this.position.x + Utils.round(currentVectorDirection.x*Utils.round(this.curSpeed*dt)))
                this.setPositionY(this.position.y + Utils.round(currentVectorDirection.y*Utils.round(this.curSpeed*dt)))

                this.calculateKeyHashDirection(currentVectorDirection)
            }
        } else {
            this.setPositionX(this.position.x + Utils.round(currentVectorDirection.x*Utils.round(this.curSpeed*dt)))
            this.setPositionY(this.position.y + Utils.round(currentVectorDirection.y*Utils.round(this.curSpeed*dt)))

            this.calculateKeyHashDirection(currentVectorDirection)
        }
    },

    isInCell: function (position, cell) {
        var curPoint = this.gameMgr.gameGUI.getCellPositionGameGUI(position)
        return (curPoint.x == cell.x && curPoint.y == cell.y)
    },

    checkMonsterInNextCell: function () {
        var listPoint = [
            cc.p(this.position.x + this.hitRadius* BATTLE.SQUARE_SIZE, this.position.y),
            cc.p(this.position.x - this.hitRadius* BATTLE.SQUARE_SIZE, this.position.y),
            cc.p(this.position.x, this.position.y + this.hitRadius * BATTLE.SQUARE_SIZE),
            cc.p(this.position.x, this.position.y - this.hitRadius * BATTLE.SQUARE_SIZE),
        ]

        for (var i = 0; i < listPoint.length; i++) {
            if (!this.isInCell(
                cc.p(Utils.round(listPoint[i].x), Utils.round(listPoint[i].y)),
                this.nextPoint)) {
                return false
            }
        }
        return true
    },

    updateDodge: function (dt) {
        this.clock += 1;
        // If monster is reached target -> do nothing
        if (this.isReachedTarget || this.isDied) {
            this.outCellLogic();
            return
        }
        this.updateSpeed();

        this.updateHp();
        this.runAbility();

        if(!this.nextPoint || this.checkMonsterInNextCell()){
            this.updateCurrentAndPreviousPoint();
            this.nextPoint = this.getNextPoint();

            this.targetPosition = this.getTargetPositionOfCell();
            if (this.checkReachedTarget()) {
                this.isReachedTarget = true
                this.isDied = true
                this.outCellLogic();
                return
            }
        }
        this.moveAndDodge(dt)
        if(this.speedThrown > 0){
            this.moveByThrowing(dt);
        }
    },

    update: function (dt) {
        this.dt = dt;
        this.clock += 1;
        // If monster is reached target -> do nothing
        if (this.isReachedTarget) {
            this.outCellLogic();
            return
        }
        this.updateSpeed();
        this.updateHp();
        this.runAbility();

        if(!this.nextPoint  || this.checkReachedCurTarget()){
            this.updateCurrentAndPreviousPoint();
            this.nextPoint = this.getNextPoint();

            this.targetPosition = this.getTargetPositionOfCell();
            if (this.checkReachedTarget()) {
                this.isReachedTarget = true
                this.isDied = true
                this.outCellLogic();
                return
            }
        }
        this.move(this.position.x,this.position.y, this.targetPosition.x, this.targetPosition.y, dt)
        if(this.speedThrown > 0){
            this.moveByThrowing(dt);
        }
    },

    getNextPoint: function (){

        return this.gameMgr.mapLogic.getNextPointOfMonster(this.previousPoint,
            this.currentPoint.x, this.currentPoint.y)
    },

    buffHpUp: function (timeEffect, delay, hp){

        this.buffHp(this.listHpBuffUp, timeEffect, delay, hp);
    },

    buffHpDown: function (timeEffect, delay, hp){

        this.buffHp(this.listHpBuffDown, timeEffect, delay, hp);
    },

    buffHp: function (listBuffHp, timeEffect, delay, hp){

        let buff = listBuffHp.getBuff(hp);
        if(buff){
            buff.setTimeEffect(timeEffect, this.clock);
        }else {
            listBuffHp.addBuff(new HealBuff(timeEffect, delay, hp, this.clock));
        }
    },

    updateHp: function (){

        let down = 0,up = 0;
        let buffUp = this.listHpBuffUp.getBuffActive(this.clock);
        let buffDown = this.listHpBuffDown.getBuffActive(this.clock);
        if(buffUp){
            up = buffUp.getHp();
        }
        if(buffDown){
            down = buffDown.getHp();
        }

        this.decreaseHP(down);
        this.increaseHP(up);
    },

    runAbility: function (){

    },

    updateTarget: function (){

        this.nextPoint = this.getNextPoint();
        this.targetPosition = this.getTargetPositionOfCell();
    },

    isHealing: function (){
        return this.buffHpUpAni;
    },

    canFly: function (){

        return this.moveType == BATTLE.MONSTER_FLY;
    },

    isSlow: function (){

        return this.curSpeed < this.baseSpeed;
    },

    isFrozen: function () {

        return this.freeze.checkStatus(this.clock);
    },

    stunMonster: function (time){

        this.stun.setTimeEffect(time, this.clock);
    },
    
    isStunned: function (){

        return this.stun.checkStatus(this.clock);
    },
    isShield: function (){

        return this.listTakenDamageUpBuff.getBuffActive(this.clock)!=null;
    },
    isOilEffect: function (){
        return this.oilEffect;
    },
    buffDamageTaken: function (listTakenDamageBuff, percentage, time){

        let buff = listTakenDamageBuff.getBuff(percentage);
        if(buff){
            buff.setTimeEffect(time, this.clock);
        }else {
            listTakenDamageBuff.addBuff(new TakenDamageBuff(time, percentage, this.clock));
        }

    },
    buffTakenDamageUp: function (percentage, time){
        this.buffDamageTaken(this.listTakenDamageUpBuff, percentage, time)
    },
    buffTakenDamageDown: function (percentage, time){
        this.buffDamageTaken(this.listTakenDamageDownBuff, percentage, time)
    },
    thrownOut: function (from){
        this.speedThrown = Utils.round(BATTLE.STANDARD_SPEED*4);
        this.vectorThrown  = Utils.getInstance().normalizeVector(
            cc.p(this.position.x - from.x, this.position.y - from.y));
    },
    moveByThrowing: function (dt){
        let pos = cc.p(
            Utils.round(this.position.x + this.vectorThrown.x*this.speedThrown*dt),
            Utils.round(this.position.y + this.vectorThrown.y*this.speedThrown*dt)
        );
        let point = this.convertPositionToPoint(pos);
        if(this.gameMgr.getCell(point.x, point.y)){
            if(this.gameMgr.mapLogic.getTypeOfCell(point.x, point.y) == BATTLE.HOLE_TYPE ||
                this.gameMgr.mapLogic.getTypeOfCell(point.x, point.y) == BATTLE.LAND_TYPE){
                this.position = pos;
                this.outCellLogic();
                this.currentPoint = point;
                this.joinToCellLogic();
                this.updateTarget();
            }
            if(this.gameMgr.mapLogic.getTypeOfCell(point.x, point.y) == BATTLE.HOLE_TYPE){
                this.positionHole = this.getCentralOfCell(point.x, point.y);
                this.isDiedByHole = true;
                this.isDied = true;
                this.outCellLogic();
            }
        }
        this.speedThrown -= Utils.round(2*Math.max(this.weight, BATTLE.STANDARD_WEIGHT)*dt);

    },
    convertPositionToPoint: function (position) {
        return this.gameMgr.gameGUI.getCellPositionGameGUI(position);
    },

    isBoss: function () {
        return false
    }
})
