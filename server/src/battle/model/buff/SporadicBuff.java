package battle.model.buff;

/**
 *
 * buff khong lien tuc co thoi gian cho
 */
public class SporadicBuff extends  Buff{

    //bien dem nguoc thoi gian
    int timer = 0;
    //so tick giua 2 lan buff
    int delayTime = 0;

    /**
     *
     * @param timeEffect so tick tac dung hieu ung buff
     * @param delayTime so tick giua 2 lan buff
     * @param value gia tri cua buff
     * @param clock thoi gian tren object co buff
     */
    public SporadicBuff(int timeEffect, int delayTime, double value, int clock) {

        super(timeEffect, clock);
        this.value = value;
        this.delayTime = delayTime;
        this.timer = 0;
    }

    /**
     *
     * @return
     * tra ve gia tri buff tai tick hien tai neu khong phai tick co buff tra vè 0
     */
    public double getValueAtCurTime(){

        if (this.timer == 0) {
            this.timer = this.delayTime;
            return this.value;
        }
        this.timer--;
        return 0;
    }

}
