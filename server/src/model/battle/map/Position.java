package model.battle.map;

import util.battle.BattleUtils;

public class Position {
    double x;
    double y;

    public Position(double x, double y) {
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
//        this.x = x;
        this.x = BattleUtils.round(x);
    }

    public void setY(double y) {
//        this.y = y;
        this.y = BattleUtils.round(y);
    }
}
