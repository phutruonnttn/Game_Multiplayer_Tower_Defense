package battle.model.shootableMonster.Satyr;

import battle.model.shootableMonster.Ability;
import battle.model.shootableMonster.Monster;
import battle.model.shootableMonster.config.SatyrConfig;
import config.battle.BattleConfig;
import util.battle.BattleUtils;

import java.util.ArrayList;

public class SatyrAbility extends Ability {

    double getMonstersRadius;
    int timer;
    int delay;
    double healHpByHpPercentage;

    public SatyrAbility(Monster owner) {

        super(owner);
        this.getMonstersRadius = SatyrConfig.GET_MONSTERS_RADIUS;
        this.timer = 0;
        this.healHpByHpPercentage = SatyrConfig.HEAL_HP_BY_PERCENTAGE;
        this.delay = SatyrConfig.COOLDOWN_TIME;
    }

    @Override
    public boolean canActive(){

        if(this.timer == 0){
            this.timer = delay;
            return true;
        }
        this.timer--;
        return false;
    }

    @Override
    public void active(){

        ArrayList<Monster> listMonster = this.owner.gameMgr.getListMonsterInNeighborCell(
                this.owner.curPoint.getX(),
                this.owner.curPoint.getY(),
                (int)Math.ceil(this.getMonstersRadius)
        );
        for(Monster monster : listMonster){
            if(monster != this.owner && monster.canTarget() && this.inRange(monster)){
                monster.buffHpUp(1, 1, monster.getBaseHp()*this.healHpByHpPercentage);
            }
        }
    }

    private boolean inRange(Monster monster){

        double dx = this.owner.getPosition().getX() - monster.getPosition().getX();
        double dy = this.owner.getPosition().getY() - monster.getPosition().getY();
        double radius = BattleUtils.round(this.getMonstersRadius * BattleConfig.SQUARE_SIZE);
        if(
            BattleUtils.round(dx * dx)
            + BattleUtils.round(dy * dy)
            <= BattleUtils.round(radius * radius)
        ){
            return true;
        }
        return false;
    }
}
