var RandomCustom = cc.Class.extend({

    MODULE: Math.pow(2,16) + 1, //m
    multiplier: 75, //a
    increment: 74, //c

    ctor: function (seedRandom) {
        this.seed = seedRandom;
    },

    getRandom: function () {
        this.seed = (this.multiplier * this.seed + this.increment) % this.MODULE;
        return Utils.round(this.seed / this.MODULE);
    }
})

