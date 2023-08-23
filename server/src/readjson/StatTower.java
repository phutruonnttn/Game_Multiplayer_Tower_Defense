package readjson;

import config.battle.BattleConfig;

import java.io.Serializable;
import java.util.HashMap;

public class StatTower extends StatCard {
    private String archetype;
    private String targetType;
    private int auraTowerBuffType;
    private String bulletType;
    private int bulletTargetBuffType;
    private int attackAnimationTime;
    private int shootAnimationTime;
    private HashMap<Integer, StatEvolution> stat;

    public int getTargetType() {
        if (BattleConfig.TOWER_TARGET_TYPE.containsKey(this.targetType))
            return BattleConfig.TOWER_TARGET_TYPE.get(this.targetType);
        return BattleConfig.TOWER_TARGET_TYPE_NONE;
    }

    public int getAuraTowerBuffType() {
        return this.auraTowerBuffType;
    }

    public int getBulletTargetBuffType() {
        return this.bulletTargetBuffType;
    }

    public double getAttackAnimationTime() {
        return this.attackAnimationTime / 1000.0;
    }

    public double getShootAnimationTime() {
        return this.shootAnimationTime / 1000.0;
    }

    public double getDamage(int evolution, int level) {
        return this.stat.get(evolution).damage * (1 + 0.1 * level);
    }

    public double getRange(int evolution) {
        return this.stat.get(evolution).range;
    }

    public double getBulletRadius(int evolution) {
        return this.stat.get(evolution).bulletRadius;
    }

    public double getAttackSpeed(int evolution) {
        return this.stat.get(evolution).attackSpeed / 1000.0;
    }

    public double getBulletSpeed(int evolution) {
        return this.stat.get(evolution).bulletSpeed / 10;
    }
}

class StatEvolution implements Serializable {
    double damage;
    double range;
    double bulletRadius;
    double attackSpeed;
    double bulletSpeed;
}