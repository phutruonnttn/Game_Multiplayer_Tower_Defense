package dsa;

import model.battle.map.Point;

public class PointOfPriorityQueue {
    public int value;
    public Point currentCoordinate;

    public PointOfPriorityQueue(int value, Point currentCoordinate){
        this.value = value;
        this.currentCoordinate = currentCoordinate;
    }
}
