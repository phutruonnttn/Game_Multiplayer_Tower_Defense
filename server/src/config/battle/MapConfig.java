package config.battle;


import model.battle.map.Point;

public class MapConfig {
    public static final int widthMap = 7;
    public static final int heightMap = 5;
    public static final Point goal = new Point(4, 6);
    public static final int numberBuff = 3;
    public static final int numberHole = 1;
    public static final int maxTree = 2;
    public static final int BUFF_SPEED = 0;
    public static final int BUFF_DAME = 1;
    public static final int BUFF_RANGE = 2;
    public static final int HOLE = 0;
    public static final int TREE = 1;
    public static final int[][] listBuff = {
            {BUFF_DAME, BUFF_SPEED, BUFF_RANGE},
            {BUFF_DAME, BUFF_RANGE, BUFF_SPEED},
            {BUFF_SPEED, BUFF_DAME, BUFF_RANGE},
            {BUFF_SPEED, BUFF_RANGE, BUFF_DAME},
            {BUFF_RANGE, BUFF_SPEED, BUFF_DAME},
            {BUFF_RANGE, BUFF_DAME, BUFF_SPEED},
    };
}
