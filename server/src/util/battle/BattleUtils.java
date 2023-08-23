package util.battle;

import battle.model.Coordinate;
import model.battle.map.Point;
import model.battle.map.Position;

public class BattleUtils {

    private static BattleUtils single_instance = null;

    public static BattleUtils getInstance() {
        if (single_instance == null) {
            single_instance = new BattleUtils();
        }
        return single_instance;
    }

    public Coordinate normalizeVector(Coordinate vector) {
        double lengthOfVector = this.getVectorLength(vector);
        return new Coordinate(
                BattleUtils.round(vector.getX()/lengthOfVector),
                BattleUtils.round(vector.getY()/lengthOfVector)
        );
    }

    public  Position normalizeVector(Position v) {
        double lengthOfVector = this.getVectorLength(new Coordinate(v.getX(), v.getY()));
        return new Position(
                BattleUtils.round(v.getX()/lengthOfVector),
                BattleUtils.round(v.getY()/lengthOfVector)
        );
    }

    // Using Fisher-Yates (aka Knuth) Shuffle algorithm
    public int[] shuffleArray(int[] array) {
        int n = array.length;
        int t;
        int i;
        // While there remain elements to shuffle
        while (n>0) {
            // Pick a remaining element
            i = (int) Math.floor(Math.random() * n--);

            // And swap it with the current element
            t = array[n];
            array[n] = array[i];
            array[i] = t;
        }
        return array;
    }

    public Coordinate getVector(Coordinate pos1, Coordinate pos2) {
        return new Coordinate(
                BattleUtils.round(pos2.getX() - pos1.getX()),
                BattleUtils.round(pos2.getY() - pos1.getY())
        );
    }

    public double getVectorLengthSqr(Coordinate vector) {
        return BattleUtils.round(vector.getX() * vector.getX() + vector.getY() * vector.getY());
    }

    public double getVectorLength(Coordinate vector) {
        return BattleUtils.round(Math.sqrt(this.getVectorLengthSqr(vector)));
    }

    public double getCosAngle2Vector(Coordinate v1,Coordinate v2) {
        return BattleUtils.round(BattleUtils.round(BattleUtils.round(v1.getX() * v2.getX()) + BattleUtils.round(v1.getY() * v2.getY()))
                / BattleUtils.round(this.getVectorLength(v1)*this.getVectorLength(v2)));
    }

    public boolean inCircle(Coordinate centre, double radius, Coordinate pos) {
        return this.getVectorLengthSqr(this.getVector(centre, pos)) <= BattleUtils.round(Math.pow(radius, 2));
    }

    public static double round(double n) {
        final double rounder = 1000;
        return Math.round(n * rounder) / rounder;
    }

    public static boolean equal(double a, double b) {
        final double eps = 0.000001;
        return Math.abs(a - b) <= eps;
    }
}
