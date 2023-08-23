package config.user;

public class CardConfig {
    public final static int levelCardMax = 10;

    public final static int numberCardUsing = 8;

    public final static int numberCard = 18;

    public final static int[] initCard = {1, 0}; //{level, amount}

    public final static int[] systemCard = {
            0, //card_monster_assassin
            1, //card_monster_bat
            2, //card_monster_giant
            3, //card_monster_ninja
            4, //card_monster_swordsman
            5, //card_potion_fireball
            6, //card_potion_frozen
            7, //card_potion_heal
            8, //card_potion_power
            9, //card_potion_speed_up
            10, //card_potion_trap
            11, //card_tower_attack_speed
            12, //card_tower_boomerang
            13, //card_tower_cannon
            14, //card_tower_damage
            15, //card_tower_ice_gun
            16, //card_tower_oil_gun
            17, //card_tower_wizard
    };

    public  final static int[] listIdInit = {
            0, //card_monster_assassin
            1, //card_monster_bat
            2, //card_monster_giant
            3, //card_monster_ninja
            4, //card_monster_swordsman
            5, //card_potion_fireball
            6, //card_potion_frozen
            7, //card_potion_heal
            8, //card_potion_power
            9, //card_potion_speed_up
            10, //card_potion_trap
            11, //card_tower_attack_speed
            12, //card_tower_boomerang
            13, //card_tower_cannon
            14, //card_tower_damage
            15, //card_tower_ice_gun
            16, //card_tower_oil_gun
            17, //card_tower_wizard
    };

    public final static int[] initListCardUsingId = {
            0, //card_monster_assassin
            1, //card_monster_bat
            3, //card_monster_ninja
            6, //card_potion_frozen
            8, //card_potion_power
            14, //card_tower_damage
            16, //card_tower_oil_gun
            17, //card_tower_wizard
    };

    public final static int[][] costUpgrade = {
            //number of piece, gold
            {0, 0},//lv0
            {0, 0},//lv1
            {5, 5},//lv2
            {10, 10},//lv3
            {20, 20},
            {50, 50},
            {100, 100},
            {200, 200},
            {300, 300},
            {400, 400},
            {500, 500}//lv10
    };

    public final static int[] RANK = {
            // card rank per level
            1, // lv0
            1, // lv1
            2, // lv2
            2, // lv3
            3, // lv4
            3, // lv5
            3, // lv6
            4, // lv7
            4, // lv8
            4, // lv9
            4, // lv10
    };

    public final static int MONSTER_TYPE = 0;
    public final static int POTION_TYPE = 1;
    public final static int TOWER_TYPE = 2;

    public final static int KEY_CARD_TYPE = 0;
    public final static int KEY_CARD_ID = 1;

    public final static int[][] GLOBAL_ID = {
            // card id 0->4
            {MONSTER_TYPE, 0},
            {MONSTER_TYPE, 1},
            {MONSTER_TYPE, 2},
            {MONSTER_TYPE, 3},
            {MONSTER_TYPE, 4},

            // card id 5->10
            {POTION_TYPE, 0},
            {POTION_TYPE, 1},
            {POTION_TYPE, 2},
            {POTION_TYPE, 3},
            {POTION_TYPE, 4},
            {POTION_TYPE, 5},

            // card id 11->17
            {TOWER_TYPE, 0},
            {TOWER_TYPE, 1},
            {TOWER_TYPE, 2},
            {TOWER_TYPE, 3},
            {TOWER_TYPE, 4},
            {TOWER_TYPE, 5},
            {TOWER_TYPE, 6},
    };

    public static final int UNLOCK_TOWER_SKILL_LEVEL = 7;

}
