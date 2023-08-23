let ObstacleUI = cc.Node.extend({

    ctor: function (typeOfObstacle, position, logicObstacle, gameMgr) {

        this._super();

        this.gameMgr = gameMgr;
        this.gameGUI = gameMgr.gameGUI;
        this.logicObstacle = logicObstacle;
        this.logicObstacle.initPosition(position.x, position.y);
        this.setPosition(position);
        this.previousHP = this.logicObstacle.currentHP;
        this.maxHp = this.logicObstacle.currentHP;
        this.initHPBar();

        this.obstacle = new cc.Sprite(cc.spriteFrameCache.getSpriteFrame("map_forest_obstacle_" + typeOfObstacle + BATTLE.SUFFIX_PNG));
        this.obstacle.setScaleX(BATTLE.SQUARE_SIZE / (this.obstacle.getContentSize().width*5/4))
        this.obstacle.setScaleY(BATTLE.SQUARE_SIZE / (this.obstacle.getContentSize().height))
        if (typeOfObstacle == BATTLE.HOLE_TYPE) {
            this.obstacle.setAnchorPoint(0.5,0.5)
        } else {
            this.obstacle.setAnchorPoint(0.5,0.2)
        }
        this.addChild(this.obstacle);

        this.addEventListener();
        if (typeOfObstacle === BATTLE.TREE_TYPE)
            this.initAnimationTargeted();
    },
    initHPBar: function () {
        // Add background HP image
        this.backgroundHPUI = new cc.Sprite(res.battle.battle_target_hp_background_png)
        this.backgroundHPUI.setScaleX(BATTLE.SQUARE_SIZE/2.5/this.backgroundHPUI.getContentSize().width)
        this.backgroundHPUI.setScaleY(1.3)
        this.backgroundHPUI.setPosition(this.getContentSize().width/2,
            this.getContentSize().height)
        this.backgroundHPUI.setCascadeColorEnabled(true)
        this.backgroundHPUI.setCascadeOpacityEnabled(true)
        this.addChild(this.backgroundHPUI,1)

        // Add HP image
        this.hpUI = new cc.Sprite(res.battle.battle_target_hp_png)
        this.hpUI.setScaleX(this.backgroundHPUI.getContentSize().width/this.hpUI.getContentSize().width)
        this.hpUI.setAnchorPoint(0,0)
        this.hpUI.setPosition(0,0)
        this.backgroundHPUI.addChild(this.hpUI,1)
        this.backgroundHPUI.setVisible(false)
    },

    initAnimationTargeted: function () {
        this.animationTargeted = fr.createAtlasAnimation(resAni.enemy_circle);
        this.animationTargeted.setPosition(0, this.obstacle.getBoundingBox().height/2);
        this.animationTargeted.setVisible(false);
        if (this.gameMgr.isPlayerMap)
            this.animationTargeted.setAnimation(0, resAniId.enemy_circle.user_circle, true);
        else
            this.animationTargeted.setAnimation(0, resAniId.enemy_circle.enemy_circle, true);
        this.addChild(this.animationTargeted);
    },

    addEventListener: function () {
        if (this.gameMgr.isPlayerMap === false)
            return;
        let btnOption = gv.commonButton(BATTLE.SQUARE_SIZE, BATTLE.SQUARE_SIZE, 0, 0);
        this.addChild(btnOption);
        btnOption.setOpacity(0);
        btnOption.setSwallowTouches(false);
        btnOption.addTouchEventListener( function (button, eventType) {
            if (eventType !== ccui.Widget.TOUCH_BEGAN || gv.battleScene.cardSelectedIndex !== 0)
                return;
            let cellPos = this.gameMgr.gameGUI.getCellPositionGameGUI(this.getPosition());
            getBattleController().sendTargetObstacle(cellPos.x, cellPos.y);
        }.bind(this));
    },

    decreaseHP: function () {
        if (this.isDied) {
            return
        }

        // Update UI
        var backgroundHPWidth = this.backgroundHPUI.getContentSize().width
        var maxHP = this.maxHp;
        var currentHp = this.logicObstacle.currentHP
        this.hpUI.setScaleX((backgroundHPWidth*currentHp/maxHP)/this.hpUI.getContentSize().width)

        // Add effect of HP
        this.backgroundHPUI.setOpacity(255);
        this.backgroundHPUI.stopActionByTag(TAG.EFFECT_DECREASE_HP_MONSTER);

        let actionFadeBar = cc.sequence(
            cc.show(),
            cc.delayTime(2),
            cc.fadeOut(0.2),
            cc.hide()
        );
        actionFadeBar.setTag(TAG.EFFECT_DECREASE_HP_MONSTER);
        this.backgroundHPUI.runAction(actionFadeBar)

        // Add effect monster
        this.stopActionByTag(TAG.EFFECT_DECREASE_HP_FADE_MONSTER)
        let actionFadeMonster = cc.sequence(
            cc.tintTo(0.2,255,51,51),
            cc.tintTo(0.2,255,255,255)
        )
        actionFadeMonster.setTag(TAG.EFFECT_DECREASE_HP_FADE_MONSTER)
        this.runAction(actionFadeMonster)
    },
    update: function (dt) {

        this.isDied = this.logicObstacle.isDied;

        // Hieu ung mat mau
        if (this.previousHP > this.logicObstacle.currentHP) {
            this.decreaseHP()
        }

        // Update HP
        this.previousHP = this.logicObstacle.currentHP

    },

    setTargeted: function (targeted) {
        this.animationTargeted.setVisible(targeted);
    },

    log: function (){
        cc.log(1)
    }
})
