let NotAccumulateBuff = cc.Class.extend({

    ctor: function (){

        this.mapBuff = {};
        this.activeBuff = null;
    },
    getBuffActive: function (clock){

        if(this.activeBuff && !this.activeBuff.checkStatus(clock)){
            this.activeBuff = this.getMaxBuff(clock)
        }

        return this.activeBuff;
    },
    getBuff: function (val){

        return this.mapBuff[val];
    },
    getMaxBuff: function (clock){

        let maxBuff = null;
        let value = 0;
        let keys = Object.keys(this.mapBuff);
        let self = this;
        keys.forEach(function (key){
            if(!self.mapBuff[key].checkStatus(clock)){
                delete self.mapBuff[key]
            }else {
                if(self.mapBuff[key].getValue() > value){
                    value = self.mapBuff[key].getValue();
                    maxBuff = self.mapBuff[key];
                }
            }
        })

        return maxBuff;
    },
    addBuff: function (buff){
        this.mapBuff[buff.getValue()] = buff;
        if(this.activeBuff == null || this.activeBuff.getValue() < buff.getValue()){
            this.activeBuff = buff;
        }
    },
})
