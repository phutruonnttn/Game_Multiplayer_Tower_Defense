package battle.model.spell;

import battle.GameMgr;
import battle.model.Coordinate;
import config.battle.BattleConfig;
import model.user.card.Card;

public class SpellFactory {

    public static Spell create(Card card, GameMgr gameMgr, Coordinate pos, int userAction) {
        int spellID = card.getIdInJsonFile();
        Spell spell;
        switch (spellID) {
            case BattleConfig.SPELL_ID_FIRE:
                spell = new SpellFire(card, gameMgr, pos, userAction);
                break;
            case BattleConfig.SPELL_ID_ICE:
                spell = new SpellIce(card, gameMgr, pos, userAction);
                break;
            case BattleConfig.SPELL_ID_HEAL:
                spell = new SpellHeal(card, gameMgr, pos, userAction);
                break;
            default:
                spell = null;
        }
        return spell;
    }
}
