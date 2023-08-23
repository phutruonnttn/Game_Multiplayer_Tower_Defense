/**
 * Created by Team 2 - LongLH - GDF 17 on 12/12/2022.
 */


var PotionRadius = cc.Class.extend({

    value: Number.prototype,
    increasePerRank: Number.prototype,

    getRadius: function (rank) {
        return this.value + this.increasePerRank * (rank - 1);
    }

});