

var CARD = CARD || {};

CARD.UPGRADE = {
    1: {FRAGMENTS: 5,GOLD: 5},
    2: {FRAGMENTS: 10,GOLD: 10},
    3: {FRAGMENTS: 20,GOLD: 20},
    4: {FRAGMENTS: 50,GOLD: 50},
    5: {FRAGMENTS: 100,GOLD: 100},
    6: {FRAGMENTS: 200,GOLD: 200},
    7: {FRAGMENTS: 300,GOLD: 300},
    8: {FRAGMENTS: 400,GOLD: 400},
    9: {FRAGMENTS: 500,GOLD: 500},
};

CARD.RANK = {
    1: 1,
    2: 2,
    3: 2,
    4: 3,
    5: 3,
    6: 3,
    7: 4,
    8: 4,
    9: 4,
    10: 4,
};

CARD.RANK_REQUIRE_PREFIX = "Yêu cầu hạng ";
CARD.RANK_TEXT = {
    1: "C",
    2: "B",
    3: "A",
    4: "S",
};

CARD.UNLOCK_TOWER_SKILL_LEVEL = 7;

CARD.GLOBAL_ID = {
    // Monster
    0: {TYPE: 0,ID: 0, NAME: "Kiếm Ma"},
    1: {TYPE: 0,ID: 1, NAME: "Quạ Xương"},
    2: {TYPE: 0,ID: 2, NAME: "Khổng Lồ"},
    3: {TYPE: 0,ID: 3, NAME: "Dơi Quỷ"},
    4: {TYPE: 0,ID: 4, NAME: "Xương Độn Thổ"},

    // Spell
    5: {TYPE: 1,ID: 0, NAME: "Cầu lửa"},
    6: {TYPE: 1,ID: 1, NAME: "Đóng Băng"},
    7: {TYPE: 1,ID: 2, NAME: "Hồi Máu"},
    8: {TYPE: 1,ID: 3, NAME: "Tăng Tốc"},
    9: {TYPE: 1,ID: 4, NAME: "Lò Xo"},
    10: {TYPE: 1,ID: 5, NAME: "Sức Mạnh"},

    // Tower
    11: {TYPE: 2,ID: 0, NAME: "Pháo Cú"},
    12: {TYPE: 2,ID: 1, NAME: "Quạ Pháp Sư"},
    13: {TYPE: 2,ID: 2, NAME: "Ếch Đồ Tể"},
    14: {TYPE: 2,ID: 3, NAME: "Thỏ Xả Nhớt"},
    15: {TYPE: 2,ID: 4, NAME: "Gấu Bắc Cực"},
    16: {TYPE: 2,ID: 5, NAME: "Dê Phát Động"},
    17: {TYPE: 2,ID: 6, NAME: "Rắn Tốc Độ"},
}

CARD.MONSTER_TYPE = 0
CARD.POTION_TYPE = 1
CARD.TOWER_TYPE = 2

CARD.DESCRIPTION = {
    // Monster
    0: "Máu Thường, tốc độ thường",
    1: "Máu Thấp, chạy rất nhanh",
    2: "Máu Cao, đi chậm",
    3: "Máu Thường, Tốc độ thường",
    4: "Máu Thường, tốc độ thường",

    // Potion
    5: "Thả Cầu lửa gây sát thương cho quái đồng thời sẽ đẩy quái ra xung quanh từ tâm nổ\n",
    6: "Đóng băng quái tấn công hoặc Tháp đối thủ trong vùng phép \n",
    7: "Hồi Máu quái khi đi vào vùng phép\n",
    8: "Tăng tốc quái khi đi vào vùng phép\n",
    9: "Bật tung quái khi đi vào bẫy, ô đích là cổng ra quái\n",
    10: "Tăng sức mạnh trụ trong vùng phép\n",

    // Tower
    11: "Bắn đơn 1 muc tiêu, đạn sẽ bay theo mục tiêu, tốc độ đạn nhanh",
    12: "Bắn cầu lửa vào vị trí xác định mục tiêu, gây sát thương lan, tốc độ đạn chậm",
    13: "Bắn dao phay vào vị trí xác định của mục tiêu, dao phay sẽ bay 1 đoạn gây sát thương trên đường bay rồi bay ngược trở lại gây tiếp sát thương",
    14: "Bắn đạn nhớt của sên vài vị trí xác định, nhớt sẽ bung ra làm chậm quái trong vùng ảnh hưởng",
    15: "Bắn đạn băng vào 1 mục tiêu, mục tiêu trúng sẽ bị đóng băng trong 1 khoảng thời gian",
    16: "Tăng Sát thương cho các Tháp nằm trong vùng Tháp",
    17: "Tăng Tốc bắn cho các Tháp nằm trong vùng Tháp",
};

CARD.UI_STAT = {
    // Monster
    0: {
        hp: res.card.stat.hp,
        speed: res.card.stat.speed,
        numberMonsters: res.card.stat.number_monsters,
    },
    1: {
        hp: res.card.stat.hp,
        speed: res.card.stat.speed,
        numberMonsters: res.card.stat.number_monsters,
    },
    2: {
        hp: res.card.stat.hp,
        speed: res.card.stat.speed,
        numberMonsters: res.card.stat.number_monsters,
    },
    3: {
        hp: res.card.stat.hp,
        speed: res.card.stat.speed,
        numberMonsters: res.card.stat.number_monsters,
    },
    4: {
        hp: res.card.stat.hp,
        speed: res.card.stat.speed,
        numberMonsters: res.card.stat.number_monsters,
    },

    // Potion
    5: {
        damage: res.card.stat.damage,
        radius: res.card.stat.potion_range,
    },
    6: {
        duration: res.card.stat.time,
        radius: res.card.stat.potion_range,
    },
    7: {
        healthUp: res.card.stat.health_up,
        radius: res.card.stat.potion_range,
        duration: res.card.stat.time,
    },
    8: {
        duration: res.card.stat.time,
        radius: res.card.stat.potion_range,
    },
    9: {
        radius: res.card.stat.potion_range,
    },
    10: {
        damageUp: res.card.stat.damage_up,
        duration: res.card.stat.time,
    },

    // Tower
    11: {
        damage: res.card.stat.damage,
        attackSpeed: res.card.stat.attack_speed,
        range: res.card.stat.range,
        targetType: res.card.stat.evasion,
    },
    12: {
        damage: res.card.stat.damage,
        attackSpeed: res.card.stat.attack_speed,
        range: res.card.stat.range,
        targetType: res.card.stat.evasion,
    },
    13: {
        damage: res.card.stat.damage,
        attackSpeed: res.card.stat.attack_speed,
        range: res.card.stat.range,
        targetType: res.card.stat.evasion,
    },
    14: {
        duration: res.card.stat.time,
        attackSpeed: res.card.stat.attack_speed,
        range: res.card.stat.range,
        targetType: res.card.stat.evasion,
    },
    15: {
        duration: res.card.stat.time,
        attackSpeed: res.card.stat.attack_speed,
        range: res.card.stat.range,
        targetType: res.card.stat.evasion,
    },
    16: {
        damageUp: res.card.stat.damage_up,
    },
    17: {
        attackSpeedUp: res.card.stat.attack_speed_up,
    }
};
CARD.EFFECT_DURATION = {
    LIMITED: "limited",
    UNLIMITED: "unlimited",
};
CARD.SKILL = {
    11: {
        NAME: "Đạn Choáng",
        ICON: res.card.skill.stun,
        DESCRIPTION: "Gây mini choáng cho quái trong 0.2s",
        STAT: {
            duration: {
                label: res.card.stat.time,
                value: "0.2s",
            }
        }
    },
    12: {
        NAME: "Cộng Hưởng",
        ICON: res.card.skill.resonance,
        DESCRIPTION: "Cộng thêm 10 sát thương khi trong vùng nổ đạn có trên 5 quái",
        STAT: {
            damageUp: {
                label: res.card.stat.damage_up,
                value: 10,
            }
        }
    },
    13: {
        NAME: "Tăng Sát",
        ICON: res.card.skill.bonus_damage,
        DESCRIPTION: "Tăng 50% sát thương cho lần gây sát thương tiếp theo của đạn",
        STAT: {
            damageUp: {
                label: res.card.stat.damage_up,
                value: "50%",
            }
        }
    },
    14: {
        NAME: "Nhớt Độc",
        ICON: res.card.skill.poison,
        DESCRIPTION: "Gây độc cho quái bị dính đạn 2 máu/s trong 3s",
        STAT: {
            damageUp: {
                label: res.card.stat.damage_up,
                value: "50%",
            }
        }
    },
    15: {
        NAME: "Băng Sát",
        ICON: res.card.skill.armor_break,
        DESCRIPTION: "Tăng 50% sát thương cho lần gây sát thương tiếp theo của đạn",
        STAT: {
            damage: {
                label: res.card.stat.damage,
                value: "2/s",
            },
            duration: {
                label: res.card.stat.time,
                value: "3s",
            },
        }
    },
    16: {
        NAME: "Làm Chậm",
        ICON: res.card.skill.slow,
        DESCRIPTION: "Quái đi vào vùng trụ sẽ bị làm chậm 80%",
        STAT: {
            immobilize: {
                label: res.card.stat.immobilize,
                value: "80%",
            }
        }
    },
    17: {
        NAME: "Đốt Máu",
        ICON: res.card.skill.burn,
        DESCRIPTION: "Đốt máu quái khi đi vào vùng đốt 1%/s - tối đa 5 máu/s",
        STAT: {
            damage: {
                label: res.card.stat.damage,
                value: "1%",
            }
        }
    },
}