/**
 * Created by Team 2 - LongLH - GDF 17 on 6/11/2022.
 */


var BulletLogicCrow = BulletLogicStraight.extend({

    ctor: function (towerLogicAttack) {
        this._super(towerLogicAttack);
    },

    reachTarget: function () {
        this._super();
        if (this.skillEnable) {
            let listMonster = this.getHitMonsters();
            if (listMonster.length >= 5) {
                listMonster.forEach((monster) => {
                    monster.decreaseHP(10);
                });
            }
        }
    }

});