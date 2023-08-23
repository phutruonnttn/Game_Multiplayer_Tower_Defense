/**
 * @author huynv6
 */

package model.user.Shop;

import config.user.UserConfig;
import model.user.base.AbstractUserModel;

public class ShopModel extends AbstractUserModel {
    Item[] listItem = new Item[UserConfig.numItem];
    int createdDay;
    public ShopModel(int uid){
        super(uid);
    }
}
