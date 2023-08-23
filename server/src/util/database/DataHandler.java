package util.database;

import bitzero.server.config.ConfigHandle;
import bitzero.util.datacontroller.business.DataController;
import net.spy.memcached.CASResponse;
import net.spy.memcached.CASValue;
import util.server.ServerConstant;

public class DataHandler {

    public static String PREFIX =
        ConfigHandle.instance().get("db_prefix") == null ? "zpp_pre_" : ConfigHandle.instance().get("db_prefix") + "_";

    public DataHandler() {
        super();
    }

    public static void set(String key, DataModel dbObject) throws Exception {
        DataController.getController().set(PREFIX + key, dbObject);
    }

    public static void set(String key, Object obj) throws Exception {
        DataController.getController().set(PREFIX + key, obj);
    }

    public static Object get(String key) throws Exception {
        return DataController.getController().get(PREFIX + key);
    }

    public static void setCache(String key, DataModel dbObject) throws Exception {
        DataController.getController().setCache(PREFIX + key, ServerConstant.CACHE_EXP_TIME, dbObject);
    }

    public static void setCache(String key, Object obj) throws Exception {
        DataController.getController().setCache(PREFIX + key, ServerConstant.CACHE_EXP_TIME, obj);
    }

    public static Object getCache(String key) throws Exception {
        return DataController.getController().getCache(PREFIX + key);
    }

    public static CASResponse checkAndSet(String key, long valCAS, Object obj) throws Exception {
        return DataController.getController().checkAndSet(PREFIX + key, valCAS, obj);
    }

    public static CASValue getS(String key) throws Exception {
        return DataController.getController().getS(PREFIX + key);
    }

}
