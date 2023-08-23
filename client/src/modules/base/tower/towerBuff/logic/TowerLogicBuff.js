/**
 * Created by Team 2 - LongLH - GDF 17 on 29/11/2022.
 */


var TowerLogicBuff = TowerLogic.extend({

    ctor: function (card, gameMgr) {
        this._super(card, gameMgr);
        this.buff = JsonConfig.getInstance().getBuffTower(this.stat.getAuraTowerBuffType());
    },

    getBuffAmount: function () {
        return this.buff.getEffectValue(this.evolution);
    },

    canBuff: function (tower) {
        return tower instanceof TowerLogicAttack && this.level >= tower.level && this.inRange(tower.getPosition());
    },

    getEffectedTowerAttack: function () {
        let listTowerAttack = [];
        this.gameMgr.getListTowerInCellNeighbor(this.cellPos.x, this.cellPos.y, this.getBaseRange()).forEach((tower) => {
            if (this.canBuff(tower))
                listTowerAttack.push(tower);
        }, this);
        return listTowerAttack;
    },

    buffAll: function () {
        this.isBuffing = true;
        this.getEffectedTowerAttack().forEach(this.buffTower, this);
        this.towerUI.runAnimationsAura();
    },

    unBuffAll: function () {
        this.isBuffing = false;
        this.getEffectedTowerAttack().forEach(this.unBuffTower, this);
        this.towerUI.stopAnimationAura();
    },

    drop: function () {
        this._super();
        this.isBuffing = false;
    },

    goingEvolution: function () {
        this._super();
        if (!this.canEvolution())
            return;
        this.unBuffAll();
    },

    update: function (dt) {
        this._super(dt);
        if (!this.isBuffing && this.loopCountDown <= 0)
            this.buffAll();
    },

    destroy: function () {
        this.unBuffAll();
        this._super();
    },

});