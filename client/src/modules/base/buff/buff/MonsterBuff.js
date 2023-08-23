let MonsterBuff = cc.Class.extend({

    ctor :function(timeEffect, clock) {
        this.expired = clock + timeEffect;
        this.value = 0;

    },
    setTimeEffect: function (timeEffect = 0, clock) {
        if(timeEffect + clock > this.expired){
            this.expired = timeEffect + clock;
        }
    },
    getValue: function (){
        return this.value;
    },
    checkStatus: function (clock) {
        if(this.expired >= clock){
            return true;
        }
        return false;
    },
})
