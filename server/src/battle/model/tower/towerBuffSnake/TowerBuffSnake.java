package battle.model.tower.towerBuffSnake;

import battle.GameMgr;
import battle.model.shootableMonster.Monster;
import battle.model.tower.towerAttack.TowerAttack;
import battle.model.tower.towerBuff.TowerBuff;
import config.battle.BattleConfig;
import model.user.card.Card;
import util.battle.BattleUtils;

public class TowerBuffSnake extends TowerBuff {

    public TowerBuffSnake(Card card, GameMgr gameMgr) {
        super(card, gameMgr);
    }

    @Override
    public void buffTower(TowerAttack towerAttack) {
        towerAttack.buffAttackSpeed(this.getBuffAmount());
    }

    @Override
    public void unBuffTower(TowerAttack towerAttack) {
        towerAttack.buffAttackSpeed(-this.getBuffAmount());
    }

    public void update(double dt) {
        super.update(dt);
        if (this.canUseSkill()) {
            ++this.loopCounter;
            while (this.loopCounter >= BattleConfig.FRAME_PER_SECOND) {
                this.loopCounter -= BattleConfig.FRAME_PER_SECOND;
                this.gameMgr.getListMonsterInNeighborCell(this.cellPos.getX(), this.cellPos.getY(), this.getBaseRange()).forEach((Monster monster) -> {
                    if (BattleUtils.getInstance().inCircle(this.getPosition(), this.getRange() + monster.hitRadius, monster.getPosition())) {
                        double burnDamage = BattleUtils.round(Math.min(monster.baseHp * 0.01, 5));
                        monster.buffHpDown(1, 1, burnDamage);
                    }
                });
            }
        }
    }
}
