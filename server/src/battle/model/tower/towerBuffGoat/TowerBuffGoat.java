package battle.model.tower.towerBuffGoat;

import battle.GameMgr;
import battle.model.shootableMonster.Monster;
import battle.model.tower.towerAttack.TowerAttack;
import battle.model.tower.towerBuff.TowerBuff;
import config.battle.BattleConfig;
import model.user.card.Card;
import util.battle.BattleUtils;

public class TowerBuffGoat extends TowerBuff {

    public TowerBuffGoat(Card card, GameMgr gameMgr) {
        super(card, gameMgr);
    }

    @Override
    public void buffTower(TowerAttack towerAttack) {
        towerAttack.buffDamage(this.getBuffAmount());
    }

    @Override
    public void unBuffTower(TowerAttack towerAttack) {
        towerAttack.buffDamage(-this.getBuffAmount());
    }

    public void update(double dt) {
        super.update(dt);
        if (this.canUseSkill()) {
            ++this.loopCounter;
            while (this.loopCounter >= BattleConfig.TOWER_MAX_DELAY_FRAME) {
                this.loopCounter -= BattleConfig.TOWER_MAX_DELAY_FRAME;
                this.gameMgr.getListMonsterInNeighborCell(this.cellPos.getX(), this.cellPos.getY(), this.getBaseRange()).forEach((Monster monster) -> {
                    if (BattleUtils.getInstance().inCircle(this.getPosition(), this.getRange() + monster.hitRadius, monster.getPosition())) {
                        monster.speedDown(0.8, 0, BattleConfig.TOWER_MAX_DELAY_FRAME);
                    }
                });
            }
        }
    }
}
