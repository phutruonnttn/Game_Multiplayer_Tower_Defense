
var SpellUIHeal = SpellUI.extend({

    ctor: function (gameMgr, card, position) {
        this._super(gameMgr, card, position)
        this.animation.setPosition(position)
        this.animation.setLocalZOrder(this.gameMgr.gameGUI.getContentSize().height + BATTLE.SQUARE_SIZE * 2)
        this.animation.setScale(this.range / SPELL.WIDTH[this.spellID])
        this.action()
    },

    action: function () {
        var sequence = cc.sequence(
            cc.callFunc(()=>{
                    this.animation.setAnimation(0, "animation_full", true)
                }
            ),
            cc.delayTime(this.stat.getDuration()),
            cc.callFunc(()=>{
                    this.animation.removeFromParent(true)
                }
            )
        )
        this.animation.runAction(sequence)
    }
})