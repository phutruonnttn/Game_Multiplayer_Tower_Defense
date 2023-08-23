package battle.model.shootableMonster.ninja;

import battle.model.shootableMonster.Ability;
import battle.model.shootableMonster.Monster;
import battle.model.shootableMonster.config.NinjaConfig;
import config.battle.BattleConfig;
import model.battle.map.Position;


public class NinjaAbility extends Ability {

    boolean status = false;
    //danh dau toa do bat dau kich hoat ki nang
    Position positionActive;

    public NinjaAbility(Monster owner) {

        super(owner);
    }

    public boolean canActive(double maxCurHp, double curHp){

        if(curHp <= maxCurHp - this.owner.getBaseHp() * NinjaConfig.RATIO_LOST_HP && !this.owner.isFrozen() && !this.owner.isStunned() && !(this.owner.speedThrown > 0)){
            return true;
        }
        return false;
    }

    @Override
    public void active(){

        this.positionActive = new Position(this.owner.position.getX(), this.owner.position.getY());
        this.status = true;
    }

    @Override
    public boolean isActive(){

        if(this.status){
            double dx = Math.abs(this.positionActive.getX() - this.owner.position.getX());
            double dy = Math.abs(this.positionActive.getY() - this.owner.position.getY());
            if( dx + dy < 3 * BattleConfig.SQUARE_SIZE){
                return true;
            }
        }
        this.status = false;
        return false;
    }

}
