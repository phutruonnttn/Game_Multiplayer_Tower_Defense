
var SpellLogicFire = SpellLogic.extend({

    ctor: function (card, gameMgr, position, isPlayerAction) {
        this._super(card, gameMgr, position, isPlayerAction)
        this.timeExistence = BATTLE.DELAY_FRAME_FALL_ANIMATION
        this.damage = Number(this.stat.getPotionValue("damage", card.level))
    },

    update: function (dt) {
        this.timeExistence--
        if (this.timeExistence == 0) {
            this.action()
        }
    },

    // Trừ máu của monster trong vùng bị ảnh hưởng
    action: function () {
        for (var i = 0; i < this.gameMgr.listLogicMonster.length; i++) {
            var monster = this.gameMgr.listLogicMonster[i]
            if (this.isInRange(monster.getPosition()) && monster.canTarget()) {
                monster.decreaseHP(this.damage);
                if(!monster.canFly()) monster.thrownOut(
                    cc.p(
                        Utils.round(this.x),
                        Utils.round(this.y)
                    )
                );
            }
        }
    }
})