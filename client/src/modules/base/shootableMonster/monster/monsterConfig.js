const MONSTER_TYPE = {
    SWORDSMAN:0,
    ASSASSIN:1,
    GIANT: 2,
    BAT: 3,
    NINJA: 4,
    DARK_GIANT: 5,
    SATYR : 6,
};
// SATYR
let SatyrAbilityConfig = {
    activate: {
        delay: 30 //frame 1000/dt
    },
    adjust: {
        getMonstersRadius: 2,
        getMonstersExcludeSelf: true,
        minAdjustTargets: 1,
        healHpByHpPercentage: 0.03
    }
}
const SATYR_LEVEL = 1;

//DARK GIANT

const DARK_GIANT_LEVEL = 1;

//NINJA
const NinjaAbilityConfig = {
    RATIO_LOST_HP : 0.3,
    DISTANCE : 3
}

