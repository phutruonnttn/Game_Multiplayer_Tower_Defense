/**
 * Created by Team 2 - LongLH - GDF 17 on 29/11/2022.
 */


var TowerUI = cc.Node.extend({

    ctor: function (gameMgr) {
        this._super();
        this.gameMgr = gameMgr;

        this.pedestal = new cc.Sprite();
        this.pose = new cc.Sprite();
        this.weapon = new cc.Sprite();
        this.addChild(this.pedestal);
        this.addChild(this.pose);
        this.addChild(this.weapon);
        this.setCascadeColorEnabled(true);
        this.setScale(0.9);

        this.stackDt = 0;
        this.curFrame = 0;

        this.initAnimationEvolution();
        this.showCountDown();
        this.addEventListener();
        this.onIdle();
    },

    initAnimationEvolution: function () {
        this.animationEvolution = fr.createAtlasAnimation(resAni.tower.evolution);
        this.animationEvolution.setVisible(false);
        this.addChild(this.animationEvolution);
        this.animationEvolution.setCompleteListener(() => {
            this.animationEvolution.setVisible(false);
        });
    },

    initAnimation: function (fileAnimation) {
        this.animation = fr.createAtlasAnimation(fileAnimation);
        this.animation.setVisible(false);
        this.addChild(this.animation);
    },

    setFlippedX: function (flipX) {
        this.pose.setFlippedX(flipX);
        this.weapon.setFlippedX(flipX);
    },

    setLogic: function (towerLogic) {
        this.towerLogic = towerLogic;
        this.setPosition(cc.p(this.towerLogic.x, this.towerLogic.y));
        if (this.gameMgr.isPlayerMap)
            this.setLocalZOrder(this.gameMgr.gameGUI.getContentSize().height + BATTLE.SQUARE_SIZE - this.y);
        else
            this.setLocalZOrder(this.y);
        towerLogic.setUI(this);
    },

    setFrozen: function () {
        this.runAction(cc.tintTo(0, 165, 181, 169));
    },

    setUnFrozen: function () {
        this.runAction(cc.tintTo(0, 255, 255, 255));
    },

    runAnimationEvolution: function () {
        this.animationEvolution.setVisible(true);
        this.animationEvolution.setAnimation(0, resAniId.tower.evolution, 0);
    },

    showCountDown: function () {
        if (this.timer === undefined) {
            this.timer = new TimerTower();
            this.addChild(this.timer);
        }
        else {
            this.timer.reset();
        }
    },

    addEventListener: function () {
        // Không thể hiển thị tower option ở trụ trong Opponent's MAP
        if (this.gameMgr.isPlayerMap === false)
            return;
        let btnOption = gv.commonButton(BATTLE.SQUARE_SIZE, BATTLE.SQUARE_SIZE, 0, 0);
        this.addChild(btnOption);
        btnOption.setOpacity(0);
        btnOption.setSwallowTouches(false);
        btnOption.addTouchEventListener( function (button, eventType) {
            switch (eventType) {
                case (ccui.Widget.TOUCH_BEGAN): {
                    if (!this.timer.finished || gv.battleScene.cardSelectedIndex !== 0)
                        this.willShowOption = false;
                    else
                        this.willShowOption = true;
                    break;
                }
                case (ccui.Widget.TOUCH_ENDED): {
                    if (this.willShowOption)
                        TowerOption.getInstance().setTower(this);
                    break;
                }
            }
        }.bind(this));
    },

    onAttack: function () {
        this.frameState = TOWER.FRAME_ATTACK;
        this.curFrame = 0;
        this.stackDt = 0;
    },

    onIdle: function () {
        this.frameState = TOWER.FRAME_IDLE;
    },

    nextFrame: function (frameDelta) {
        this.pedestal.setTexture(res_tower_pedestal[this.towerLogic.getEvolution()]);
        this.curFrame = (this.curFrame + frameDelta) % TOWER.FRAME[this.towerLogic.towerID].FRAME_PER_STATE[this.frameState];
        this.pose.setSpriteFrame(this.getPoseFrame());
        this.weapon.setSpriteFrame(this.getWeaponFrame());
    },

    getPoseFrame: function () {
        let pose = TOWER.FRAME[this.towerLogic.towerID].NAME+"_"+this.frameState+"_0_"+this.getFrameIndex(this.curFrame)+".png";
        return cc.spriteFrameCache.getSpriteFrame(pose);
    },

    getWeaponFrame: function () {
        let weapon = TOWER.FRAME[this.towerLogic.towerID].NAME+"_"+this.frameState+"_"+this.towerLogic.getEvolution()+"_"+this.getFrameIndex(this.curFrame)+".png";
        return cc.spriteFrameCache.getSpriteFrame(weapon);
    },

    update: function (dt) {
        if (!this.timer.finished) {
            this.timer.update(dt);
            return;
        }
        if (this.towerLogic.isImmobile())
            return;
        this.stackDt += dt;
        while (this.stackDt >= TOWER.SECOND_PER_FRAME) {
            this.stackDt -= TOWER.SECOND_PER_FRAME;
            this.nextFrame(1);
        }
    },

    destroy: function () {
        getBattleController().sendCancelTower(this.towerLogic.cellPos.x, this.towerLogic.cellPos.y);
    },

});