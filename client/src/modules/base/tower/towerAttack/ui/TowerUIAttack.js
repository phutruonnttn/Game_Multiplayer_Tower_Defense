/**
 * Created by Team 2 - LongLH - GDF 17 on 29/11/2022.
 */


var TowerUIAttack = TowerUI.extend({

    ctor: function (gameMgr) {
        this._super(gameMgr);
        this.frameDirection = 0;
    },

    getAttackAnimationID: function (frameDirection) {
        return resAniId.tower.attack+(frameDirection+1);
    },

    runAnimationShoot: function () {
        if (this.animation === undefined)
            return;
        // Hiệu ứng khi bắn đạn
        this.animation.setVisible(true);
        this.animation.setAnimation(0, this.getAttackAnimationID(this.frameDirection), 0);
        this.animation.setPosition(this.getBulletStartVector());
    },

    getNormDirectionToPos: function (toPos) {
        let v1 = cc.p(toPos.x - this.x, toPos.y - this.y);
        let v2 = cc.p(0, -1);
        let cos = (v1.x * v2.x + v1.y * v2.y) / (Math.sqrt(v1.x*v1.x+v1.y*v1.y)*Math.sqrt(v2.x*v2.x+v2.y*v2.y));
        let direction = Math.round(Math.acos(cos) / Math.PI * TOWER.N_ATTACK_DIRECTION / 2);
        if (v1.x < 0) {
            direction = TOWER.N_ATTACK_DIRECTION - direction;
            if (direction === TOWER.N_ATTACK_DIRECTION)
                direction = 0;
        }
        return direction;
    },

    getBulletStartVector: function () {
        let angle = Math.PI * 2 / TOWER.N_ATTACK_DIRECTION * this.getNormDirectionToPos(this.towerLogic.target.getPosition());
        let originVector = cc.p(0, -1);
        let vector = cc.p(
            Math.cos(angle) * originVector.x - Math.sin(angle) * originVector.y,
            Math.sin(angle) * originVector.x + Math.cos(angle) * originVector.y
        );
        vector.x *= BATTLE.SQUARE_SIZE / 2;
        vector.y *= BATTLE.SQUARE_SIZE / 2;
        return vector;
    },

    updateDirection: function (toPos) {
        let frameDirection = this.getNormDirectionToPos(toPos);
        let flipX = false;
        if (frameDirection > TOWER.N_ATTACK_DIRECTION / 2) {
            frameDirection = TOWER.N_ATTACK_DIRECTION - frameDirection;
            flipX = true;
        }
        // Lộn ngược lại nếu như đây là Opponent's MAP
        if (this.gameMgr.isPlayerMap === false) {
            frameDirection = TOWER.N_ATTACK_DIRECTION / 2 - frameDirection;
            flipX = !flipX;
        }
        this.frameDirection = frameDirection;
        this.setFlippedX(flipX);
    },

    shoot: function (bulletLogic) {
        // Tạo ra viên đạn
        // let bullet = new this.classBulletUI(bulletLogic);
        let bullet = gv.poolObjects.get(this.classBulletUI, bulletLogic);
        // Đẩy Z-Order lên cao nhất
        bullet.setLocalZOrder(this.gameMgr.gameGUI.getContentSize().height + BATTLE.SQUARE_SIZE);
        let startPos = this.getBulletStartVector();
        startPos.x += this.x;
        startPos.y += this.y;
        bullet.setPosition(startPos);
        this.gameMgr.gameGUI.addChild(bullet);

        // Gửi UI đạn vào gameMgr để được update
        this.gameMgr.listUIBullet.push(bullet);

        this.runAnimationShoot();
    },

    getFrameIndex: function () {
        let frameID = this.frameDirection * TOWER.FRAME[this.towerLogic.towerID].FRAME_PER_STATE[this.frameState] + this.curFrame;
        return Utils.getInstance().to4digitNum(frameID);
    },

    shootWhenPossible: function () {
        if (this.towerLogic.queueBulletLogic.isEmpty() === false) {
            let lastBullet = BulletLogic.prototype;
            do {
                let bulletLogic = this.towerLogic.queueBulletLogic.dequeue();
                this.shoot(bulletLogic);
                lastBullet = bulletLogic;
            } while (this.towerLogic.queueBulletLogic.isEmpty() === false);
            this.updateDirection(lastBullet.getToPos());
        }
    },

    update: function (dt) {
        if (this.frameState === TOWER.FRAME_IDLE && this.towerLogic.isShooting())
            this.onAttack();
        if (this.frameState === TOWER.FRAME_ATTACK && !this.towerLogic.isShooting())
            this.onIdle();
        this.shootWhenPossible();
        this._super(dt);
    },

});