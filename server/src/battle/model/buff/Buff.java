package battle.model.buff;

/**
 * class nay tao ra buff chi so co value la 1 so double , thoi gian cua buff tinh bang so tick
 */
public class Buff {

    //tick buff het han
    int expired;
    //gia tri buff
    public double value;

    /**
     *
     * @param time thoi gian buff
     * @param clock thoi gian hien tai tren object co buff
     */
    public Buff(int time, int clock) {

        this.expired = clock + time;
    }

    /**
     *
     * @param time time thoi gian buff
     * @param clock clock thoi gian hien tai tren object co buff
     */
    public void setTimeEffect(int time, int clock) {

        if (time + clock > this.expired) {
            this.expired = time + clock;
        }
    }

    /**
     *
     * @param clock clock clock thoi gian hien tai tren object co buff
     * @return
     * neu buff dang active se tra ve true
     */
    public boolean checkStatus(int clock) {

        if (this.expired >= clock) {
            return true;
        }
        return false;
    }

    /**
     *
     * @return
     * tra ve tra tri cua buff
     */
    public double getValue() {

        return this.value;
    }
}
