var EffectDropCard = cc.Class.extend({

    ctor: function (name, level, position, parentUI) {
        this.name = name
        this.level = level
        this.position = position
        this.parentUI = parentUI

        this.showEffect()
    },

    showEffect: function () {
        this.infoCard = ccs.load("ui/InfoCard.json", "").node
        this.infoCard.setAnchorPoint(0.5, 0.5)

        this.cardName = this.infoCard.getChildByName("name")
        this.cardName.setString(this.name)

        this.cardLevel = this.infoCard.getChildByName("level")
        this.cardLevel.setString("Lv " + this.level)

        if (this.parentUI.isPlayerMap) {
            this.infoCard.setPosition(this.position.x, this.position.y + BATTLE.SQUARE_SIZE * 1.5)
        } else {
            this.infoCard.setPosition(this.position.x, this.position.y - BATTLE.SQUARE_SIZE * 1.5)
        }

        this.parentUI.addChild(this.infoCard, this.parentUI.getContentSize().height + BATTLE.SQUARE_SIZE + 1)

        var remove = cc.callFunc( () =>{
            this.infoCard.removeFromParent(true)
        })
        this.infoCard.runAction(
            cc.sequence(
                cc.delayTime(1),
                cc.fadeOut(0.5),
                remove
            )
        )
    }
})

EffectDropCard.create = function (name, level, position, parentUI) {
    return new EffectDropCard(name, level, position, parentUI)
}