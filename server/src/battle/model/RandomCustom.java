package battle.model;

import util.battle.BattleUtils;

public class RandomCustom {

    public int MODULE = (int) Math.pow(2,16) + 1; //m
    private int multiplier = 75; //a
    private int increment = 74; //c
    private int seed;

    public RandomCustom(int seedRandom) {
        this.seed = seedRandom;
    }

    public double getRandom() {
        this.seed = (multiplier * this.seed + increment) % MODULE;
        return BattleUtils.round((double) seed / MODULE);
    }
}
