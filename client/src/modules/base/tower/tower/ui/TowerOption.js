/**
 * Created by Team 2 - LongLH - GDF 17 on 28/11/2022.
 */


var TowerOption = cc.Node.extend({

    _circle: "ui_circle_transparent",
    _btnDestroy: "btnDestroy",
    _txtDestroyPayback: "txtDestroyPayback",
    _btnTargetFurthest: "btnTargetFurthest",
    _btnTargetNearest: "btnTargetNearest",
    _btnTargetFullHp: "btnTargetFullHp",
    _btnTargetLowHp: "btnTargetLowHp",

    ctor: function () {
        this._super();

        this.sprRange = new cc.Sprite(res.battle.battle_tower_range_player_png);
        this.addChild(this.sprRange);

        this._node = ccs.load(res.battle_tower_option, "").node;
        this._node.setScale(0.8);
        this.addChild(this._node);
        this.initButton();
        this.gameGUI = gv.battleScene.battleMgr.gamePlayerMgr.gameGUI;
        gv.battleScene.addChild(this);
        this.setVisible(false);
    },

    initButton: function () {
        this.initBtnDestroy();
        this.initBtnTarget();
        this.setPosBtn();
    },

    initBtnDestroy: function () {
        this.btnDestroy = this._node.getChildByName(this._btnDestroy);
        this.btnDestroy.addClickEventListener(function () {
            getBattleController().sendCancelTower(this.towerUI.towerLogic.cellPos.x, this.towerUI.towerLogic.cellPos.y);
            this.destroy();
        }.bind(this));
        this.txtDestroyPayback = this.btnDestroy.getChildByName(this._txtDestroyPayback);
    },

    initBtnTarget: function () {
        this.btnTarget = {};
        this.btnTarget[TOWER.TARGET_MODE.FURTHEST] = this._node.getChildByName(this._btnTargetFurthest);
        this.btnTarget[TOWER.TARGET_MODE.NEAREST] = this._node.getChildByName(this._btnTargetNearest);
        this.btnTarget[TOWER.TARGET_MODE.FULL_HP] = this._node.getChildByName(this._btnTargetFullHp);
        this.btnTarget[TOWER.TARGET_MODE.LOW_HP] = this._node.getChildByName(this._btnTargetLowHp);
        for (let key in this.btnTarget) {
            this.btnTarget[key].addClickEventListener(function (targetMode) {
                getBattleController().sendChangeTargetTower(this.towerUI.towerLogic.cellPos.x, this.towerUI.towerLogic.cellPos.y, targetMode);
                this.destroy();
            }.bind(this, Number(key)));
        }
    },

    setPosBtn: function () {
        let radius = this._node.getChildByName(this._circle).width / 2;
        let listBtn = [this.btnDestroy];
        for (let key in this.btnTarget)
            listBtn.push(this.btnTarget[key]);
        let startAngle = -Math.PI / 2;
        let dAngle = -2 * Math.PI / listBtn.length;
        listBtn.forEach(function (btn, index) {
            let x = Math.cos(startAngle + index * dAngle) * radius;
            let y = Math.sin(startAngle + index * dAngle) * radius;
            btn.setPosition(cc.p(x, y));
        });
    },

    setTower: function (towerUI) {
        this.setVisible(true);
        this.towerUI = towerUI;
        this.updatePos();
        this.updateBtnDestroy();
        this.updateBtnTargetMode();
        this.updateSprRange();
    },

    updatePos: function () {
        let position = this.gameGUI.getPosition();
        position.x += this.towerUI.x;
        position.y += this.towerUI.y;
        this.setPosition(position);
    },

    updateBtnDestroy: function () {
        this.txtDestroyPayback.setString(this.towerUI.towerLogic.getEnergyBack());
    },

    updateBtnTargetMode: function () {
        if (this.towerUI.towerLogic.targetMode === undefined) {
            for (let key in this.btnTarget)
                this.btnTarget[key].setVisible(false);
        }
        else {
            for (let key in this.btnTarget)
                this.btnTarget[key].setVisible(true);
            for (let key in this.btnTarget)
                this.btnTarget[key].setOpacity(150);
            this.btnTarget[this.towerUI.towerLogic.targetMode].setOpacity(255);
        }
    },

    updateSprRange: function () {
        this.sprRange.setScale(this.towerUI.towerLogic.getRange() * 2 / this.sprRange.width);
    },

    destroy: function () {
        this.setVisible(false);
    },

});

var _towerOption;
TowerOption.getInstance = function () {
    try {
        _towerOption.setVisible(false);
    }
    catch (e) {
        _towerOption = new TowerOption();
    }
    return _towerOption;
};