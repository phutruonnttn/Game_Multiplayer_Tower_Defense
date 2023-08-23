/**
 * @author huynv6
 */

package model.user;

import model.user.base.AbstractUserModel;

public class PlayerInfo extends AbstractUserModel {
    private String name;
    public PlayerInfo(int uid, String name) {
        super(uid);
        this.name = name;
    }
    public String getName(){
        return this.name;
    }
    public String toString() {
        return String.format("%s|%s", new Object[]{name});
    }

}
