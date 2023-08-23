package battle.model.spell;

import battle.GameMgr;
import battle.model.Coordinate;
import battle.model.shootableMonster.Monster;
import config.battle.BattleConfig;
import model.user.card.Card;
import readjson.BuffTarget;
import readjson.JsonConfig;

import java.util.HashMap;
import java.util.Map;

public class SpellHeal extends Spell {

    public Map<Integer, Boolean> monsterActivated;
    public int timeExistence;
    public double durationOnTarget;
    public double delay;
    public double hpPerDelay;

    public SpellHeal(Card card, GameMgr gameMgr, Coordinate pos, int userAction) {
        super(card, gameMgr, pos, userAction);
        this.monsterActivated = new HashMap<Integer, Boolean>();
        this.timeExistence = (int)this.stat.getDuration() * BattleConfig.FRAME_PER_SECOND;
        BuffTarget buffTarget = JsonConfig.getInstance().getBuffTarget(this.stat.getAdjustValue("enemy"));
        this.durationOnTarget = buffTarget.getDuration(1, card.level);
        this.delay = buffTarget.getDelay(1);
        this.hpPerDelay = buffTarget.getHpPerDelay(1, card.level);
    }

    public void update(double dt){
        // Quet quai trong vung heal
        for (int i = 0; i < this.gameMgr.listMonster.size(); i++) {
            Monster monster = this.gameMgr.listMonster.get(i);
            if (this.isInRange(monster.getPosition()) && this.monsterActivated.get(monster.getId()) == null && monster.canTarget()) {
                // nTick: so frame tac dung
                // f: bao nhieu frame 1 lan
                // hp: 1 lan bao nhieu hp
                monster.buffHpUp(
                        (int)this.durationOnTarget * BattleConfig.FRAME_PER_SECOND,
                        (int)this.delay * BattleConfig.FRAME_PER_SECOND / 1000,
                        this.hpPerDelay
                );
                this.monsterActivated.put(monster.getId(), true);
            }
        }
        this.timeExistence--;
    }

    @Override
    public int getTimeExistence() {
        return this.timeExistence;
    }
}
