var SpellUI = cc.Node.extend({

    ctor: function (gameMgr, card, position) {
        this._super();
        this.gameMgr = gameMgr;
        this.position = position
        this.spellID = card.getIdInJsonFile();
        this.level = card.level;
        this.stat = JsonConfig.getInstance().getStatPotion(this.spellID);
        this.radius = this.stat.getRadius(card.getRank()) * BATTLE.SQUARE_SIZE
        this.range = this.radius * 2
        this.animation = fr.createAtlasAnimation(SPELL.SOURCE_ANIMATION[card.getIdInJsonFile()]);
        this.gameMgr.gameGUI.addChild(this.animation);
        this.animation.setLocalZOrder(this.gameMgr.gameGUI.getContentSize().height + BATTLE.SQUARE_SIZE * 2);
    }
})