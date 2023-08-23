/**
 * Created by Team 2 - LongLH - GDF 17 on 29/11/2022.
 */


var TowerLogic = cc.Class.extend({

    ctor: function (card, gameMgr) {
        this.gameMgr = gameMgr;

        this.disable = false;

        this.hasSkill = card.hasSkill();
        this.cardID = card.id;
        this.towerID = card.getIdInJsonFile();
        this.level = card.level;
        this.rank = card.getRank();
        this.evolution = TOWER.EVOLUTION_MIN;
        this.isEvolving = false;
        this.stat = JsonConfig.getInstance().getStatTower(this.towerID);
        this.targetType = this.stat.getTargetType();

        // buff of tower
        this.scaleRange = 1;
        this.scaleDamage = 1;
        this.scaleAttackSpeed = 1;

        // status of tower
        this.frozenDuration = 0;

        // Loop counter for update
        // this.loopCounter = this.gameMgr.getRandomInRange(0, TOWER.MAX_DELAY_FRAME - 1);
        this.loopCounter = 0;

        this.drop();
    },

    // towerUI chỉ có ở bên client, dùng để cập nhật UI theo logic mà không cần schedule update
    setUI: function (towerUI) {
        this.towerUI = towerUI;
    },

    getBaseRange: function () {
        return Utils.round(this.stat.getRange(this.evolution) * this.scaleRange);
    },

    getRange: function () {
        return Utils.round(this.getBaseRange() * BATTLE.SQUARE_SIZE);
    },

    getEvolution: function () {
        return this.evolution;
    },

    getEnergyBack: function () {
        return Math.floor(this.stat.getEnergy() * this.getEvolution() / 2);
    },

    buffActivate: function (towerBuffID, evolution, level) {
        if (towerBuffID < 0)
            return;
        switch (JsonConfig.getInstance().getBuffTower(towerBuffID).getEffectName(evolution)) {
            case (TOWER.BUFF_DAMAGE_UP_TXT): {
                this.buffDamage(JsonConfig.getInstance().getBuffTower(towerBuffID).getEffectValue(evolution));
                break;
            }
            case (TOWER.BUFF_RANGE_UP_TXT): {
                this.buffRange(JsonConfig.getInstance().getBuffTower(towerBuffID).getEffectValue(evolution));
                break;
            }
            case (TOWER.BUFF_ATTACK_SPEED_UP_TXT): {
                this.buffAttackSpeed(JsonConfig.getInstance().getBuffTower(towerBuffID).getEffectValue(evolution));
                break;
            }
            case (TOWER.BUFF_FROZEN_TXT): {
                this.setFrozen(JsonConfig.getInstance().getBuffTower(towerBuffID).getDuration(evolution, level));
                break;
            }
        }
    },

    buffRange: function (buffAmount) {
        this.scaleRange += buffAmount;
    },

    buffDamage: function (buffAmount) {
        this.scaleDamage += buffAmount;
    },

    buffAttackSpeed: function (buffAmount) {
        this.scaleAttackSpeed -= buffAmount;
    },

    drop: function() {
        this.loopCountDown = BATTLE.FRAME_PER_SECOND;
    },

    setPosition: function (pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.cellPos = this.gameMgr.gameGUI.getCellPositionGameGUI(this.getPosition());
        this.buffActivate(this.gameMgr.mapLogic.getBuffOfCell(this.cellPos.x, this.cellPos.y),1,1);
    },

    getPosition: function () {
        return cc.p(this.x, this.y);
    },

    setIndex: function (index) {
        this.index = index;
    },

    getIndex: function () {
        return this.index;
    },

    canEvolution: function (card) {
        if (card === undefined) {
            return !this.isEvolving && this.loopCountDown <= 0 && this.evolution + 1 <= Math.min(TOWER.EVOLUTION_MAX, this.rank);
        }
        if (card.id !== this.cardID)
            return gv.ERROR.DROP_TOWER_UPGRADE_INVALID_CARD;
        if (this.loopCountDown > 0 || this.isEvolving)
            return gv.ERROR.DROP_TOWER_UPGRADE_BUSY;
        if (this.evolution + 1 > Math.min(TOWER.EVOLUTION_MAX, this.rank))
            return gv.ERROR.DROP_TOWER_UPGRADE_MAX;
        return gv.ERROR.SUCCESS;
    },

    goingEvolution: function () {
        if (!this.canEvolution())
            return;
        this.isEvolving = true;
        this.loopCountDown = 1;
    },

    evolutionUp: function () {
        if (!this.isEvolving || this.loopCountDown > 0)
            return;
        this.evolution += 1;
        this.isEvolving = false;
        // Hiển thị animation tiến hóa
        this.towerUI.runAnimationEvolution();
    },

    canUseSkill: function () {
        return this.hasSkill && this.evolution >= TOWER.EVOLUTION_MAX;
    },

    inRange: function (otherPos) {
        return Utils.getInstance().inCircle(this.getPosition(), this.getRange(), otherPos);
    },

    getDistanceSqr: function (otherPos) {
        let vector = Utils.getInstance().getVector(this.getPosition(), otherPos);
        return Utils.getInstance().getVectorLengthSqr(vector);
    },

    setFrozen: function (duration) {
        this.frozenDuration = Math.max(this.frozenDuration, duration);
        this.towerUI.setFrozen();
    },

    updateImmobile: function (dt) {
        if (this.loopCountDown > 0)
            this.loopCountDown -= 1;
        if (this.frozenDuration > 0) {
            this.frozenDuration -= dt;
            // Xóa hiệu ứng đóng băng nếu có thể
            if (this.frozenDuration <= 0)
                this.towerUI.setUnFrozen();
        }
    },

    isImmobile: function () {
        return this.loopCountDown > 0 || this.frozenDuration > 0;
    },

    update: function (dt) {
        if (this.isImmobile()) {
            this.updateImmobile(dt);
            return;
        }
        if (this.isEvolving)
            this.evolutionUp();
    },

    destroy: function () {
        this.disable = true;
    }

});