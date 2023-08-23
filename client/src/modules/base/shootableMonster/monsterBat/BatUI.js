let BatUI = MonsterUI.extend({
    ctor: function (gameMgr, logicMonster, typeShadow, isPlayerMap){
        this._super(MONSTER_TYPE.BAT, gameMgr, logicMonster, typeShadow, isPlayerMap);
    },
    setZOrderUI: function () {
        this.setLocalZOrder(this.gameMgr.gameGUI.getContentSize().height + BATTLE.SQUARE_SIZE);
    },
});