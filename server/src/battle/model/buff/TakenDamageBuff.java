package battle.model.buff;

/**
 * buff chi so % sat thuong nhan vao
 */
public class TakenDamageBuff extends Buff{

    /**
     *
     * @param time so tick tac dung
     * @param value vi du 0.1 = 10%
     * @param clock thoi gian tren object co buff
     */
    public TakenDamageBuff(int time, double value, int clock) {

        super(time, clock);
        this.value = value;
    }

}
