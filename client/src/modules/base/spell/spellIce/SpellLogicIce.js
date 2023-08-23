var SpellLogicIce = SpellLogic.extend({

    ctor: function (card, gameMgr, position, isPlayerAction) {
        this._super(card, gameMgr, position, isPlayerAction)
        this.timeExistence = BATTLE.DELAY_FRAME_FALL_ANIMATION
        this.damage = Number(this.stat.getPotionValue("damagePercent", card.level))
        this.durationOnTarget = Number(JsonConfig.getInstance().getBuffTarget(this.stat.getAdjustValue("player")).getDuration(1, card.level));
        this.durationOnTower = Number(JsonConfig.getInstance().getBuffTower(this.stat.getAdjustValue("enemy")).getDuration(1, card.level));
    },

    update: function (dt) {
        this.timeExistence--
        if (this.timeExistence == 0) {
            this.action()
        }
    },

    action: function () {
        // Gay sat thuong va dong bang quai
        if (this.isPlayerAction == this.gameMgr.isPlayerMap) {
            for (var i = 0; i < this.gameMgr.listLogicMonster.length; i++) {
                var monster = this.gameMgr.listLogicMonster[i]
                if (this.isInRange(monster.getPosition()) && monster.canTarget()) {
                    monster.decreaseHP(this.damage);
                    monster.freezeMonster(Math.floor(Utils.round(this.durationOnTarget * BATTLE.FRAME_PER_SECOND)));
                }
            }
        }
        // Dong bang tru
        else {
            for (var i = 0; i < this.gameMgr.listLogicTower.length; i++) {
                var tower = this.gameMgr.listLogicTower[i]
                if (this.isInRange(tower)) {
                    tower.setFrozen(this.durationOnTower)
                }
            }
        }
    }
})