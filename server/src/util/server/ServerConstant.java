package util.server;

import bitzero.server.config.ConfigHandle;

public class ServerConstant {
    public static final String PLAYER_INFO = "player_info_1.1";
    public static final String PLAYER_SHOP = "player_shop_1.1";
    public static final String PLAYER = "player_inventory_1.1";
    public static final String PLAYER_CARD = "player_card_1.1";
    public static final String PLAYER_CHEST = "player_chest_1.1";

    public static final String PLAYER_TRANSIENT = "player_transient";
    public static final String MACHINE_TRANSIENT = "machine_transient";

    public static final boolean IS_CHEAT = (ConfigHandle.instance().getLong("isCheat") == 1);
    //public static final boolean IS_USE_SECOND_DATACONTROLLER = (ConfigHandle.instance().getLong("useSecondDataController") == 1);
    public static final boolean IS_PURCHASE = (ConfigHandle.instance().getLong("isPurchase") == 1);
    public static final boolean IS_METRICLOG = (ConfigHandle.instance().getLong("isMetriclog") == 1);
    public static final boolean ZME_ENABLE = (ConfigHandle.instance().getLong("zme_enable") == 1);

    public static final String GAME_DATA_KEY_PREFIX = "game-data-key-group2-fresher"; //ConfigHandle.instance().get("game_data_key_prefix").trim();
    public static final String USER_INFO_KEY = "user-group2-fresher"; //ConfigHandle.instance().get("user_info_key").trim();
    public static final int FARM_ID_COUNT_FROM = Integer.valueOf(ConfigHandle.instance().get("farm_id_count_from"));
    public static final String FARM_ID_KEY = ConfigHandle.instance().get("farm_id_key").trim();
    public static final String LAST_SNAPSHOT_KEY = ConfigHandle.instance().get("last_snapshot_key").trim();
    public static final String SEPERATOR = ConfigHandle.instance().get("key_name_seperator").trim();
    public static final String SERVER_ID = ConfigHandle.instance().get("serverId").trim();
    public static final boolean ENABLE_PAYMENT = (ConfigHandle.instance().getLong("enable_payment") == 1);
    public static final boolean ENABLE_ADMIN_PROMO = (ConfigHandle.instance().getLong("enable_admin_promo") == 1);
    public static final String CLIENT_VER = ConfigHandle.instance().get("clientVer").trim();
    public static final boolean DEV_ENVIRONMENT = (ConfigHandle.instance().getLong("devEnvironment") == 1);
    public static final String GG_STORE = ConfigHandle.instance().get("gg_store_url").trim();
    public static final String SS_STORE = ConfigHandle.instance().get("ss_store_url").trim();
    
    public static final int CUSTOM_LOGIN = ConfigHandle.instance().getLong("custom_login").intValue();

    public static final int CACHE_EXP_TIME = 259200;
}
