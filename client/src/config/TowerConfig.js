

var TOWER = TOWER || {};

TOWER.STATE_ATTACK = 0;
TOWER.STATE_IDLE = 1;
TOWER.STATE_FROZEN = 2;
TOWER.FRAME_ATTACK = "attack";
TOWER.FRAME_IDLE = "idle";

TOWER.EVOLUTION_MIN = 1;
TOWER.EVOLUTION_MAX = 3;

TOWER.N_ATTACK_DIRECTION = 16;

TOWER.TARGET_TYPE = {
    "land": 0,
    "all": 1,
}
TOWER.TARGET_TYPE_NONE = -1;
TOWER.TARGET_TYPE_LAND = 0;
TOWER.TARGET_TYPE_ALL = 1;

TOWER.TARGET_MODE = {
    FURTHEST: 0,
    NEAREST: 1,
    FULL_HP: 2,
    LOW_HP: 3,
};

TOWER.ID = {
    OLW: 0,
    CROW: 1,
    FROG: 2,
    BUNNY: 3,
    BEAR: 4,
    GOAT: 5,
    SNAKE: 6,
};

// TOWER BUFF
TOWER.BUFF_DAMAGE_UP_TXT = "damageUp";
TOWER.BUFF_ATTACK_SPEED_UP_TXT = "attackSpeedUp";
TOWER.BUFF_RANGE_UP_TXT = "rangeUp";
TOWER.BUFF_FROZEN_TXT = "frozen";

// Số frame delay cho trụ search mục tiêu (để giảm áp lực tính toán)
TOWER.MAX_DELAY_FRAME = 14;

TOWER.SECOND_PER_FRAME = 0.066;
TOWER.FRAME = {};
TOWER.FRAME[TOWER.ID.OLW] = {
    NAME: "tower_cannon",
    FRAME_PER_STATE: {
        attack: 9,
        idle: 15,
    },
    BULLET: 1,
};
TOWER.FRAME[TOWER.ID.CROW] = {
    NAME: "tower_wizard",
    FRAME_PER_STATE: {
        attack: 9,
        idle: 15,
    },
    BULLET: 1,
};
TOWER.FRAME[TOWER.ID.FROG] = {
    NAME: "tower_boomerang",
    FRAME_PER_STATE: {
        attack: 11,
        idle: 14,
    },
    BULLET: 9,
    FRAME_BULLET_PER_EVOLUTION: true,
};
TOWER.FRAME[TOWER.ID.BUNNY] = {
    NAME: "tower_oil_gun",
    FRAME_PER_STATE: {
        attack: 11,
        idle: 14,
    },
    BULLET: 7,
};
TOWER.FRAME[TOWER.ID.BEAR] = {
    NAME: "tower_ice_gun",
    FRAME_PER_STATE: {
        attack: 10,
        idle: 14,
    },
    BULLET: 1,
};
TOWER.FRAME[TOWER.ID.SNAKE] = {
    NAME: "tower_attack_speed",
    FRAME_PER_STATE: {
        attack: 16,
        idle: 16,
    }
};
TOWER.FRAME[TOWER.ID.GOAT] = {
    NAME: "tower_damage",
    FRAME_PER_STATE: {
        attack: 16,
        idle: 16,
    }
};