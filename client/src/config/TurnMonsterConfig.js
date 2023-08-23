var TURN_MONSTER = TURN_MONSTER || {}

// 0 - quai bay, 1 - quay bo, 2 - boss, 3 - SWORDSMAN
TURN_MONSTER.TYPE = [
    [
        3 // BAT
    ],
    [
        0, // SWORDSMAN
        1, // ASSASSIN
        2, // GIANT
        4 // NINJA
    ],
    [
        5, // DARK_GIANT
        6 // SATYR
    ],
    [
        0 // SWORDSMAN
    ]
]

TURN_MONSTER.BOSS_TYPE = 2

TURN_MONSTER.AMOUNT_OF_TYPE = [
    3, // SWORDSMAN
    3, // ASSASSIN
    1, // GIANT
    3, // BAT
    3, // NINJA
    1, // DARK_GIANT
    1 // SATYR
]

TURN_MONSTER.RATIO = [
    {"amount": 1, "hp": 1},// Tong cap tru = 0
    {"amount": 1, "hp": 1},// 1
    {"amount": 1, "hp": 1},// 2
    {"amount": 1, "hp": 1},// 3
    {"amount": 1, "hp": 1},// 4

    {"amount": 2, "hp": 5},// 5
    {"amount": 2, "hp": 5},// 6
    {"amount": 2, "hp": 5},// 7
    {"amount": 2, "hp": 5},// 8
    {"amount": 2, "hp": 5},// 9

    {"amount": 3, "hp": 10},// 10
    {"amount": 3, "hp": 10},// 11
    {"amount": 3, "hp": 10},// 12
    {"amount": 3, "hp": 10},// 13
    {"amount": 3, "hp": 10},// 14

    {"amount": 4, "hp": 10},// 15
    {"amount": 4, "hp": 10},// 16
    {"amount": 4, "hp": 10},// 17
    {"amount": 4, "hp": 10},// 18
    {"amount": 4, "hp": 10},// 19

    {"amount": 5, "hp": 20},// 20
    {"amount": 5, "hp": 20},// 21
    {"amount": 5, "hp": 20},// 22
    {"amount": 5, "hp": 20},// 23
    {"amount": 5, "hp": 20},// 24

    {"amount": 6, "hp": 20},// 25
    {"amount": 6, "hp": 20},// 26
    {"amount": 6, "hp": 20},// 27
    {"amount": 6, "hp": 20},// 28
    {"amount": 6, "hp": 20},// 29

    {"amount": 7, "hp": 30},// 30
]

TURN_MONSTER.TURN = [
    ,
    // turn 1
    [
        {"type": 3, "ratio": 1},
    ],

    // turn 2
    [
        {"type": 1, "ratio": 1}
    ],

    // turn 3
    [
        {"type": 1, "ratio": 1}
    ],

    // turn 4
    [
        {"type": 1, "ratio": 0.2},
        {"type": 1, "ratio": 0.8}
    ],

    // turn 5
    [
        {"type": 2, "ratio": 1}
    ],

    // turn 6
    [
        {"type": 1, "ratio": 0.5},
        {"type": 1, "ratio": 0.5}
    ],

    // turn 7
    [
        {"type": 0, "ratio": 1}
    ],

    // turn 8
    [
        {"type": 0, "ratio": 0.5},
        {"type": 1, "ratio": 0.75}
    ],

    // turn 9
    [
        {"type": 0, "ratio": 0.8},
        {"type": 1, "ratio": 0.4}
    ],

    // turn 10
    [
        {"type": 2, "ratio": 1}
    ],

    // turn 11
    [
        {"type": 1, "ratio": 0.5},
        {"type": 1, "ratio": 0.5},
        {"type": 1, "ratio": 0.5}
    ],

    // turn 12
    [
        {"type": 1, "ratio": 0.75},
        {"type": 1, "ratio": 0.5},
        {"type": 1, "ratio": 0.5}
    ],

    // turn 13
    [
        {"type": 1, "ratio": 0.75},
        {"type": 1, "ratio": 0.5},
        {"type": 0, "ratio": 0.2}
    ],

    // turn 14
    [
        {"type": 1, "ratio": 0.75},
        {"type": 1, "ratio": 0.5},
        {"type": 0, "ratio": 0.5}
    ],

    // turn 15
    [
        {"type": 2, "ratio": 1},
        {"type": 1, "ratio": 1}
    ],

    // turn 16
    [
        {"type": 1, "ratio": 1},
        {"type": 1, "ratio": 1}
    ],

    // turn 17
    [
        {"type": 1, "ratio": 1},
        {"type": 0, "ratio": 1}
    ],

    // turn 18
    [
        {"type": 1, "ratio": 1},
        {"type": 1, "ratio": 1},
        {"type": 1, "ratio": 0.5}
    ],

    // turn 19
    [
        {"type": 1, "ratio": 1},
        {"type": 1, "ratio": 1},
        {"type": 0, "ratio": 1}
    ],

    // turn 20
    [
        {"type": 2, "ratio": 1},
        {"type": 1, "ratio": 1},
        {"type": 0, "ratio": 1}
    ],
]