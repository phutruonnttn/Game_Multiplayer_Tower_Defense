let SatyrUI = MonsterUI.extend({

    ctor: function (gameMgr, logicMonster, typeShadow, isPlayerMap){
        this._super(MONSTER_TYPE.SATYR, gameMgr, logicMonster, typeShadow, isPlayerMap);
        this.initJungleGod();
    },
    initJungleGod :function (){
        let  jungleGod = fr.createAtlasAnimation("res/monster/fx/fx_boss_jungle_god");
        jungleGod.setAnimation(0, "fx_back", true);
        jungleGod.setPosition(this.width/2, this.height/2);
        jungleGod.setLocalZOrder(-1);
        this.addChild(jungleGod);
    },

    isBoss: function () {
        return true
    }

})