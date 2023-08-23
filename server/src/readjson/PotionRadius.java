package readjson;

import java.io.Serializable;

public class PotionRadius implements Serializable {
    private double value;
    private double increasePerRank;

    public double getRadius(int rank) {
        return this.value + this.increasePerRank * (rank - 1);
    }
}