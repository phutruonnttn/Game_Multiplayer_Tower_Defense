package battle.model.shootableMonster.darkGiant;

import battle.GameMgr;
import battle.model.shootableMonster.Monster;
import battle.model.shootableMonster.config.MonsterType;


public class DarkGiant extends Monster {

    public DarkGiant(GameMgr gameMgr, int id, int HPRatio, boolean isMonsterDrop) {
        super(MonsterType.DARK_GIANT, 1, gameMgr, id, HPRatio, isMonsterDrop);
        this.ability = new DarkGiantAbility(this);
    }

    public boolean isBoss() {
        return true;
    }
}
