package util;

import java.util.Date;

public class TimeUtil {
    public static long getCurTimeSecond(){
        return (new Date().getTime())/1000;
    }
}
