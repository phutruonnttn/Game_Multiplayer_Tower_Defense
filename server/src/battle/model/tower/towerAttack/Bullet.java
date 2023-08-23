package battle.model.tower.towerAttack;

import battle.GameMgr;
import battle.model.Coordinate;
import config.battle.BattleConfig;
import readjson.JsonConfig;
import util.battle.BattleUtils;

public abstract class Bullet {

    public GameMgr gameMgr;
    public boolean finished;
    public double damage;
    public double speed;
    protected double baseRadius;
    protected double radius;
    protected double effectDuration;
    protected boolean skillEnable;
    public double x;
    public double y;

    protected Bullet(TowerAttack tower) {
        this.gameMgr = tower.gameMgr;
        this.finished = false;
        this.damage = tower.getDamage();
        this.speed = tower.getBulletSpeed();
        this.baseRadius = tower.getBulletBaseRadius();
        this.radius = tower.getBulletRadius();
        this.skillEnable = tower.canUseSkill();
    }

    public double getEffectDuration(int targetBuffType, int evolution, int level) {
        try {
            return JsonConfig.getInstance().getBuffTarget(targetBuffType).getDuration(evolution, level);
        } catch (Exception e) {
            return 0;
        }
    }

    public void setPosition(Coordinate pos) {
        this.x = pos.getX();
        this.y = pos.getY();
    }

    protected Coordinate getPosition() {
        return new Coordinate(this.x, this.y);
    }

    protected abstract Coordinate getToPos();

    protected abstract void reachTarget();

    public void update(double dt) {
        if (this.finished)
            return;

        Coordinate toPos = this.getToPos();

        // Đây là cách tính không chính xác về độ dài đi được, chỉ đúng về tỉ lệ. Sẽ đúng khi dt vô cùng bé
        // Ưu điểm: loại bỏ được phép căn
        Coordinate vector = BattleUtils.getInstance().getVector(this.getPosition(), toPos);
        double moveLength = BattleUtils.round(BattleUtils.round(dt * this.speed) * BattleConfig.SQUARE_SIZE);
        if (BattleUtils.getInstance().getVectorLengthSqr(vector) <= BattleUtils.round(moveLength*moveLength)) {
            this.finished = true;
            this.reachTarget();
        }
        else {
            double dx = BattleUtils.round(BattleUtils.round(moveLength * vector.getX()) / (Math.abs(vector.getX()) + Math.abs(vector.getY())));
            double dy = BattleUtils.round(BattleUtils.round(moveLength * vector.getY()) / (Math.abs(vector.getX()) + Math.abs(vector.getY())));
            this.x += dx;
            this.y += dy;
        }
    }
}
