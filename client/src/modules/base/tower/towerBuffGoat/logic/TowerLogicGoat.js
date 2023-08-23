/**
 * Created by Team 2 - LongLH - GDF 17 on 29/11/2022.
 */


var TowerLogicGoat = TowerLogicBuff.extend({

    ctor: function (card, gameMgr) {
        this._super(card, gameMgr);
    },

    buffTower: function (tower) {
        tower.buffDamage(this.getBuffAmount());
    },

    unBuffTower: function (tower) {
        tower.buffDamage(-this.getBuffAmount());
    },

    update: function (dt) {
        var start = Date.now()
        this._super(dt);
        var end = Date.now()
        if (end - start > 3) {
            cc.log("================================Update de: " + (end - start))
        }

        if (this.canUseSkill()) {
            ++this.loopCounter;
            while (this.loopCounter >= TOWER.MAX_DELAY_FRAME) {
                this.loopCounter -= TOWER.MAX_DELAY_FRAME;
                this.gameMgr.getListMonsterInCellNeighbor(this.cellPos.x, this.cellPos.y, this.getBaseRange()).forEach((monster) => {
                    if (Utils.getInstance().inCircle(this.getPosition(), this.getRange() + monster.hitRadius, monster.getPosition())) {
                        monster.speedDown(0.8, 0, TOWER.MAX_DELAY_FRAME);
                    }
                }, this);
            }
        }


    }

});