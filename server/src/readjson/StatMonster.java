package readjson;

import battle.model.shootableMonster.config.MoveType;

public class StatMonster extends StatCard {
    private String category;
    private double hp;
    private double speed;
    private double hitRadius;
    private double weight;
    private int ability;
    private int gainEnergy;
    private int numberMonsters;
    private String moveType;

    public String getCategory() {
        return category;
    }

    public double getHp() {
        return hp;
    }

    public double getSpeed() {
        return speed;
    }

    public double getHitRadius() {
        return hitRadius;
    }

    public double getWeight() {
        return weight;
    }

    public int getAbility() {
        return ability;
    }

    public int getGainEnergy() {
        return gainEnergy;
    }

    public int getNumberMonsters() {
        return numberMonsters;
    }

    public MoveType getMoveType() {

        if(this.moveType.equals("aerial")){
            return MoveType.FLY;
        }
        return MoveType.WALK;
    }
}
