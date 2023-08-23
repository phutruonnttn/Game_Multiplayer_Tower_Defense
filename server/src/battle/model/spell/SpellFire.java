package battle.model.spell;

import battle.GameMgr;
import battle.model.Coordinate;
import battle.model.shootableMonster.Monster;
import config.battle.BattleConfig;
import model.user.card.Card;

public class SpellFire extends Spell {

    public double damage;
    public int timeExistence;

    public SpellFire(Card card, GameMgr gameMgr, Coordinate pos, int userAction) {
        super(card, gameMgr, pos, userAction);
        this.damage = this.stat.getPotionValue("damage", card.level);
        this.timeExistence = BattleConfig.DELAY_FRAME_FALL_ANIMATION;
    }

    @Override
    public void update(double dt) {
        this.timeExistence--;
        if (this.timeExistence == 0) {
            this.action();
        }
    }

    @Override
    public int getTimeExistence() {
        return this.timeExistence;
    }

    // Trừ máu của monster trong vùng bị ảnh hưởng
    public void action() {
        for (int i = 0; i < this.gameMgr.listMonster.size(); i++) {
            Monster monster = this.gameMgr.listMonster.get(i);
            if (this.isInRange(monster.getPosition()) && monster.canTarget()) {
                monster.decreaseHP(this.damage);
                if(!monster.canFly()){
                    monster.thrownOut(new Coordinate(this.x, this.y));
                }
            }
        }
    }
}
