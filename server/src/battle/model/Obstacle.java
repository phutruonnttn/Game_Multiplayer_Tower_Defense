package battle.model;

import battle.model.shootable.ShootableObject;
import config.battle.BattleConfig;
import model.battle.map.Point;
import model.battle.map.Position;

public class Obstacle extends ShootableObject {
    public Point point;

    public Obstacle(int typeOfObstacle, Coordinate position, int id) {

        super(id);
        if (typeOfObstacle == BattleConfig.TREE_TYPE) {
            this.currentHP = 200;
        } else {
            this.currentHP = -1;
        }
        initPosition(position.getX(), position.getY());
    }

    public Obstacle(int typeOfObstacle, Coordinate position) {

        this(typeOfObstacle, position, -1);
    }

    public void initPosition(double x, double y) {
        this.position = new Position(x, y);
    }
}
