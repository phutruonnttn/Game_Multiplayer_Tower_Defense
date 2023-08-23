let ShootableObject = cc.Class.extend({

    ctor: function (id){
        this.id = id;
        this.isDied = false;
        this.baseHp = 0;
        this.currentHP = 0;
        this.hitRadius = 0;
        this.position = cc.p(0, 0);
    },
    getId: function () {
        return this.id;
    },
    decreaseHP: function (amount) {
        this.setCurrentHP(Math.max(0, this.currentHP - amount))
        if (this.currentHP == 0) {
            this.isDied = true
        }
    },
    increaseHP: function (amount) {
        if(amount > 0 && this.currentHP < this.baseHp){
            this.buffHpUpAni = true;
        }
        this.setCurrentHP(Math.min(this.baseHp, this.currentHP + amount))
    },
    setCurrentHP: function (hp) {
        this.currentHP = Utils.round(hp)
    },

    getPosition: function () {
        return cc.p(this.position);
    },

    canTarget: function () {
        return true;
    }

})