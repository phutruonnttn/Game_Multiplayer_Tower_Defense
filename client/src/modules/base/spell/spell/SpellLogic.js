var SpellLogic = cc.Class.extend({

    ctor: function (card, gameMgr, position, isPlayerAction) {
        this.gameMgr = gameMgr;

        // State
        this.spellID = card.getIdInJsonFile();
        this.level = card.level;
        this.isPlayerAction = isPlayerAction

        this.stat = JsonConfig.getInstance().getStatPotion(this.spellID);
        this.radius = this.stat.getRadius(card.getRank()) * BATTLE.SQUARE_SIZE
        this.range = this.radius * 2

        // So frame ma spell se ton tai
        this.timeExistence = 0
        this.x = position.x
        this.y = position.y
    },

    isInRange: function (coordinate) {
        return (Utils.round((this.x - coordinate.x)*(this.x - coordinate.x))
            + Utils.round((this.y - coordinate.y)*(this.y - coordinate.y))
            <= Utils.round(this.radius * this.radius))
    },

    update: function (dt){},
})