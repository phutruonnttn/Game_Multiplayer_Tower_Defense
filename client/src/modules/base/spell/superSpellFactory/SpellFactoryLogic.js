var SpellFactoryLogic = {};

SpellFactoryLogic.create = function(card, gameMgr, position, isPlayerAction) {
    let spellID = card.getIdInJsonFile();
    if (spellID in SpellFactoryLogic.CLASS) {
        return new SpellFactoryLogic.CLASS[spellID](card, gameMgr, position, isPlayerAction);
    } else {
        return -1;
    }
}

SpellFactoryLogic.CLASS = SpellFactoryLogic.CLASS || {};
SpellFactoryLogic.CLASS[SPELL.ID.FIRE] = SpellLogicFire;
SpellFactoryLogic.CLASS[SPELL.ID.ICE] = SpellLogicIce;
SpellFactoryLogic.CLASS[SPELL.ID.HEAL] = SpellLogicHeal;