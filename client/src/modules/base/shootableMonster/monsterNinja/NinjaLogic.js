let NinjaLogic = LogicMonster.extend({

    ctor: function (level, gameMgr, id, HPRatio, isMonsterDrop){

        this._super(MONSTER_TYPE.NINJA, level, gameMgr, id, HPRatio, isMonsterDrop);
        this.ability = new NinjaAbility(this);
        this.curMaxHp = this.currentHP;
    },

    runAbility: function (){

        if(this.curMaxHp < this.currentHP){
            this.curMaxHp = this.currentHP;
        }

        if(this.ability.canActive(this.curMaxHp, this.currentHP)){
            this.ability.active();
            this.curMaxHp = this.currentHP;
        }
    },

    canTarget: function (){

        return !this.ability.isActive();
    },

    isBurrowing: function (){

        return this.ability.isActive()
    }
})