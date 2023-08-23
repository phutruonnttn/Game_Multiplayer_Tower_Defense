let SporadicBuff = MonsterBuff.extend({

    ctor: function (timeEffect, delayTime, value, clock){
        this._super(timeEffect, clock);
        this.value = value;
        this.timer = 0;
        this.delayTime = delayTime
    },

    getValueAtCurTime: function (){
        if(this.timer == 0){
            this.timer = this.delayTime;
            return this.value;
        }
        this.timer--;
        return 0;
    }
})