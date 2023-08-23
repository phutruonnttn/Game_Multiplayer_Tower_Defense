package battle.model.shootableMonster.Satyr;

import battle.GameMgr;
import battle.model.shootableMonster.Monster;
import battle.model.shootableMonster.config.MonsterType;
import battle.model.shootableMonster.config.SatyrConfig;

public class Satyr extends Monster {

    public Satyr(GameMgr gameMgr, int id, int HPRatio, boolean isMonsterDrop) {
        super(MonsterType.SATYR, SatyrConfig.level, gameMgr, id, HPRatio, isMonsterDrop);
        this.ability = new SatyrAbility(this);
    }

    public boolean isBoss() {
        return true;
    }

}
