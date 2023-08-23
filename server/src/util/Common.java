package util;

import bitzero.util.common.business.CommonHandle;
import bitzero.util.config.bean.ConstantMercury;
import bitzero.util.datacontroller.business.DataController;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.Calendar;

public class Common {
    public Common() {
        super();
    }

    public static boolean checkSocial(String social) {
        return true;
    }

    public static int currentTimeInSecond() {
        return Long.valueOf(System.currentTimeMillis() / 1000).intValue();
    }

    public static String encryptMD5(String input) {
        byte[] defaultBytes = input.getBytes();
        try {
            MessageDigest algorithm = MessageDigest.getInstance("MD5");
            algorithm.reset();
            algorithm.update(defaultBytes);
            byte messageDigest[] = algorithm.digest();

            StringBuilder hexString = new StringBuilder();
            for (int i = 0; i < messageDigest.length; i++) {
                String hex = Integer.toHexString(0xFF & messageDigest[i]);
                if (hex.length() == 1)
                    hexString.append('0');

                hexString.append(hex);
            }
            return hexString + "";
        } catch (NoSuchAlgorithmException nsae) {
            CommonHandle.writeErrLog(nsae);
            return null;
        }
    }

    public static String getLogCategory(String prefix) {
        StringBuilder category = new StringBuilder();

        category.append(prefix);
        category.append("_");
        String tt = new SimpleDateFormat("yyyyMMdd_hh").format(Calendar.getInstance().getTime());
        category.append(tt);

        return category.toString();
    }

    public static boolean isUserOnline(int userId) throws Exception {
        int isOnline =
            (Integer) DataController.getController().get(ConstantMercury.PREFIX_SNSGAME_GENERAL + userId +
                                                         ConstantMercury.SUFFIX_ONLINE);
        return (isOnline == 1);
    }

}
