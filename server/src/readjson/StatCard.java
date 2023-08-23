package readjson;

import java.io.Serializable;

public class StatCard implements Serializable {
    protected String name;
    protected int energy;

    public int getEnergy() {
        return this.energy;
    }
}
