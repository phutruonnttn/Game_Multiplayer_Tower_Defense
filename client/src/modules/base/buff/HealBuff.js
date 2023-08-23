var HealBuff = SporadicBuff.extend({

    ctor: function (timeEffect, delayTime, hp, clock){
        this._super(timeEffect, delayTime, hp, clock);
    },
    getHp: function (){
        return this.getValueAtCurTime();
    }
})
