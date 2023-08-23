let NinjaUiConfig = {
    path: "res/monster/fx/fx_digging",
    skin: "map_desert_top",
    animateDown: "fx_dig_down",
    animateBurrowing: "fx_digging",
    animateUp: "fx_dig_up",

}

let NinjaUi = MonsterUI.extend({

    ctor: function (gameMgr, logicMonster, typeShadow, isPlayerMap){
        this._super(MONSTER_TYPE.NINJA, gameMgr, logicMonster, typeShadow, isPlayerMap);
        this.initBurrowEffect();
        this.digging = false;
        this.shadow.setOpacity(0)
    },

    initBurrowEffect: function (){
        this.burrowEf = fr.createAtlasAnimation(NinjaUiConfig.path);
        this.burrowEf.setPosition(this.width/2, this.height/2);
        this.burrowEf.setSkin(NinjaUiConfig.skin);
        this.burrowEf.setVisible(false);
        this.addChild(this.burrowEf);
    },

    burrowDown: function (){
        this.burrowEf.setVisible(true);
        // this.shadow.setVisible(false);
        this.burrowEf.setAnimation(0, NinjaUiConfig.animateDown, false);
        let self = this;
        this.digging = true;
        setTimeout(function (){
            self.setOpacity(0);
            self.burrowEf.setAnimation(0, NinjaUiConfig.animateBurrowing, true);
        }, 500)
    },
    burrowUp: function (){

        this.digging = false;
        this.burrowEf.setAnimation(0, NinjaUiConfig.animateUp, false);
        let self = this;
        setTimeout(function (){
            if(self){
                self.setOpacity(255);
                self.burrowEf.setVisible(false);
            }
        }, 500)
        this.digging = false;

    },
    runEffectBurrow: function (){

        if(this.logicMonster.isBurrowing()){
            if(this.digging == false){
                this.burrowDown();
            }
        }else{
            if(this.digging == true){
                this.burrowUp();
            }
        }
    },

    update: function (dt){
        this._super(dt);
        this.runEffectBurrow();
    }

})