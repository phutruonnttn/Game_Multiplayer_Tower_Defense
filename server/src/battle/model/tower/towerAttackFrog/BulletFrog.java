package battle.model.tower.towerAttackFrog;

import battle.model.Coordinate;
import battle.model.shootable.ShootableObject;
import battle.model.shootableMonster.Monster;
import battle.model.tower.towerAttack.BulletStraight;
import battle.model.tower.towerAttack.TowerAttack;
import util.battle.BattleUtils;

import java.util.HashSet;
import java.util.Set;

public class BulletFrog extends BulletStraight {

    private final double range;
    private final Coordinate startPos;
    private boolean turnOver;
    private final Set<Integer> hitMonsted;

    protected BulletFrog(TowerAttack towerAttack) {
        super(towerAttack);
        this.range = towerAttack.getRange() - this.radius;
        this.startPos = towerAttack.getPosition();
        this.target = this.calEndPosition(towerAttack.getTarget().getPosition());
        this.turnOver = false;
        this.hitMonsted = new HashSet<>();
    }

    private Coordinate calEndPosition(Coordinate targetPos) {
        Coordinate vector = BattleUtils.getInstance().getVector(this.startPos, targetPos);
        double lengthVector = BattleUtils.getInstance().getVectorLength(vector) + 0.001;
        double dx = BattleUtils.round(vector.getX() * this.range / lengthVector);
        double dy = BattleUtils.round(vector.getY() * this.range / lengthVector);
        return new Coordinate(
            this.startPos.getX() + dx,
            this.startPos.getY() + dy
        );
    }

    protected void reachTarget() {
        if (this.finished && !this.turnOver) {
            this.target = this.startPos;
            this.turnOver = true;
            this.hitMonsted.clear();
            this.finished = false;
            if (this.skillEnable)
                this.damage *= 1.5;
        }
    }

    public void update(double dt) {
        super.update(dt);
        this.getHitObjects().forEach((ShootableObject shootableObject) -> {
            if (!this.hitMonsted.contains(shootableObject.getId())) {
                shootableObject.decreaseHP(this.damage);
                this.hitMonsted.add(shootableObject.getId());
            }
        });
    }

}
