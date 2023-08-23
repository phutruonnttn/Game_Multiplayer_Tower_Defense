let TakenDamageBuff = MonsterBuff.extend({

    ctor: function (timeEffect, value, clock){
        this._super(timeEffect, clock);
        this.value = value;
    }
})