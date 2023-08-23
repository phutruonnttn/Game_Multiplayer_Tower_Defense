package util.metric;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class MetricLog {
    private static Logger logger = LoggerFactory.getLogger("MetricLog");
    public static final String LOG_SEP = "\t";


    public MetricLog() {
        super();
    }

    public static void write(String data) {
        long time = System.currentTimeMillis();
        StringBuilder s = new StringBuilder();
        s.append(time);
        s.append(LOG_SEP);
        s.append("moniter");
        s.append(LOG_SEP);
        s.append(data);

        //LogController.GetController().writeLog(ILogController.LogMode.ACTION, s.toString());
    }

    public static void writeCCULog(int ccu) {
        long time = System.currentTimeMillis();
        StringBuilder s = new StringBuilder();

        ccu += 100;

        s.append(time);
        s.append(LOG_SEP);
        s.append(LogDefine.CCU);
        s.append(LOG_SEP);
        s.append(ccu);

        //LogController.GetController().writeLog(ILogController.LogMode.ACTION, s.toString());
    }

    public static void writeActionLog(LogObject logObject) {
        //LogController.GetController().writeLog(ILogController.LogMode.ACTION, logObject.getLogMessage());
    }

}
