package util;

import bitzero.util.common.business.Debug;
import bitzero.util.socialcontroller.bean.UserInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import util.database.DataHandler;
import util.server.ServerConstant;

import java.util.concurrent.atomic.AtomicInteger;

public class GuestLogin {
    private static final AtomicInteger guestCount = new AtomicInteger(1);
    private static final Logger logger = LoggerFactory.getLogger("GuestLogin");

    public static UserInfo newGuest() {
        int userId = 0;
        userId = guestCount.incrementAndGet();

        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(Integer.toString(userId));
        userInfo.setUsername("Fresher" + userId);
        userInfo.setHeadurl("");

        return userInfo;
    }
    
    public static UserInfo setInfo(int userId, String username) {
        UserInfo userInfo = new UserInfo();
        userInfo.setUserId(Integer.toString(userId));
        userInfo.setUsername(username);
        userInfo.setHeadurl("");

        return userInfo;
    }

    public static void init() {
        int count = ServerConstant.FARM_ID_COUNT_FROM;
        Integer tmp = null;
        try {
            tmp = (Integer) DataHandler.get(ServerConstant.FARM_ID_KEY);
        } catch (Exception e) {
            logger.error("Exception get GuestId count");
        }

        if (tmp != null) {
            count = tmp.intValue();
        }

        logger.info("GuestId count on server start: " + Integer.toString(count));
        guestCount.set(count);

        Runtime.getRuntime().addShutdownHook(new Thread() {
            public void run() {
                GuestLogin.saveData();
                logger.info("GuestId count on server shutdown: " + Integer.toString(guestCount.get()));
            }
        });
    }

    public static void saveData() {
        try {
            Integer currCount = Integer.valueOf(guestCount.get());
            DataHandler.set(ServerConstant.FARM_ID_KEY, currCount);
        } catch (Exception e) {
            Debug.trace("Error saving guest id count");
        }
    }

    //    public static UserInfo zaloLogin(String deviceId) {
    //        String[] zaloInfo = deviceId.split("__");
    //
    //        if (zaloInfo.length != 4)
    //            return null;
    //
    //        if (Integer.valueOf(zaloInfo[0]).intValue() < 900000000)
    //            return null;
    //
    //        UserInfo userInfo = new UserInfo();
    //
    //        userInfo.setUserId(zaloInfo[0]);
    //        userInfo.setUsername(zaloInfo[1]);
    //        userInfo.setHeadurl(zaloInfo[2]);
    //        try {
    //            DataController.getController().set("Zalo_GUEST_" + zaloInfo[3],
    //                                               deviceId);
    //        } catch (Exception e) {
    //        }
    //
    //        return userInfo;
    //    }
}
