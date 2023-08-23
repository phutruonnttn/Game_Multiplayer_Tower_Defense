package battle.model.buff;

import java.util.ArrayList;
import java.util.HashMap;

/**
 *
 * tao buff khong cong don cac buff cac buff phan biet voi nhau qua key la value
 */
public class NotAccumulateBuff {

    HashMap<Double, Buff> mapBuff = new HashMap<>();
    Buff activeBuff = null;

    /**
     *
     * @param clock thoi gian tren object co buff
     * @return tra ve buff dang duoc kich hoat tren object
     */
    public Buff getBuffActive(int clock){

        if(activeBuff!= null && !activeBuff.checkStatus(clock)){
            activeBuff = getMaxBuff(clock);
        }
        return activeBuff;
    }

    /**
     *
     * @param val gia tri buff
     * @return tra ve buff neu co hoac null
     */
    public Buff getBuff(double val){

        return mapBuff.get(val);
    }

    /**
     *
     * @param buff
     */
    public void addBuff(Buff buff){

        mapBuff.put(buff.getValue(), buff);
        if(activeBuff==null || activeBuff.getValue() < buff.getValue()){
            activeBuff = buff;
        }
    }

    /**
     *
     * @param clock thoi gian tren object co buff
     * @return buff co value lon nhat tren object dang active
     */
    private Buff getMaxBuff(int clock){

        Buff buff = null, maxBuff = null;
        double value = 0;
        ArrayList<Double> removeList = new ArrayList<Double>();
        // duyet qua tat ca cac buff tim buff co value lon nhat dang active
        // va xoa cac buff expired
        for(HashMap.Entry<Double,  Buff> element : mapBuff.entrySet()){

            buff = element.getValue();
            if(!buff.checkStatus(clock)){
                removeList.add(buff.getValue());
            }else {
                if(buff.getValue() > value){
                    value = buff.getValue();
                    maxBuff = buff;
                }
            }
        }
        removeList.forEach((Double buffValue)->{
            mapBuff.remove(buffValue);
        });

        return maxBuff;
    }
}
