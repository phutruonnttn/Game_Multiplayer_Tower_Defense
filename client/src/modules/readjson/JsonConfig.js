/**
 * Created by Team 2 - LongLH - GDF 17 on 12/12/2022.
 */


var JsonConfig = cc.Class.extend({

    ctor: function () {
        this.readStatMonster();
        this.readStatPotion();
        this.readStatTower();
        this.readTargetBuffConfig();
        this.readTowerBuffConfig();
    },

    readStatMonster: function () {
        let jsonNode = cc.loader.getRes("json_config/Monster.json");
        this.statMonster = {};
        for (let key in jsonNode.monster)
            this.statMonster[key] = Utils.getInstance().objectAssign(new StatMonster(), jsonNode.monster[key]);
    },

    readStatPotion: function () {
        let jsonNode = cc.loader.getRes("json_config/Potion.json");
        this.potionRadius = {};
        for (let key in jsonNode.radius)
            this.potionRadius[key] = Utils.getInstance().objectAssign(new PotionRadius(), jsonNode.radius[key]);
        this.statPotion = {};
        for (let key in jsonNode.potion)
            this.statPotion[key] = Utils.getInstance().objectAssign(new StatPotion(), jsonNode.potion[key]);
    },

    readStatTower: function () {
        let jsonNode = cc.loader.getRes("json_config/Tower.json");
        this.statTower = {};
        for (let key in jsonNode.tower)
            this.statTower[key] = Utils.getInstance().objectAssign(new StatTower(), jsonNode.tower[key]);
    },

    readTargetBuffConfig: function () {
        let jsonNode = cc.loader.getRes("json_config/TargetBuff.json");
        this.buffTarget = {};
        for (let key in jsonNode.targetBuff)
            this.buffTarget[key] = Utils.getInstance().objectAssign(new BuffTarget(), jsonNode.targetBuff[key]);
    },

    readTowerBuffConfig: function () {
        let jsonNode = cc.loader.getRes("json_config/TowerBuff.json");
        this.buffTower = {};
        for (let key in jsonNode.towerBuff)
            this.buffTower[key] = Utils.getInstance().objectAssign(new BuffTower(), jsonNode.towerBuff[key]);
    },

    getStatCard: function (cardID) {
        switch (CARD.GLOBAL_ID[cardID].TYPE) {
            case CARD.MONSTER_TYPE:
                return this.getStatMonster(CARD.GLOBAL_ID[cardID].ID);
            case CARD.POTION_TYPE:
                return this.getStatPotion(CARD.GLOBAL_ID[cardID].ID);
            case CARD.TOWER_TYPE:
                return this.getStatTower(CARD.GLOBAL_ID[cardID].ID);
        }
    },

    getStatMonster: function (monsterID) {
        return this.statMonster[monsterID];
    },

    getPotionRadius: function (potionRadiusID) {
        return this.potionRadius[potionRadiusID];
    },

    getStatPotion: function (potionID) {
        return this.statPotion[potionID];
    },

    getStatTower: function (towerID) {
        return this.statTower[towerID];
    },

    getBuffTarget: function (targetBuffID) {
        return this.buffTarget[targetBuffID];
    },

    getBuffTower: function (towerBuffID) {
        return this.buffTower[towerBuffID];
    },

});

var _jsonConfig;
JsonConfig.getInstance = function () {
    if (_jsonConfig === undefined)
        _jsonConfig = new JsonConfig();
    return _jsonConfig;
}