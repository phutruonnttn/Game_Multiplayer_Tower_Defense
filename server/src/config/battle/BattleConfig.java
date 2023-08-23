package config.battle;

import config.DisplaySize.DisplaySizeConfig;
import model.battle.map.Point;

import java.util.HashMap;

public class BattleConfig {
    public static final int ROWS = 5;
    public static final int COLUMNS = 7;

    public static final int DELAY_FRAME_TO_CREATE_MONSTER = 10;

    public static final int FRAME_PER_SECOND = 30;

    public static final Point STARTING_POINT = new Point(0,0);
    public static final Point TARGET_POINT = new Point(ROWS-1, COLUMNS);

    public static final int FLAG_TRACE_INIT = -1;
    public static final int FLAG_TRACE_CHECKED = -2;

    public static final double SQUARE_SIZE = DisplaySizeConfig.HEIGHT * 0.83 / 14;

    public static final int TMP_TYPE = -2;
    public static final int LAND_TYPE = -1;
    public static final int HOLE_TYPE = 0;
    public static final int TREE_TYPE = 1;
    public static final int TOWER_TYPE = 2;

    public static final int NO_BUFF = -1;

    public static final int BIG_NUMBER = 9999;
    public static final int COST_TURN_DIJKSTRA = 1;
    public static final int COST_STRAIGHT_DIJKSTRA = ROWS * COLUMNS * 2;

    public static final Point TOP_NEIGHBOR = new Point(-1,0);
    public static final Point RIGHT_NEIGHBOR = new Point(0,1);
    public static final Point BOTTOM_NEIGHBOR = new Point(1,0);
    public static final Point LEFT_NEIGHBOR = new Point(0,-1);
    public static final Point[] LIST_4_DIRECTION = {
            BOTTOM_NEIGHBOR,
            RIGHT_NEIGHBOR,
            TOP_NEIGHBOR,
            LEFT_NEIGHBOR
    };

    public static final int TOP_LEFT =0;
    public static final int TOP = 1;
    public static final int TOP_RIGHT = 2;
    public static final int LEFT = 3;
    public static final int RIGHT = 5;
    public static final int BOTTOM_LEFT = 6;
    public static final int BOTTOM = 7;
    public static final int BOTTOM_RIGHT = 8;
    public static final int[][] MAP_DIRECTION_TOP_LEFT_ORIGIN = {
            {TOP_LEFT,TOP,TOP_RIGHT},
            {LEFT,-1,RIGHT},
            {BOTTOM_LEFT,BOTTOM,BOTTOM_RIGHT}
    };

    public static final int BOTTOM_NEIGHBOR_INDEX = 0;
    public static final int RIGHT_NEIGHBOR_INDEX = 1;
    public static final int TOP_NEIGHBOR_INDEX = 2;
    public static final int LEFT_NEIGHBOR_INDEX = 3;

    public static final int INIT_TIME_COUNT_DOWN = 20;
    
//    public static final int INIT_ENERGY = 1000;
//    public static final int MAX_ENERGY = 1000;
//    public static final int INIT_HP = 1;

    public static final int INIT_ENERGY = 15;
    public static final int MAX_ENERGY = 30;
    public static final int INIT_HP = 20;

    public static final int MAX_TURN = 20;

    public static final int ENERGY_HOUSE_ATTACKED = 10;
    public static final int ENERGY_HOUSE_ATTACKED_BOSS = 50;
    public static final int ENERGY_DESTROY_CARD = 5;

    // Chế độ chọn mục tiêu của trụ
    public static final int TOWER_TARGET_FURTHEST = 0;
    public static final int TOWER_TARGET_NEAREST = 1;
    public static final int TOWER_TARGET_FULL_HP = 2;
    public static final int TOWER_TARGET_LOW_HP = 3;

    // Giới hạn tiến hóa của trụ
    public final static int TOWER_EVOLUTION_MIN = 1;
    public final static int TOWER_EVOLUTION_MAX = 3;

    // Trạng thái chờ và trạng thái tấn công củ trụ
    public final static int TOWER_IDLE = 0;
    public final static int TOWER_ATTACK = 1;

    // Thời gian xây trụ được load từ Tower.json
    public static int TOWER_BUILDING_TIME;

    // TOWER TARGET
    public static HashMap<String, Integer> TOWER_TARGET_TYPE = new HashMap<String, Integer>() {{
        put("land", 0);
        put("all", 1);
    }};
    public static int TOWER_TARGET_TYPE_NONE = -1;
    public static int TOWER_TARGET_TYPE_LAND = 0;
    public static int TOWER_TARGET_TYPE_ALL = 1;

    // TOWER_ID
    public final static int TOWER_ID_OLW = 0;
    public final static int TOWER_ID_CROW = 1;
    public final static int TOWER_ID_FROG = 2;
    public final static int TOWER_ID_BUNNY = 3;
    public final static int TOWER_ID_BEAR = 4;
    public final static int TOWER_ID_GOAT = 5;
    public final static int TOWER_ID_SNAKE = 6;

    // TOWER_BUFF
    public final static String TOWER_BUFF_DAMAGE_UP_TXT = "damageUp";
    public final static String TOWER_BUFF_ATTACK_SPEED_UP_TXT = "attackSpeedUp";
    public final static String TOWER_BUFF_RANGE_UP_TXT = "rangeUp";
    public final static String TOWER_BUFF_FROZEN_TXT = "frozen";

    // Số frame delay cho trụ search mục tiêu (để giảm áp lực tính toán)
    public final static int TOWER_MAX_DELAY_FRAME = 14;

    // SPELL_ID
    public final static int SPELL_ID_FIRE = 0;
    public final static int SPELL_ID_ICE = 1;
    public final static int SPELL_ID_HEAL = 2;

    // Quai bay , quai di bo
    public final static double DELTA_DISTANCE = 0.001;


    // Ti le di vao o cell
    public final static double RATIO_DISTANCE_TO_TURN = 0.25;

    //=======================RESULT========================
    public final static int RESULT_UNKNOW = 0;
    public final static int RESULT_DRAW = -1;
    public final static int RESULT_LOSE = 0;
    public final static int RESULT_WIN = 1;
    public final static int RESULT_WINNER_PLAYER1 = 1;
    public final static int RESULT_WINNER_PLAYER2 = 2;
    public final static int FAME_CHANGE = 10;

    // ==================== SPELL ===========================
    public final static int DELAY_FRAME_FALL_ANIMATION = 6;
    // chi so tieu chuan
    public final static double STANDARD_SPEED = 50;
    public final static double STANDARD_WEIGHT = 100;

}
