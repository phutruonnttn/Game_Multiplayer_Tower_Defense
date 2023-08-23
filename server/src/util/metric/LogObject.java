package util.metric;


import model.user.PlayerInfo;

public class LogObject {
    public long time = 0;
    public int actionId = 0;
    public int accountType = 0; //0 google, 1 facebook, 2 zingplay, 3 zing me
    public String deviceId = ""; //chuoi id may
    public String openAccount = ""; //tai khoan mail...
    public long zingId = 0;
    public String zingName = "";
    public long exp = 0;
    public long currentExp = 0;
    public long currentLevel = 0;
    public long quantity = 0;
    public String itemId = "";
    public String itemType = "";
    public String targetId = "";
    public String targetType = "";
    public int platform = 0; //0 Android, 1 iOs, 2 web, 3 zingme, 4 yahoo
    public int networkType = 0; //0 la chua biet, 1 la 3G, 2 la wifi
    public int signalStrength = 0; //tu 1-5
    public String location = "";
    public String deviceType = "";
    public String osVersion = "";

    public static final String SEPERATE_SYMBOL = "|";
    public static final int ACTION_LOGIN = 1;
    public static final int ACTION_CHANGE_ACCOUNT = 2;
    public static final int ACTION_LOGOUT = 3;
    public static final int ACTION_GAME_INSTALL = 4;
    public static final int ACTION_GAME_UPGRADE = 5;
    public static final int ACTION_GAME_UNINSTALL = 6;
    public static final int ACTION_GAME_JOIN = 7;

    public LogObject(int _actionId) {
        actionId = _actionId;
    }

    public static int getSocialTypeCode(String _socialType) {
        if (_socialType.equals("facebook"))
            return 1;
        else if (_socialType.equals("google"))
            return 0;
        else if (_socialType.equals("zingplay"))
            return 2;
        else if (_socialType.equals("zingme"))
            return 3;
        return 0;
    }

    public String getLogMessage() {
        if (time == 0) {
            time = System.currentTimeMillis();
        }
        if (accountType == 0 | openAccount == "" | zingName == "") //|| currentExp == 0 || currentLevel == 0)
        {
            PlayerInfo userInfo = null;
            try {
                //          if(zingId == 0 && accountType != "" && openAccount != "") {
                //            zingId = Long.parseLong(MapSocialId.getInstance().getZingId(accountType, openAccount));
                //          }
                if (zingId != 0) {
                    userInfo = (PlayerInfo) PlayerInfo.getModel((int) zingId, PlayerInfo.class);
                }
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

            if (userInfo != null) {
                
                accountType = 1;
                
            }
        }

        Object[] logValues = new Object[] {
            time, actionId, accountType, deviceId, openAccount, zingId, zingName, exp, currentExp, currentLevel,
            quantity, itemId, itemType, targetId, targetType, platform, networkType, signalStrength, location,
            deviceType, osVersion
        };

        String formatLog = "";
        for (int i = 0; i < logValues.length - 1; i++) {
            formatLog += "%s" + SEPERATE_SYMBOL;
        }
        formatLog += "%s";

        String logMessage = String.format(formatLog, logValues);
        return logMessage;
    }
}
