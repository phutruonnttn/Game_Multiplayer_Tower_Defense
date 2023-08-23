/**
 * Created by Team 2 - LongLH - GDF 17 on 12/12/2022.
 */


var StatTower = StatCard.extend({

    archetype: String.prototype,
    targetType: String.prototype,
    auraTowerBuffType: Number.prototype,
    bulletType: String.prototype,
    bulletTargetBuffType: Number.prototype,
    attackAnimationTime: Number.prototype,
    shootAnimationTime: Number.prototype,
    stat: Map.prototype,

    getTargetType: function () {
        if (this.targetType in TOWER.TARGET_TYPE)
            return TOWER.TARGET_TYPE[this.targetType];
        return TOWER.TARGET_TYPE_NONE;
    },

    getAuraTowerBuffType: function () {
        return this.auraTowerBuffType;
    },

    getBulletTargetBuffType: function () {
        return this.bulletTargetBuffType;
    },

    getAttackAnimationTime: function () {
        return this.attackAnimationTime / 1000.0;
    },

    getShootAnimationTime: function () {
        return this.shootAnimationTime / 1000.0;
    },

    getDamage: function (evolution, level) {
        return this.stat[evolution].damage * (1 + 0.1 * level);
    },

    getRange: function (evolution) {
        return this.stat[evolution].range;
    },

    getBulletRadius: function (evolution) {
        return this.stat[evolution].bulletRadius;
    },

    getAttackSpeed: function (evolution) {
        return this.stat[evolution].attackSpeed / 1000.0;
    },

    getBulletSpeed: function (evolution) {
        return this.stat[evolution].bulletSpeed / 10;
    },

});

var StatEvolution = cc.Class.extend({
    damage: Number.prototype,
    range: Number.prototype,
    bulletRadius: Number.prototype,
    attackSpeed: Number.prototype,
    bulletSpeed: Number.prototype,
});