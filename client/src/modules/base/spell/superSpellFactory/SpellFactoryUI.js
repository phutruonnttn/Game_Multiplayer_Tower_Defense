var SpellFactoryUI = {};

SpellFactoryUI.create = function(card, gameMgr, position) {
    let spellID = card.getIdInJsonFile();
    if (spellID in SpellFactoryUI.CLASS) {
        return new SpellFactoryUI.CLASS[spellID](gameMgr, card, position);
    } else {
        // Fix ve cau lua neu phep chua co
        return SpellFactoryUI.create(gv.user.listCard[6], gameMgr, position);
    }
}

SpellFactoryUI.CLASS = SpellFactoryUI.CLASS || {};

SpellFactoryUI.CLASS[SPELL.ID.FIRE] = SpellUIFire;
SpellFactoryUI.CLASS[SPELL.ID.ICE] = SpellUIIce;
SpellFactoryUI.CLASS[SPELL.ID.HEAL] = SpellUIHeal;