package battle.model.tower.towerAttack;

import battle.model.Coordinate;
import battle.model.Obstacle;
import battle.model.shootable.ShootableObject;
import battle.model.shootableMonster.Monster;
import config.battle.BattleConfig;
import model.battle.map.Point;
import util.battle.BattleUtils;

import java.util.ArrayList;

public class BulletStraight extends Bullet {

    protected Coordinate target;
    protected boolean canEffectFly;

    protected BulletStraight(TowerAttack towerAttack) {
        super(towerAttack);
        this.target = towerAttack.getTarget().getPosition();
        this.canEffectFly = towerAttack.canShootFly();
    }

    protected Coordinate getToPos() {
        return this.target;
    }

    // Trả về list monster trúng đạn
    protected ArrayList<Monster> getHitMonsters() {
        ArrayList<Monster> listMonstersAffected = new ArrayList<>();
        Point cellPos = this.gameMgr.getCellPositionGameGUI(this.getPosition());
        this.gameMgr.getListMonsterInNeighborCell(cellPos.getX(), cellPos.getY(), this.baseRadius).forEach((Monster monster) -> {
            if (!this.canEffectFly && monster.canFly())
                return;
            if (BattleUtils.getInstance().inCircle(this.getPosition(), this.radius + monster.hitRadius, monster.getPosition()))
                listMonstersAffected.add(monster);
        });
        return listMonstersAffected;
    }

    // Trả về list obstacle trúng đạn
    protected ArrayList<Obstacle> getHitObstacles() {
        ArrayList<Obstacle> listObstacleAffected = new ArrayList<>();
        this.gameMgr.listTreeObstacle.forEach((Obstacle treeObstacle) -> {
            if (BattleUtils.getInstance().inCircle(this.getPosition(), this.radius + BattleConfig.SQUARE_SIZE / 2, treeObstacle.getPosition()))
                listObstacleAffected.add(treeObstacle);
        });
        return listObstacleAffected;
    }

    // Trả về mọi object trúng đạn
    protected ArrayList<ShootableObject> getHitObjects() {
        ArrayList<ShootableObject> listObjectAffected = new ArrayList<>();
        listObjectAffected.addAll(this.getHitMonsters());
        listObjectAffected.addAll(this.getHitObstacles());
        return listObjectAffected;
    }

    protected void reachTarget() {
        if (this.damage <= 0)
            return;
        this.getHitObjects().forEach((ShootableObject shootableObject) -> {
            shootableObject.decreaseHP(this.damage);
        });
    }

}
