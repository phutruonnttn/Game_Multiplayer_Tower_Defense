var FindMatchUI = cc.Layer.extend({

    _textFindOpponent: "Đang tìm đối thủ...",
    _textNameMap: "RỪNG THIÊNG",
    _textCancel: "HỦY BỎ",

    ctor:function(){
        this._super()
        this.init()
        setTimeout(() => {
            getBattleController().sendFindMatch()
        }, 1200);
    },

    init:function () {
        // Add background
        let visibleSize = cc.Director.getInstance().getVisibleSize()
        var backGround = new cc.Sprite(res.battle.lobby_background_png)
        backGround.setScale(visibleSize.width/backGround.getContentSize().width,
            visibleSize.height/backGround.getContentSize().height)
        backGround.setPosition(visibleSize.width/2,visibleSize.height/2)
        this.addChild(backGround, 0)

        // Add text find
        var glassSize = visibleSize.height/12
        var labelFind = new ccui.Text(this._textFindOpponent, res.font.SVN_Supercell_Magic, 30)
        labelFind.setPosition(visibleSize.width/2 - glassSize/2,visibleSize.height*8/9)
        labelFind.setColor(cc.color(BATTLE.BLUE_COLOR))
        this.addChild(labelFind, 1)

        // Add glass and effect
        var transparent = new cc.Sprite(res.battle.absolute_transparent_png)
        transparent.setPosition(visibleSize.width/2 - glassSize/2 + (labelFind.getContentSize().width+glassSize)/2,visibleSize.height*8/9)
        var rotate = cc.rotateBy(2,360).repeatForever()
        transparent.runAction(rotate)
        this.addChild(transparent, 1)

        var glass = new cc.Sprite(res.battle.common_icon_glass_png)
        glass.setPosition(transparent.getContentSize().width/2+10,transparent.getContentSize().height/2)
        glass.setScale(glassSize/glass.getContentSize().height)
        var rotate = cc.rotateBy(2,-360).repeatForever()
        glass.runAction(rotate)
        transparent.addChild(glass, 1)

        // Add icon of map
        var arenaForest = new sp.SkeletonAnimation(res.battle.map_icon_forest_json, res.battle.map_icon_forest_atlas)
        arenaForest.setPosition(visibleSize.width/2,visibleSize.height*4.5/9)
        arenaForest.setAnimation(0, BATTLE.ANIMATION_NAME_OF_ARENA_FOREST, true)
        this.addChild(arenaForest, 1)

        var glow = new cc.Sprite(res.battle.lobby_home_arena_glow_png)
        glow.setScale((visibleSize.height)/arenaForest.getContentSize().height)
        glow.setPosition(visibleSize.width/2,visibleSize.height*5/9)
        this.addChild(glow, 0)

        // Add label name map
        var labelNameMap = new ccui.Text(this._textNameMap, res.font.SVN_Supercell_Magic, 30)
        labelNameMap.setPosition(visibleSize.width/2 ,visibleSize.height*5/9 -(visibleSize.height/3)*2/5)
        this.addChild(labelNameMap, 1)

        // Add button cancel and add listener
        this.buttonCancelFindMach = new ccui.Button(res.battle.common_btn_red_png)
        this.buttonCancelFindMach.setScale((visibleSize.height/11)/this.buttonCancelFindMach.getContentSize().height)
        this.buttonCancelFindMach.setPosition(visibleSize.width/2,visibleSize.height*1/8)
        this.addChild(this.buttonCancelFindMach, 1)
        this.buttonCancelFindMach.addClickEventListener(() => {
            this.backToHome()
        });
        var labelCancel = new ccui.Text(this._textCancel, res.font.SVN_Supercell_Magic, 25)
        labelCancel.setPosition(this.buttonCancelFindMach.getContentSize().width/2 ,this.buttonCancelFindMach.getContentSize().height/2)
        this.buttonCancelFindMach.addChild(labelCancel, 1)

        this.addEffectParticle()
        return true
    },

    addEffectParticle: function () {
        let visibleSize = cc.Director.getInstance().getVisibleSize()
        var emitter = new cc.ParticleSystem(res.battle.arena_particle_plist)
        emitter.setScale(1.5)
        emitter.setPosition(visibleSize.width/2,visibleSize.height*5/9)
        this.addChild(emitter, 2)
    },

    backToHome: function () {
        this.buttonCancelFindMach.setTouchEnabled(false);
        setTimeout(() => {
            getBattleController().sendCancelMatch();
        }, 200);
    },

    joinBattle: function () {
        this.buttonCancelFindMach.setTouchEnabled(false);
        this.buttonCancelFindMach.loadTextureNormal(res.battle.common_btn_gray_png)
        fr.view(BattleScene);
    }
})