/**
 * Created by Team 2 - LongLH - GDF 17 on 29/11/2022.
 */


var TowerLogicSnake = TowerLogicBuff.extend({

    ctor: function (card, gameMgr) {
        this._super(card, gameMgr);
    },

    buffTower: function (tower) {
        tower.buffAttackSpeed(this.getBuffAmount());
    },

    unBuffTower: function (tower) {
        tower.buffAttackSpeed(-this.getBuffAmount());
    },

    update: function (dt) {
        var start = Date.now()
        this._super(dt);
        var end = Date.now()
        if (end - start > 3) {
            cc.log("================================Update ran: " + (end - start))
        }
        if (this.canUseSkill()) {
            ++this.loopCounter;
            while (this.loopCounter >= BATTLE.FRAME_PER_SECOND) {
                this.loopCounter -= BATTLE.FRAME_PER_SECOND;
                this.gameMgr.getListMonsterInCellNeighbor(this.cellPos.x, this.cellPos.y, this.getBaseRange()).forEach((monster) => {
                    if (Utils.getInstance().inCircle(this.getPosition(), this.getRange() + monster.hitRadius, monster.getPosition())) {
                        let burnDamage = Utils.round(Math.min(monster.baseHp * 0.01, 5));
                        monster.buffHpDown(1, 1, burnDamage);
                    }
                }, this);
            }
        }
    }

});