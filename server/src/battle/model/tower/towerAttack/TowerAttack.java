package battle.model.tower.towerAttack;

import battle.GameMgr;
import battle.model.Coordinate;
import battle.model.shootable.ShootableObject;
import battle.model.shootableMonster.Monster;
import battle.model.tower.tower.Tower;
import battle.model.tower.towerBuff.TowerBuff;
import config.battle.BattleConfig;
import model.user.card.Card;
import util.battle.BattleUtils;

import java.util.ArrayList;
import java.util.List;

public abstract class TowerAttack extends Tower {
    protected ShootableObject target;
    protected int targetMode;
    protected int state = -1;
    protected double timeWaitNewShoot;
    protected boolean readyToShoot;

    protected TowerAttack(Card card, GameMgr gameMgr) {
        super(card, gameMgr);
        this.readyToShoot = true;
        this.setTargetMode(BattleConfig.TOWER_TARGET_NEAREST);
        this.onIdle();
    }

    public ShootableObject getTarget() {
        return this.target;
    }

    public void setTarget(ShootableObject shootableObject) {
        this.target = shootableObject;
        if (this.target == null)
            this.onIdle();
        else
            this.onAttack();
    }

    public int getBulletTargetBuffType() {
        return this.stat.getBulletTargetBuffType();
    }

    public double getAttackSpeed() {
        if (this.scaleAttackSpeed <= 0)
            return 0;
        return BattleUtils.round(this.stat.getAttackSpeed(this.evolution) * this.scaleAttackSpeed);
    }

    public double getAttackAnimationTime() {
        return this.stat.getAttackAnimationTime();
    }

    public double getShootAnimationTime() {
        return this.stat.getShootAnimationTime();
    }

    public double getTotalAttackDuration() {
        return this.getAttackSpeed() + this.getAttackAnimationTime();
    }

    public double getDamage() {
        return BattleUtils.round(this.stat.getDamage(this.evolution, this.level) * this.scaleDamage);
    }

    public double getBulletSpeed() {
        return this.stat.getBulletSpeed(this.evolution);
    }

    public double getBulletBaseRadius() {
        return this.stat.getBulletRadius(this.evolution);
    }

    public double getBulletRadius() {
        return BattleUtils.round(this.stat.getBulletRadius(this.evolution) * BattleConfig.SQUARE_SIZE);
    }

    protected List<TowerBuff> getEffectingTowerBuff() {
        List<TowerBuff> listTowerBuff = new ArrayList<>();
        this.gameMgr.getListTowerInNeighborCell(this.cellPos.getX(), this.cellPos.getY(), this.getBaseRange()).forEach((Tower tower) -> {
            if (tower instanceof TowerBuff && ((TowerBuff) tower).canBuff(this))
                listTowerBuff.add((TowerBuff) tower);
        });
        return listTowerBuff;
    }

    public void setPosition(Coordinate pos) {
        super.setPosition(pos);
        this.getEffectingTowerBuff().forEach((TowerBuff towerBuff) -> {
            towerBuff.buffTower(this);
        });
    }

    public boolean hasTarget() {
        return this.target != null && this.canShoot(this.target);
    }

    public boolean canShootFly() {
        return this.targetType == BattleConfig.TOWER_TARGET_TYPE_ALL;
    }

    public boolean canShoot(ShootableObject shootableObject) {
        if (shootableObject == null)
            return false;
        if (shootableObject instanceof Monster)
            if (!this.canShootFly() && ((Monster) shootableObject).canFly())
                return false;
        return !shootableObject.isDied && shootableObject.canTarget() && this.inRange(shootableObject.getPosition());
    }

    public void setTargetMode(int targetMode) {
        if (this.targetMode != BattleConfig.TOWER_TARGET_FURTHEST
            && this.targetMode != BattleConfig.TOWER_TARGET_NEAREST
            && this.targetMode != BattleConfig.TOWER_TARGET_FULL_HP
            && this.targetMode != BattleConfig.TOWER_TARGET_LOW_HP)
            throw new IllegalStateException("Unexpected value: " + this.targetMode);
        this.targetMode = targetMode;
    }

    public void findTarget() {
        ++this.loopCounter;
        if (this.loopCounter >= BattleConfig.TOWER_MAX_DELAY_FRAME)
            this.loopCounter -= BattleConfig.TOWER_MAX_DELAY_FRAME;
        else {
            this.setTarget(null);
            return;
        }
        if (this.canShoot(this.gameMgr.priorityObstacle)) {
            this.setTarget(this.gameMgr.priorityObstacle);
            return;
        }
        switch (this.targetMode) {
            case BattleConfig.TOWER_TARGET_FURTHEST:
                this.findTargetFurthest();
                break;
            case BattleConfig.TOWER_TARGET_NEAREST:
                this.findTargetNearest();
                break;
            case BattleConfig.TOWER_TARGET_FULL_HP:
                this.findTargetFullHp();
                break;
            case BattleConfig.TOWER_TARGET_LOW_HP:
                this.findTargetLowHp();
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + this.targetMode);
        }
    }

    protected void findTargetFurthest() {
        final Monster[] target = {null};
        final double[] furthestDis = {0};
        this.gameMgr.getListMonsterInNeighborCell(this.cellPos.getX(), this.cellPos.getY(), this.getBaseRange()).forEach((Monster monster) -> {
            if (this.canShoot(monster)) {
                if (target[0] == null || furthestDis[0] > this.getDistanceSqr(monster.getPosition())) {
                    target[0] = monster;
                    furthestDis[0] = this.getDistanceSqr(monster.getPosition());
                }
            }
        });
        this.setTarget(target[0]);
    }

    protected void findTargetNearest() {
        final Monster[] target = {null};
        final double[] nearestDis = {0};
        this.gameMgr.getListMonsterInNeighborCell(this.cellPos.getX(), this.cellPos.getY(), this.getBaseRange()).forEach((Monster monster) -> {
            if (this.canShoot(monster)) {
                if (target[0] == null || nearestDis[0] > this.getDistanceSqr(monster.getPosition())) {
                    target[0] = monster;
                    nearestDis[0] = this.getDistanceSqr(monster.getPosition());
                }
            }
        });
        this.setTarget(target[0]);
    }

    protected void findTargetFullHp() {
        final Monster[] target = {null};
        final double[] highestHp = {0};
        this.gameMgr.getListMonsterInNeighborCell(this.cellPos.getX(), this.cellPos.getY(), this.getBaseRange()).forEach((Monster monster) -> {
            if (this.canShoot(monster)) {
                if (target[0] == null || highestHp[0] < monster.currentHP) {
                    target[0] = monster;
                    highestHp[0] = monster.currentHP;
                }
            }
        });
        this.setTarget(target[0]);
    }

    protected void findTargetLowHp() {
        final Monster[] target = {null};
        final double[] lowestHp = {0};
        this.gameMgr.getListMonsterInNeighborCell(this.cellPos.getX(), this.cellPos.getY(), this.getBaseRange()).forEach((Monster monster) -> {
            if (this.canShoot(monster)) {
                if (target[0] == null || lowestHp[0] > monster.currentHP) {
                    target[0] = monster;
                    lowestHp[0] = monster.currentHP;
                }
            }
        });
        this.setTarget(target[0]);
    }

    protected void onIdle() {
        if (this.state == BattleConfig.TOWER_IDLE)
            return;
        this.state = BattleConfig.TOWER_IDLE;
    }

    protected void onAttack() {
        if (this.state == BattleConfig.TOWER_ATTACK)
            return;
        this.state = BattleConfig.TOWER_ATTACK;
        if (this.readyToShoot)
            this.timeWaitNewShoot = 0;
    }

    protected abstract Bullet createBullet();

    private boolean isShooting() {
        if (this.state != BattleConfig.TOWER_ATTACK)
            return false;
        return this.timeWaitNewShoot <= this.getAttackAnimationTime();
    }

    protected void shoot() {
        this.readyToShoot = false;
        Bullet bullet = this.createBullet();
        bullet.setPosition(new Coordinate(this.x, this.y));
        // gửi logic vào gameMgr để được gọi update
        this.gameMgr.listBullet.add(bullet);
    }

    @Override
    public void goingEvolution() {
        super.goingEvolution();
        if (this.isShooting())
            this.onIdle();
    }

    @Override
    public void setFrozen(double duration) {
        super.setFrozen(duration);
        if (this.isShooting())
            this.onIdle();
    }

    public void update(double dt) {
        super.update(dt);
        if (this.isImmobile())
            return;
        if (this.readyToShoot) {
            if (this.state == BattleConfig.TOWER_IDLE) {
                this.findTarget();
                if (this.hasTarget())
                    this.onAttack();
            }
            if (this.state == BattleConfig.TOWER_ATTACK) {
                if (this.timeWaitNewShoot <= this.getShootAnimationTime() && this.timeWaitNewShoot + dt > this.getShootAnimationTime()) {
                    this.shoot();
                }
                else {
                    this.timeWaitNewShoot += dt;
                }
            }
        }
        if (!this.readyToShoot) {
            this.timeWaitNewShoot += dt;
            if (this.timeWaitNewShoot >= this.getTotalAttackDuration()) {
                this.readyToShoot = true;
                this.timeWaitNewShoot -= this.getTotalAttackDuration();
                if (!this.hasTarget()) {
                    this.findTarget();
                    if (!this.hasTarget()) {
                        this.onIdle();
                    }
                }
            }
        }
    }

}
