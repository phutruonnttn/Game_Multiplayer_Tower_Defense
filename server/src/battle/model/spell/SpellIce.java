package battle.model.spell;

import battle.GameMgr;
import battle.model.Coordinate;
import battle.model.shootableMonster.Monster;
import battle.model.tower.tower.Tower;
import config.battle.BattleConfig;
import model.user.card.Card;
import readjson.JsonConfig;
import util.battle.BattleUtils;

public class SpellIce extends Spell {

    public double damage;
    public double durationOnTarget;
    public double durationOnTower;
    public int timeExistence;

    public SpellIce(Card card, GameMgr gameMgr, Coordinate pos, int userAction) {
        super(card, gameMgr, pos, userAction);
        this.damage = this.stat.getPotionValue("damagePercent", card.level);
        this.timeExistence = BattleConfig.DELAY_FRAME_FALL_ANIMATION;
        this.durationOnTarget = JsonConfig.getInstance().getBuffTarget(this.stat.getAdjustValue("player")).getDuration(1, card.level);
        this.durationOnTower = JsonConfig.getInstance().getBuffTower(this.stat.getAdjustValue("enemy")).getDuration(1, card.level);
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

    public void action() {
        // Gay sat thuong va dong bang quai
        if (this.userAction == this.gameMgr.user.getId()) {
            for (int i = 0; i < this.gameMgr.listMonster.size(); i++) {
                Monster monster = this.gameMgr.listMonster.get(i);
                if (this.isInRange(monster.getPosition()) && monster.canTarget()) {
                    monster.decreaseHP(this.damage);
                    monster.freezeMonster((int) Math.floor(BattleUtils.round(this.durationOnTarget * BattleConfig.FRAME_PER_SECOND)));
                }
            }
        }
        // Dong bang tru
        else {
            for (int i = 0; i < this.gameMgr.listTower.size(); i++) {
                Tower tower = this.gameMgr.listTower.get(i);
                if (this.isInRange(tower.getPosition())) {
                    tower.setFrozen(this.durationOnTower);
                }
            }
        }
    }
}