package battle.model.buff;

/**
 *
 * buff chi so hoi mau
 */
public class HealBuff extends SporadicBuff {

    /**
     *
     * @param timeEffect so tick tac dung
     * @param delayTime thoi gian giua cac tick
     * @param hp so mau hoi tren 1 lan
     * @param clock thoi gian tren object co buff
     */
    public HealBuff(int timeEffect, int delayTime, double hp, int clock) {

        super(timeEffect, delayTime, hp, clock);
    }

    /**
     *
     * @return
     * tra ve so hp duoc hoi tai tick hien tai
     */
    public double getHp() {

       return this.getValueAtCurTime();
    }
}
