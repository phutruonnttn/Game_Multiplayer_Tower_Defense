/**
 * Created by Team 2 - LongLH - GDF 17 on 12/12/2022.
 */


var StatPotion = StatCard.extend({

    map: String.prototype,
    action: Map.prototype,
    duration: Number.prototype,
    radiusType: Number.prototype,
    statPerLevel: Map.prototype,
    adjust: Map.prototype,
    healDelay: Number.prototype,

    getRadius: function (rank) {
        return JsonConfig.getInstance().getPotionRadius(this.radiusType).getRadius(rank);
    },

    getPotionValue: function (statType, level) {
        return this.statPerLevel[statType][level];
    },

    getAdjustValue: function (key) {
        return this.adjust[key].value;
    },

    getDuration: function () {
        return this.duration / 1000;
    },

});

var PotionAdjust = cc.Class.extend({

    type: String.prototype,
    value: Number.prototype,

});