package readjson;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class Buff implements Serializable {
    protected String name;
    protected String durationType;
    private HashMap<Integer, Integer> duration;
    protected Boolean durationUseCardLevel = false;
    protected Boolean effectsUseCardLevel = false;
    protected String state;

    protected HashMap<Integer, ArrayList<EffectBuff>> effects;

    public double getDuration(int evolution, int level) {
        double duration = this.duration.get(evolution) / 1000.0;
        if (this.durationUseCardLevel)
            duration *= 1 + 0.1 * (level - 1);
        return duration;
    }

    public double getEffectValue(int evolution) {
        return this.effects.get(evolution).get(0).value;
    }

    public String getEffectName(int evolution) {
        return this.effects.get(evolution).get(0).name;
    }
}

class EffectBuff implements Serializable {
    String name;
    String type;
    double value;
    double delay;
    int hpPerDelay;
}
