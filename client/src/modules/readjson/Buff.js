/**
 * Created by Team 2 - LongLH - GDF 17 on 12/12/2022.
 */


var Buff = cc.Class.extend({

    name: String.prototype,
    durationType: String.prototype,
    duration: Map.prototype,
    durationUseCardLevel: false,
    effectsUseCardLevel: false,
    state: String.prototype,

    effects: Map.prototype,

    getDuration: function (evolution, level) {
        let duration = this.duration[evolution] / 1000;
        if (this.durationUseCardLevel)
            duration *= 1 + 0.1 * (level - 1);
        return duration;
    },

    getEffectValue: function (evolution) {
        return this.effects[evolution][0].value;
    },

    getEffectName: function (evolution) {
        return this.effects[evolution][0].name;
    }

});

var EffectBuff = cc.Class.extend({

    name: String.prototype,
    type: String.prototype || Number.prototype,
    value: Number.prototype,
    delay: Number.prototype,
    hpPerDelay: Number.prototype,

});