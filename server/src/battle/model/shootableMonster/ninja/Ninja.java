package battle.model.shootableMonster.ninja;

import battle.GameMgr;
import battle.model.shootableMonster.Monster;
import battle.model.shootableMonster.config.MonsterType;


public class Ninja extends Monster {

    double curMaxHp;

    public Ninja(int lever, GameMgr gameMgr, int id, int HPRatio, boolean isMonsterDrop) {

        super(MonsterType.NINJA, lever, gameMgr, id, HPRatio, isMonsterDrop);
        this.curMaxHp = this.getCurrentHP();
        this.ability = new NinjaAbility(this);
    }

    @Override
    public void runAbility(){

        if(this.curMaxHp < this.currentHP){
            this.curMaxHp = this.currentHP;
        }
        if(((NinjaAbility)this.ability).canActive(this.curMaxHp, this.currentHP)){
            this.ability.active();
            this.curMaxHp = this.currentHP;
        }
    }

    @Override
    public boolean canTarget(){

        if(this.ability.isActive()){
            return false;
        }
        return true;
    }

}
