var EffectBattle = cc.Class.extend({

    _houseAttacked: "houseAttacked",
    _txtAmount: "txtAmount",

    ctor: function (position, parentUI) {
        this.position = position
        this.parentUI = parentUI
    },

    effectGainEnergy: function (amount, localZOrder, gameMgr) {
        if (amount <= 0) {
            return;
        }
        var houseAttackedEffect = ccs.load(res.house_attacked, "").node.getChildByName(this._houseAttacked).clone()
        // Set amount
        var txtAmount = houseAttackedEffect.getChildByName(this._txtAmount)
        txtAmount.setString(amount)

        // Set parent UI
        houseAttackedEffect.setAnchorPoint(0.4,0)
        houseAttackedEffect.setPosition(this.position.x,this.position.y)
        this.parentUI.addChild(houseAttackedEffect, localZOrder)

        // Set effect
        var timeMoveBy = 0.5
        var timeFadeOut = 1
        var moveBy
        if  (gameMgr.isPlayerMap) {
            moveBy = cc.moveBy(timeMoveBy, 0, BATTLE.SQUARE_SIZE/3)
        } else {
            moveBy = cc.moveBy(timeMoveBy, 0, -BATTLE.SQUARE_SIZE/3)
        }

        var remove = cc.callFunc( () =>{
            houseAttackedEffect.removeFromParent(true)
        })
        houseAttackedEffect.setCascadeColorEnabled(true)
        houseAttackedEffect.setCascadeOpacityEnabled(true)
        houseAttackedEffect.runAction(cc.sequence(moveBy, cc.fadeOut(timeFadeOut), remove))

    }
})

EffectBattle.create = function (position, parentUI) {
    return new EffectBattle(position, parentUI)
}