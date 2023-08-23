package readjson;

import java.util.ArrayList;
import java.util.HashMap;

public class BuffTarget extends Buff {
    private HashMap<Integer, Double> moveDistance;

    public double getDelay(int evolution) {
        return this.effects.get(evolution).get(0).delay;
    }

    public double getHpPerDelay(int evolution, int level) {
        double hpPerDelay = this.effects.get(evolution).get(0).hpPerDelay;
        if (this.effectsUseCardLevel) {
            hpPerDelay *= 1 + 0.1 * (level - 1);
        }
        return hpPerDelay;
    }

}

