let DarkGiantLogic = LogicMonster.extend({

    ctor: function (gameMgr, id, HPRatio, isMonsterDrop){
        this._super(MONSTER_TYPE.DARK_GIANT, DARK_GIANT_LEVEL, gameMgr, id, HPRatio, isMonsterDrop);
        this.ability = new DarkGiantAbility(this);
    },

    runAbility: function (){
        if(this.ability.canActive()){
            this.ability.active(this.gameMgr.listLogicTower);
        }
    },

    isBoss: function () {
        return true
    }
})
