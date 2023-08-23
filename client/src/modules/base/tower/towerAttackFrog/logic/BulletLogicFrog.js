/**
 * Created by Team 2 - LongLH - GDF 17 on 6/11/2022.
 */


var BulletLogicFrog = BulletLogicStraight.extend({

    ctor: function (towerLogicAttack) {
        this._super(towerLogicAttack);
        this.range = towerLogicAttack.getRange() - this.radius;
        this.startPos = towerLogicAttack.getPosition();
        this.target = this.calEndPosition(towerLogicAttack.getTarget().getPosition());
        this.turnOver = false;
        this.hitMonsted = new Set();
    },

    calEndPosition: function (targetPos) {
        let vector = Utils.getInstance().getVector(this.startPos, targetPos);
        let lengthVector = Utils.getInstance().getVectorLength(vector) + 0.001;
        let dx = Utils.round(vector.x * this.range / lengthVector);
        let dy = Utils.round(vector.y * this.range / lengthVector);
        return cc.p(
            this.startPos.x + dx,
            this.startPos.y + dy
        );
    },

    reachTarget: function () {
        if (this.finished === true && this.turnOver === false) {
            this.target = this.startPos;
            this.turnOver = true;
            this.hitMonsted.clear();
            this.finished = false;
            if (this.skillEnable)
                this.damage *= 1.5;
        }
    },

    update: function (dt) {
        this._super(dt);
        this.getHitObjects().forEach((shootableObject) => {
            if (!this.hitMonsted.has(shootableObject.getId())) {
                shootableObject.decreaseHP(this.damage);
                this.hitMonsted.add(shootableObject.getId());
            }
        }, this);
    },

});