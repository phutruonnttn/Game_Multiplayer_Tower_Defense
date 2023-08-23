package battle.model.shootable;

import battle.model.Coordinate;
import model.battle.map.Position;
import util.battle.BattleUtils;

public class ShootableObject {

    public int id;
    public double baseHp;
    public double currentHP;
    public boolean isDied = false;
    public double hitRadius;
    public Position position = new Position(0, 0);

    protected ShootableObject(int id) {
        this.id = id;
    }

    public int getId(){

        return this.id;
    }

    public void decreaseHP(double amount){

        setCurrentHP(Math.max(0, this.currentHP - amount));
        if (this.currentHP == 0) {
            this.isDied = true;
        }
    }

    public void decreaseHpByBullet(double amount){

        this.decreaseHP(amount);
    }

    public void increaseHP(double amount){

        setCurrentHP(Math.min(this.baseHp, this.currentHP + amount));
    }

    public void setCurrentHP(double currentHP) {

        this.currentHP = BattleUtils.round(currentHP);
    }

    public Coordinate getPosition() {
        return new Coordinate(this.position.getX(), this.position.getY());
    }

    public boolean canTarget() {
        return true;
    }

}
