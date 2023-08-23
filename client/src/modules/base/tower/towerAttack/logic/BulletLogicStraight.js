/**
 * Created by Team 2 - LongLH - GDF 17 on 6/11/2022.
 */


var BulletLogicStraight = BulletLogic.extend({

    ctor: function (towerLogicAttack) {
        this._super(towerLogicAttack);
        this.target = towerLogicAttack.getTarget().getPosition();
        this.canEffectFly = towerLogicAttack.canShootFly();
    },

    getToPos: function () {
        return this.target;
    },

    // Trả về list monster trúng đạn
    getHitMonsters: function () {
        let listMonstersAffected = [];
        let cellPos = this.gameMgr.gameGUI.getCellPositionGameGUI(this.getPosition());
        this.gameMgr.getListMonsterInCellNeighbor(cellPos.x, cellPos.y, this.baseRadius).forEach((monster) => {
            if (!this.canEffectFly && monster.canFly())
                return;
            if (Utils.getInstance().inCircle(this.getPosition(), this.radius + monster.hitRadius, monster.getPosition()))
                listMonstersAffected.push(monster);
        }, this);
        return listMonstersAffected;
    },

    // Trả về list obstacle trúng đạn
    getHitObstacles: function () {
        let listObstacleAffected = [];
        this.gameMgr.listLogicTreeObstacle.forEach((treeObstacle) => {
            if (Utils.getInstance().inCircle(this.getPosition(), this.radius + BATTLE.SQUARE_SIZE / 2, treeObstacle.getPosition()))
                listObstacleAffected.push(treeObstacle);
        });
        return listObstacleAffected;
    },

    // Trả về mọi object trúng đạn
    getHitObjects: function () {
        let listObjectAffected = [];
        listObjectAffected = listObjectAffected.concat(this.getHitMonsters(), this.getHitObstacles());
        return listObjectAffected;
    },

    reachTarget: function () {
        if (this.damage <= 0)
            return;
        this.getHitObjects().forEach((shootableObject) => {
            shootableObject.decreaseHP(this.damage);
        }, this);
    },

});