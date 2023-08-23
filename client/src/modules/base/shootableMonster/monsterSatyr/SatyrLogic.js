var SatyrLogic = LogicMonster.extend({

    ctor: function(gameMgr, id, HPRatio, isMonsterDrop){
        this._super(MONSTER_TYPE.SATYR, SATYR_LEVEL, gameMgr, id, HPRatio, isMonsterDrop);
        this.ability = new SatyrAbility(this);
    },

    runAbility: function (){
        if(this.ability.canActive()){
            this.ability.active();
        }
    },

    isBoss: function () {
        return true
    }
})