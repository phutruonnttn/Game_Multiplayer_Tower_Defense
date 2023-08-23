/**
 * Created by Team 2 - LongLH - GDF 17 on 29/11/2022.
 */


var TowerLogicAttack = TowerLogic.extend({

    ctor: function (card, gameMgr) {
        this._super(card, gameMgr);
        this.target = null;
        this.queueBulletLogic = new Queue();
        this.readyToShoot = true;
        this.setTargetMode(TOWER.TARGET_MODE.NEAREST);
        this.onIdle();
    },

    getTarget: function () {
        return this.target;
    },

    setTarget: function (shootableObject) {
        this.target = shootableObject;
        if (this.target === null)
            this.onIdle();
        else {
            this.onAttack();
            this.towerUI.updateDirection(this.target.getPosition());
        }
    },

    getBulletTargetBuffType: function () {
        return this.stat.getBulletTargetBuffType();
    },

    getAttackSpeed: function () {
        if (this.scaleAttackSpeed <= 0)
            return 0;
        return Utils.round(this.stat.getAttackSpeed(this.evolution) * this.scaleAttackSpeed);
    },

    getAttackAnimationTime: function () {
        return this.stat.getAttackAnimationTime();
    },

    getShootAnimationTime: function () {
        return this.stat.getShootAnimationTime();
    },

    getTotalAttackDuration: function () {
        return this.getAttackSpeed() + this.getAttackAnimationTime();
    },

    getDamage: function () {
        return Utils.round(this.stat.getDamage(this.evolution, this.level) * this.scaleDamage);
    },

    getBulletSpeed: function () {
        return this.stat.getBulletSpeed(this.evolution);
    },

    getBulletBaseRadius: function () {
        return this.stat.getBulletRadius(this.evolution);
    },

    getBulletRadius: function () {
        return Utils.round(this.stat.getBulletRadius(this.evolution) * BATTLE.SQUARE_SIZE);
    },

    getEffectingTowerBuff: function () {
        let listTowerBuff = [];
        this.gameMgr.getListTowerInCellNeighbor(this.cellPos.x, this.cellPos.y, this.getBaseRange()).forEach((tower) => {
            if (tower instanceof TowerLogicBuff && tower.canBuff(this))
                listTowerBuff.push(tower);
        }, this);
        return listTowerBuff;
    },

    setPosition: function (pos) {
        this._super(pos);
        this.getEffectingTowerBuff().forEach((towerBuff) => {
            towerBuff.buffTower(this);
        }, this);
    },

    hasTarget: function () {
        return this.target !== null && this.canShoot(this.target);
    },

    canShootFly: function () {
        return this.targetType === TOWER.TARGET_TYPE_ALL;
    },

    canShoot: function (shootableObject) {
        if (shootableObject === null)
            return false;
        if (shootableObject instanceof LogicMonster)
            if (!this.canShootFly() && shootableObject.canFly())
                return false;
        return !shootableObject.isDied && shootableObject.canTarget() && this.inRange(shootableObject.getPosition());
    },

    setTargetMode: function (targetMode) {
        this.targetMode = targetMode;
    },

    findTarget: function () {
        ++this.loopCounter;
        if (this.loopCounter >= TOWER.MAX_DELAY_FRAME)
            this.loopCounter -= TOWER.MAX_DELAY_FRAME;
        else {
            this.setTarget(null);
            return;
        }
        if (this.canShoot(this.gameMgr.priorityObstacle)) {
            this.setTarget(this.gameMgr.priorityObstacle);
            return;
        }
        switch (this.targetMode) {
            case (TOWER.TARGET_MODE.FURTHEST):
                this._findTargetFurthest();
                break;
            case (TOWER.TARGET_MODE.NEAREST):
                this._findTargetNearest();
                break;
            case (TOWER.TARGET_MODE.FULL_HP):
                this._findTargetFullHp();
                break;
            case (TOWER.TARGET_MODE.LOW_HP):
                this._findTargetLowHp();
                break;
            default:
                this._findTargetFurthest();
        }
    },

    _findTargetFurthest: function () {
        let target = null;
        let furthestDis;
        this.gameMgr.getListMonsterInCellNeighbor(this.cellPos.x, this.cellPos.y, this.getBaseRange()).forEach((monsterLogic) => {
            if (this.canShoot(monsterLogic)) {
                if (target === null || furthestDis < this.getDistanceSqr(monsterLogic.getPosition())) {
                    target = monsterLogic;
                    furthestDis = this.getDistanceSqr(monsterLogic.getPosition());
                }
            }
        }, this);
        this.setTarget(target);
    },

    _findTargetNearest: function () {
        let target = null;
        let nearestDis;
        this.gameMgr.getListMonsterInCellNeighbor(this.cellPos.x, this.cellPos.y, this.getBaseRange()).forEach((monsterLogic) => {
            if (this.canShoot(monsterLogic)) {
                if (target === null || nearestDis > this.getDistanceSqr(monsterLogic.getPosition())) {
                    target = monsterLogic;
                    nearestDis = this.getDistanceSqr(monsterLogic.getPosition());
                }
            }
        }, this);
        this.setTarget(target);
    },

    _findTargetFullHp: function () {
        let target = null;
        let highestHp;
        this.gameMgr.getListMonsterInCellNeighbor(this.cellPos.x, this.cellPos.y, this.getBaseRange()).forEach((monsterLogic) => {
            if (this.canShoot(monsterLogic)) {
                if (target === null || highestHp < monsterLogic.currentHP) {
                    target = monsterLogic;
                    highestHp = monsterLogic.currentHP;
                }
            }
        }, this);
        this.setTarget(target);
    },

    _findTargetLowHp: function () {
        let target = null;
        let lowestHp;
        this.gameMgr.getListMonsterInCellNeighbor(this.cellPos.x, this.cellPos.y, this.getBaseRange()).forEach((monsterLogic) => {
            if (this.canShoot(monsterLogic)) {
                if (target === null || lowestHp > monsterLogic.currentHP) {
                    target = monsterLogic;
                    lowestHp = monsterLogic.currentHP;
                }
            }
        }, this);
        this.setTarget(target);
    },

    onIdle: function () {
        if (this.state === TOWER.STATE_IDLE)
            return;
        this.state = TOWER.STATE_IDLE;
    },

    onAttack: function () {
        if (this.state === TOWER.STATE_ATTACK)
            return;
        this.state = TOWER.STATE_ATTACK;
        if (this.readyToShoot)
            this.timeWaitNewShoot = 0;
    },

    isShooting: function () {
        if (this.state !== TOWER.STATE_ATTACK)
            return false;
        return this.timeWaitNewShoot <= this.getAttackAnimationTime();
    },

    shoot: function () {
        this.readyToShoot = false;
        let bulletLogic = this.createBullet();
        bulletLogic.setPosition(cc.p(this.x, this.y));
        // gửi logic vào gameMgr để được gọi update
        this.gameMgr.listLogicBullet.push(bulletLogic);

        // Lưu tạm logic đạn vào queue, phòng trường hợp tạo ra nhiều logic đạn mà chưa kịp load UI
        this.queueBulletLogic.enqueue(bulletLogic);
    },

    goingEvolution: function () {
        this._super();
        if (this.isShooting())
            this.onIdle();
    },

    setFrozen: function (duration) {
        this._super(duration);
        if (this.isShooting())
            this.onIdle();
    },

    update: function (dt) {
        this._super(dt);
        if (this.isImmobile())
            return;
        if (this.readyToShoot) {
            if (this.state === TOWER.STATE_IDLE) {
                this.findTarget();
                if (this.hasTarget())
                    this.onAttack();
            }
            if (this.state === TOWER.STATE_ATTACK) {
                if (this.timeWaitNewShoot <= this.getShootAnimationTime() && this.timeWaitNewShoot + dt > this.getShootAnimationTime()) {
                    this.shoot();
                }
                else {
                    this.timeWaitNewShoot += dt;
                }
            }
        }
        if (!this.readyToShoot) {
            this.timeWaitNewShoot += dt;
            if (this.timeWaitNewShoot >= this.getTotalAttackDuration()) {
                this.readyToShoot = true;
                this.timeWaitNewShoot -= this.getTotalAttackDuration();
                if (!this.hasTarget()) {
                    this.findTarget();
                    if (!this.hasTarget()) {
                        this.onIdle();
                    }
                }
            }
        }
    },

});