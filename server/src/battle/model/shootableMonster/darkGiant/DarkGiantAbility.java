package battle.model.shootableMonster.darkGiant;

import battle.model.shootableMonster.Ability;
import battle.model.shootableMonster.Monster;
import battle.model.tower.tower.Tower;
import battle.model.tower.towerAttack.TowerAttack;

import java.util.ArrayList;


public class DarkGiantAbility extends Ability {

    public DarkGiantAbility(Monster owner) {

        super(owner);
    }

    @Override
    public boolean canActive() {

        return true;
    }

    @Override
    public void active(){

        ArrayList<Tower> listTower = this.owner.gameMgr.getListTower();
        for(Tower tower : listTower){
            if(tower instanceof TowerAttack && !(((TowerAttack) tower).getTarget() instanceof DarkGiant) && ((TowerAttack) tower).canShoot(this.owner)){
                ((TowerAttack) tower).setTarget(this.owner);
            }
        }
    }

}
