package battle.model.buff;

/**
 *
 * buff chi so toc do
 */
public class SpeedBuff extends Buff {

    public SpeedBuff(int time, double value, int clock) {
        super(time, clock);
        this.value = value;
    }
}
