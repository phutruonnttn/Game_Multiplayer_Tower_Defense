/**
 * @author huynv6
 */

package model.user.chest;

import config.user.ChestConfig;
import model.user.base.AbstractUserModel;

public class ChestModel extends AbstractUserModel {
    Chest[] listChest = new Chest[ChestConfig.numberSlot];
    int openIndex = -1;
    int numberChest = 0;
    long timeToOpen = 0;
    public ChestModel(int uid) {
        super(uid);
    }
}
