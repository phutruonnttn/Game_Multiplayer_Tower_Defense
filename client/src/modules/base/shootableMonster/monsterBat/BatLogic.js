var BatLogic = LogicMonster.extend({

    ctor: function (level, gameMgr, id, HPRatio, isMonsterDrop){
        this._super(MONSTER_TYPE.BAT, level, gameMgr, id, HPRatio, isMonsterDrop);
    },

    getNextPoint: function (){
        if(this.currentPoint.x == -1 && this.currentPoint.y == 1){
            return cc.p(-1, 0);
        }
        if(this.currentPoint.x == -1 && this.currentPoint.y == 0){
            return cc.p(0, 0);
        }
        if(this.currentPoint.x == 4 && this.currentPoint.y == 6){
            return cc.p(4, 7);
        }
        var p = cc.p(this.currentPoint.x + 1, this.currentPoint.y +1);
        if(p.x >= BATTLE.ROWS){
            p.x = BATTLE.ROWS - 1;
        }
        if(p.y >= BATTLE.COLUMNS){
            p.y = BATTLE.COLUMNS - 1;
        }
        return p;
    },

    move: function (thisX, thisY, nextCoordinateX, nextCoordinateY, dt){
        var flagDown = false, flagUp = false, flagRight = false, flagLeft = false;
        if(this.currentPoint.x != this.nextPoint.x && this.currentPoint.y != this.nextPoint.y){
            flagDown = this.moveDown(thisY, nextCoordinateY, dt/1.41)
            flagUp = this.moveUp(thisY, nextCoordinateY, dt/1.41)
            flagRight = this.moveRight(thisX, nextCoordinateX, dt/1.41)
            flagLeft = this.moveLeft(thisX, nextCoordinateX, dt/1.41)
        }else {
            flagDown = this.moveDown(thisY, nextCoordinateY, dt)
            flagUp = this.moveUp(thisY, nextCoordinateY, dt)
            flagRight = this.moveRight(thisX, nextCoordinateX, dt)
            flagLeft = this.moveLeft(thisX, nextCoordinateX, dt)
        }
        this.keyHashDirection = "" + (flagDown&1) + (flagUp&1) + (flagRight&1) + (flagLeft&1)
    },

    getTargetPositionOfCell: function () {
        return this.getCentralOfCell(this.nextPoint.x, this.nextPoint.y);
    }
})