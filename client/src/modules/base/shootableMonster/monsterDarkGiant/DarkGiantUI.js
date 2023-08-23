let DarkGiantUI = MonsterUI.extend({

    ctor: function (gameMgr, logicMonster, typeShadow, isPlayerMap){
        this._super(MONSTER_TYPE.DARK_GIANT, gameMgr, logicMonster, typeShadow, isPlayerMap);
    },

    isBoss: function () {
        return true
    }
})