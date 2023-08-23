let MonsterUI = cc.Sprite.extend({

    ctor: function (typeOfMonster, gameMgr, logicMonster, typeShadow, isPlayerMap){
        this._super(cc.spriteFrameCache.getSpriteFrame("monster_" + MonsterFrame[typeOfMonster].name + "_run_0000.png"))

        this.typeOfMonster = typeOfMonster
        this.isReachedTarget = false
        this.isDied = false
        this.gameGUI = gameMgr.gameGUI
        this.gameMgr = gameMgr
        this.countFrame = 0
        this.logicMonster = logicMonster
        this.previousHP = this.logicMonster.currentHP
        this.timeFixChangeFrame = 0
        this.isDiedByHole = this.logicMonster.isDiedByHole;
        this.positionHole = this.logicMonster.positionHole;

        this.effect = {};

        this.timeOutStopAnimationBuffHp = null;
        this.timeOutStopAnimationShied = null;
        this.timeOutStopAnimationStun = null;
        this.timeOutStopAnimationOil = null;

        this.effectPlayerDrop = fr.createAtlasAnimation(resAni.enemy_circle)
        this.effectPlayerDrop.setVisible(false)
        this.effectPlayerDrop.setScale(0.5)
        this.effectPlayerDrop.setPosition(this.getContentSize().width/2, this.getContentSize().height/2)
        this.countShowEffectDrop = null
        this.initShadow(typeShadow)

        this.setZOrderUI()
        this.initHPBar(isPlayerMap);

    },

    setZOrderUI: function () {
        if (this.gameGUI.isPlayerMap)
            this.setLocalZOrder(this.gameGUI.getContentSize().height + BATTLE.SQUARE_SIZE - this.y)
        else
            this.setLocalZOrder(this.y)
    },

    initEffectShield: function (){
        this.effect.shield = fr.createAtlasAnimation("res/tower/fx/icon_shield");
        this.effect.shield.setVisible(false);
        this.effect.shield.setAnimation(0,"animation", true);
        this.effect.shield.setPosition(this.width/2, this.height);
        this.addChild(this.effect.shield);
    },
    runEffectShield: function (){
        if(this.logicMonster.isShield()){
            if(!this.effect.shield){
                this.initEffectShield();
            }
            this.effect.shield.setVisible(true);
            var self = this;
            if(!this.timeOutStopAnimationShied){
                this.timeOutStopAnimationShied = setTimeout(function (){
                    if(!self.logicMonster.isDied){
                        self.effect.shield.setVisible(false);
                        self.timeOutStopAnimationShied = null;
                    }
                }, 500);
            }
        }
    },
    initEffectStun: function (){
        this.effect.stun = fr.createAtlasAnimation("res/tower/fx/effect_stun");
        this.effect.stun.setVisible(false);
        this.effect.stun.setAnimation(0,"animation", true);
        this.effect.stun.setPosition(this.width/2, this.height);
        this.addChild(this.effect.stun);

    },
    runEffectStun: function (){
        if(this.logicMonster.isStunned()){
            if(!this.effect.stun){
                this.initEffectStun();
            }
            this.effect.stun.setVisible(true);
            var self = this;
            if(!this.timeOutStopAnimationStun){
                this.timeOutStopAnimationStun = setTimeout(function (){
                    if(!self.logicMonster.isDied){
                        self.effect.stun.setVisible(false);
                        self.timeOutStopAnimationStun = null;
                    }
                }, 500);
            }
        }
    },
    initEffectOil: function (){
        this.effect.oil = fr.createAtlasAnimation("res/tower/fx/tower_oil_fx");
        this.effect.oil.setVisible(false);
        this.effect.oil.setAnimation(0,"hit_target_bullet", true);
        this.effect.oil.setPosition(this.width/2, this.height/3);
        this.addChild(this.effect.oil);
    },
    runEffectOil: function (){
        if(this.logicMonster.isOilEffect()){
            this.logicMonster.oilEffect = false;
            if(!this.effect.oil){
                this.initEffectOil();
            }
            this.effect.oil.setVisible(true);
            var self = this;
            if(this.timeOutStopAnimationOil){
                clearTimeout(this.timeOutStopAnimationOil);
                self.timeOutStopAnimationOil = null;
            }
            if(!this.timeOutStopAnimationOil){
                this.timeOutStopAnimationOil = setTimeout(function (){
                    if(!self.logicMonster.isDied){
                        self.effect.oil.setVisible(false);
                        self.timeOutStopAnimationOil = null;
                    }
                }, 1000);
            }
        }
    },
    initEffectBuffHp: function (){

        this.effect.heal = fr.createAtlasAnimation("res/potion/fx_heal");
        this.effect.heal.setVisible(false);
        this.effect.heal.setAnimation(0, "fx_heal", true);
        this.effect.heal.setPosition(this.width/2, this.height/2);
        this.addChild(this.effect.heal);
    },

    initEffectSlow: function (){

        this.effect.slow = cc.RepeatForever(cc.sequence(
            cc.tintTo(1,165, 181, 169),
            cc.tintTo(0.5,255,255,255)
        ));

        this.effect.slow.retain();
        this.effect.slow.isActive = false;
    },

    runEffectSlow: function (){

        if(!this.effect.slow){
            this.initEffectSlow();
        }
        if(this.logicMonster.isSlow()){
            if( !this.effect.slow.isActive){
                this.runAction(this.effect.slow);
                this.effect.slow.isActive = true;
            }
        }else {
            if(this.effect.slow.isActive){
                this.effect.slow.isActive = false;
                this.stopAction(this.effect.slow);
                this.runAction(cc.tintTo(0,255,255,255))
            }
        }
    },

    initEffectFreeze: function (){
        this.freezePrite = new cc.Sprite("res/tower/fx/effect_freeze.png");
        this.freezePrite.setPosition(this.width/2, this.height/2);
        this.freezePrite.setScale(BATTLE.SQUARE_SIZE/this.freezePrite.width * 0.8);
        this.addChild(this.freezePrite);
        this.freezePrite.setVisible(false);
    },

    runEffectFreeze: function(){

        if(this.logicMonster.isFrozen()){
            if(!this.freezePrite){
                this.initEffectFreeze();
            }
            this.freezePrite.setVisible(true);
        }else {
            if(this.freezePrite){
                this.freezePrite.setVisible(false);
            }
        }
    },

    initShadow: function (type) {
        this.shadow = new cc.Sprite(res.battle.shadow_png)
        this.shadow.setOpacity(150)
        this.shadow.setPosition(this.getContentSize().width/2, this.getContentSize().height/2)
        this.addChild(this.shadow, -1)

        switch (type) {
            case BATTLE.RED_SHADOW: {
                this.countShowEffectDrop = 5
                this.effectPlayerDrop.setAnimation(0, resAniId.enemy_circle.enemy_circle, true);
                this.addChild(this.effectPlayerDrop, -1)
                break
            }
            case BATTLE.BLUE_SHADOW: {
                this.countShowEffectDrop = 5
                this.effectPlayerDrop.setAnimation(0, resAniId.enemy_circle.monster_circle, true);
                this.addChild(this.effectPlayerDrop, -1)
                break
            }
        }
    },

    initMonster: function () {
        // this.initMonsterSize()
        this.initHPBar()
    },

    initMonsterSize: function () {
        this.setScale(BATTLE.SQUARE_SIZE*this.logicMonster.hitRadius*2/this.getContentSize().width)
    },

    initHPBar: function (isPlayerMap) {
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
        if(!isPlayerMap)this.hpUI = new cc.LayerColor(cc.color(0,255,0), this.hpUI.width, this.hpUI.height);

        this.hpUI.setScaleX(this.backgroundHPUI.getContentSize().width/this.hpUI.getContentSize().width)
        this.hpUI.setAnchorPoint(0,0)
        this.hpUI.setPosition(0,0)
        this.backgroundHPUI.addChild(this.hpUI,1)
        this.backgroundHPUI.setVisible(false)
    },
    showHpUI: function (){
        var backgroundHPWidth = this.backgroundHPUI.getContentSize().width
        var maxHP = this.logicMonster.baseHp
        var currentHp = this.logicMonster.currentHP
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

    },
    decreaseHP: function () {
        if (this.isDied) {
            this.effectMonsterDied()
            return
        }
        // Update UI

        // Add effect monster
        this.stopActionByTag(TAG.EFFECT_DECREASE_HP_FADE_MONSTER)
        let actionFadeMonster = cc.sequence(
            cc.tintTo(0.2,255,51,51),
            cc.tintTo(0.2,255,255,255)
        )
        actionFadeMonster.setTag(TAG.EFFECT_DECREASE_HP_FADE_MONSTER)
        this.runAction(actionFadeMonster)
    },

    decreaseSpeed: function (amount) {
        // Code effect here
    },

    increaseSpeed: function (amount) {
        // Code effect here
    },

    // Input: index của frame
    // Output: SpriteFrame tại index
    getSpriteFrameAnimation: function (indexOfFrame) {
        var str = ""
        var monsterName = MonsterFrame[this.typeOfMonster].name
        if (indexOfFrame < 10) {
            str = "monster_" + monsterName + "_run_000" + indexOfFrame + ".png"
        } else if (indexOfFrame < 100) {
            str = "monster_" + monsterName + "_run_00" + indexOfFrame + ".png"
        } else {
            str = "monster_" + monsterName + "_run_0" + indexOfFrame + ".png"
        }
        return cc.spriteFrameCache.getSpriteFrame(str);
    },

    effectMonsterDied: function () {
        // Effect die smoke
        this.effectDieSmoke()

        // Effect die soul
        this.effectDieSoul()

        // Add effect gain energy
        this.effectGainEnergy()
    },

    effectDieSoul: function () {
        var animateDieSoul = new cc.Sprite( cc.spriteFrameCache.getSpriteFrame("monster_die_soul_fx_0000.png"))
        if (this.gameGUI.isPlayerMap)
            animateDieSoul.setPosition(this.x, this.y + BATTLE.SQUARE_SIZE/2);
        else
            animateDieSoul.setPosition(this.x, this.y - BATTLE.SQUARE_SIZE/2);
        animateDieSoul.setScale((BATTLE.SQUARE_SIZE*4/3)/animateDieSoul.getContentSize().width)
        this.gameGUI.addChild(animateDieSoul)

        var frameListDieSoul = []
        for(var i=1; i<=32; i++) {
            var str;
            if (i<10) {
                str  = 'monster_die_soul_fx_000'+ i +'.png'
            } else {
                str  = 'monster_die_soul_fx_00'+ i +'.png'
            }
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frameListDieSoul.push(frame);
        }
        var animation = new cc.Animation(frameListDieSoul, 0.04);
        animateDieSoul.runAction(cc.sequence(
            cc.animate(animation),
            cc.callFunc(
                () => {
                    animateDieSoul.removeFromParent(true)
                })
        ))
    },

    effectDieSmoke: function () {
        var animateDieSmoke = new cc.Sprite( cc.spriteFrameCache.getSpriteFrame("monster_die_smoke_fx_0000.png"))
        animateDieSmoke.setPosition(this.x, this.y)
        animateDieSmoke.setScale((BATTLE.SQUARE_SIZE*4/3)/animateDieSmoke.getContentSize().width)
        this.gameGUI.addChild(animateDieSmoke)

        var frameListDieSmoke = []
        for(var i=1; i<=19; i++) {
            var str;
            if (i<10) {
                str  = 'monster_die_smoke_fx_000'+ i +'.png'
            } else {
                str  = 'monster_die_smoke_fx_00'+ i +'.png'
            }
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frameListDieSmoke.push(frame);
        }
        var animation = new cc.Animation(frameListDieSmoke, 0.08);
        animateDieSmoke.runAction(cc.sequence(
            cc.animate(animation),
            cc.callFunc(
                () => {
                    animateDieSmoke.removeFromParent(true)
                })
        ))
    },

    effectGainEnergy: function () {
        if (!this.isReachedTarget) {
            EffectBattle.create(cc.p(this.x, this.y), this.gameGUI).effectGainEnergy(this.logicMonster.gainEnergy,
                this.gameGUI.getContentSize().height + BATTLE.SQUARE_SIZE, this.gameMgr)
        }
    },

    // Thay doi frame theo huong di chuyen hien tai
    changeFrame: function(keyHashDirection) {
        if (!this.logicMonster.isFrozen() && !this.logicMonster.isStunned()) {
            var hashDirection = BATTLE.HASH_DIRECTION[keyHashDirection]
            if(!hashDirection){
                hashDirection = BATTLE.HASH_DIRECTION["1010"]
            }
            let direction = hashDirection.direction;
            let flipX = hashDirection.flipX;
            // Lộn ngược lại nếu như đây là Opponent's MAP
            if (this.gameGUI.isPlayerMap === false) {
                direction = 4 - direction;
                flipX = !flipX;
            }
            this.countFrame = this.getNextFrameMove(this.countFrame,direction)
            this.setSpriteFrame(this.getSpriteFrameAnimation(this.countFrame))
            this.setFlippedX(flipX)
        }
    },

    // Get frame tu resouce theo dung huong di chuyen
    getNextFrameMove: function (currentCount, direction) {
        var countFrame = currentCount
        if (this.timeFixChangeFrame > BATTLE.MIN_FIX_CHANGE_FRAME) {
            countFrame++
            this.timeFixChangeFrame = 0
        }
        var lengthOfFrame = MonsterFrame[this.typeOfMonster].lengthOfFrame/5
        return lengthOfFrame * direction + countFrame % lengthOfFrame
    },

    runEffectMonsterBuffHp: function (){
        if(!this.effect.heal){
            this.initEffectBuffHp();
        }
        this.effect.heal.setVisible(true);
        var self = this;
        if(!this.timeOutStopAnimationBuffHp){
            this.timeOutStopAnimationBuffHp = setTimeout(function (){
                if(!self.logicMonster.isDied){
                    self.effect.heal.setVisible(false);
                    self.timeOutStopAnimationBuffHp = null;
                }
            }, 500);
        }
    },

    isBoss: function () {
        return false
    },

    update: function (dt) {
        if (this.isReachedTarget) {
            return
        }

        // Show effect drop card monster
        if (this.countShowEffectDrop != null && this.countShowEffectDrop > 0) {
            this.countShowEffectDrop--
            if (this.countShowEffectDrop == 0) {
                this.effectPlayerDrop.setVisible(true)
            }
        }


        // Update time to change frame
        this.timeFixChangeFrame += dt * (this.logicMonster.curSpeed / BATTLE.STANDARD_SPEED );

        // Update position UI
        this.x = this.logicMonster.position.x
        this.y = this.logicMonster.position.y

        // Update Z order
        this.setZOrderUI()

        // Update frame
        this.changeFrame(this.logicMonster.keyHashDirection)

        // Update flags
        this.isReachedTarget = this.logicMonster.isReachedTarget
        this.isDied = this.logicMonster.isDied
        this.isDiedByHole = this.logicMonster.isDiedByHole;

        // thay doi mau
        if (this.previousHP != this.logicMonster.currentHP){
            this.showHpUI();
        }
        // Hieu ung mat mau
        if (this.previousHP > this.logicMonster.currentHP) {
            this.decreaseHP()
        }
        // hieu ung buff mau
        if (this.previousHP < this.logicMonster.currentHP) {
            this.runEffectMonsterBuffHp();
        }

        // Update HP
        this.previousHP = this.logicMonster.currentHP

        this.positionHole = this.logicMonster.positionHole;

        if (this.isReachedTarget) {
            this.effectMonsterDied()
        }
        this.runEffectSlow();
        this.runEffectFreeze();
        this.runEffectShield();
        this.runEffectStun();
        this.runEffectOil();
    },
    fallIntoHole: function (){

        this.runAction(cc.scaleTo(1, 0.1));
        //di chuyen vao giua hole
        this.runAction(cc.moveTo(1, this.positionHole));

        this.runAction(cc.rotateTo(1, -90));

    }
})