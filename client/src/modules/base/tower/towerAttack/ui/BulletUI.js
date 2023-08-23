/**
 * Created by Team 2 - LongLH - GDF 17 on 3/11/2022.
 */


var BulletUI = cc.Sprite.extend({

    ctor: function (bulletLogic) {
        this._super();

        this.bulletLogic = bulletLogic;
        this.finished = false;
        this.stackDt = 0;
        this.curFrame = 0;
        this.towerID = this.bulletLogic.ui.towerID;
        this.evolution = this.bulletLogic.ui.evolution;
        this.nextFrame(0);
    },

    reachTarget: function () {
        this.destroy();
    },

    destroy: function () {
        // if (!this.finished)
        //     gv.poolObjects.push(this);
        this.finished = true;
    },

    getFrameKey: function () {
        key = TOWER.FRAME[this.towerID].NAME + "_bullet_";
        if (TOWER.FRAME[this.towerID].FRAME_BULLET_PER_EVOLUTION === true)
            key += this.evolution + "_";
        key += Utils.getInstance().to4digitNum(this.curFrame) + ".png";
        return key;
    },

    nextFrame: function (frameDelta) {
        this.curFrame = (this.curFrame + frameDelta) % TOWER.FRAME[this.towerID].BULLET;
        this.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(this.getFrameKey()));
    },

    update: function (dt) {
        if (this.finished === true)
            return;

        if (this.bulletLogic.finished === true) {
            this.destroy();
            return;
        }

        // Cập nhật frame của đạn
        if (TOWER.FRAME[this.towerID].BULLET > 1) {
            this.stackDt += dt;
            while (this.stackDt >= TOWER.SECOND_PER_FRAME) {
                this.stackDt -= TOWER.SECOND_PER_FRAME;
                this.nextFrame(1);
            }
        }

        // Cập nhật vị trí của đạn trên hiển thị
        let toPos = this.bulletLogic.getToPos();

        // Đây là cách tính không chính xác về độ dài đi được, chỉ đúng về tỉ lệ. Sẽ đúng khi dt vô cùng bé
        // Ưu điểm: loại bỏ được phép căn
        let vector = Utils.getInstance().getVector(this.getPosition(), toPos);
        let moveLength = Utils.round(Utils.round(dt * this.bulletLogic.speed) * BATTLE.SQUARE_SIZE);
        if (Utils.getInstance().getVectorLengthSqr(vector) <= Utils.round(moveLength * moveLength)) {
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