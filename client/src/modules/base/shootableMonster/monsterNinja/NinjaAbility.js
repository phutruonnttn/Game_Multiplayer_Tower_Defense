let NinjaAbility = Ability.extend({
    ctor: function (owner){
        this._super(owner);
        this.status = false;
    },
    canActive: function (maxHp, curHp){
        if(curHp <= maxHp - this.owner.baseHp * NinjaAbilityConfig.RATIO_LOST_HP && !this.owner.isFrozen() && !this.owner.isStunned() && !(this.owner.speedThrown > 0)){
            return true;
        }
        return false;
    },
    active: function (){
        this.positionActive = cc.p(this.owner.position.x, this.owner.position.y);
        this.status = true;
    },
    isActive: function (){
        if(this.status){
            let dx = Math.abs(this.positionActive.x - this.owner.position.x);
            let dy = Math.abs(this.positionActive.y - this.owner.position.y);
            if(dx + dy < BATTLE.SQUARE_SIZE * NinjaAbilityConfig.DISTANCE){
                return true;
            }
        }
        this.status = false;
        return false;
    }

})