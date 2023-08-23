/**
 * Created by Team 2 - LongLH - GDF 17 on 3/11/2022.
 */


var BulletLogic = cc.Class.extend({

    ctor: function (towerLogicAttack) {
        this.gameMgr = towerLogicAttack.gameMgr;
        this.finished = false;
        this.damage = towerLogicAttack.getDamage();
        this.speed = towerLogicAttack.getBulletSpeed();
        this.baseRadius = towerLogicAttack.getBulletBaseRadius();
        this.radius = towerLogicAttack.getBulletRadius();
        this.skillEnable = towerLogicAttack.canUseSkill();

        // data for UI only
        this.ui = {
            evolution: towerLogicAttack.getEvolution(),
            towerID: towerLogicAttack.towerID
        };
    },

    getEffectDuration: function (targetBuffType, evolution, level) {
        try {
            return JsonConfig.getInstance().getBuffTarget(targetBuffType).getDuration(evolution, level);
        } catch (e) {
            return 0;
        }
    },

    setPosition: function (pos) {
        this.x = pos.x;
        this.y = pos.y;
    },

    getPosition: function () {
        return cc.p(this.x, this.y);
    },

    update: function (dt) {
        if (this.finished === true)
            return;

        let toPos = this.getToPos();

        // Đây là cách tính không chính xác về độ dài đi được, chỉ đúng về tỉ lệ. Sẽ đúng khi dt vô cùng bé
        // Ưu điểm: loại bỏ được phép căn
        let vector = Utils.getInstance().getVector(this.getPosition(), toPos);
        let moveLength = Utils.round(Utils.round(dt * this.speed) * BATTLE.SQUARE_SIZE);
        if (Utils.getInstance().getVectorLengthSqr(vector) <= Utils.round(moveLength * moveLength)) {
            this.finished = true;
            this.reachTarget();
        }
        else {
            let dx = Utils.round(Utils.round(moveLength * vector.x) / (Math.abs(vector.x) + Math.abs(vector.y)));
            let dy = Utils.round(Utils.round(moveLength * vector.y) / (Math.abs(vector.x) + Math.abs(vector.y)));
            this.x += dx;
            this.y += dy;
        }
    },

});