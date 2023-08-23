/**
 * Created by Team 2 - LongLH - GDF 17 on 12/12/2022.
 */


var BuffTarget = Buff.extend({

    moveDistance: Map.prototype,

    getDelay: function (evolution) {
        return this.effects[evolution][0].delay;
    },

    getHpPerDelay: function (evolution, level) {
        let hpPerDelay = this.effects[evolution][0].hpPerDelay;
        if (this.effectsUseCardLevel) {
            hpPerDelay *= 1 + 0.1 * (level - 1);
        }
        return hpPerDelay;
    },

});