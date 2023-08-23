package readjson;

import java.util.HashMap;

public class StatPotion extends StatCard {
    private String map;
    private HashMap<String, String> action;
    private int duration;
    private int radiusType;
    private HashMap<String, HashMap<Integer, Integer>> statPerLevel;
    private HashMap<String, PotionAdjust> adjust;
    private int healDelay;

    public double getRadius(int rank) {
        return JsonConfig.getInstance().getPotionRadius(this.radiusType).getRadius(rank);
    }

    public int getPotionValue(String statType, int level) {
        return this.statPerLevel.get(statType).get(level);
    }

    public int getAdjustValue(String key) {
        return this.adjust.get(key).value;
    }

    public double getDuration() {
        return this.duration / 1000.0;
    }
}

class PotionAdjust {
    String type;
    int value;
}