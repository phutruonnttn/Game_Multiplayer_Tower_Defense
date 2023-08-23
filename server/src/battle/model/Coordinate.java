package battle.model;

import util.battle.BattleUtils;

public class Coordinate {

    private double x;
    private double y;

    public Coordinate(double x, double y) {
        this.setX(x);
        this.setY(y);
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public void setX(double x) {
        this.x = BattleUtils.round(x);
    }

    public void setY(double y) {
        this.y = BattleUtils.round(y);
    }
}
