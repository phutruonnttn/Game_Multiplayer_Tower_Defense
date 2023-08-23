/**
 * @author huynv6
 */

package model.user.player;

import config.user.InventoryConfig;
import model.user.base.AbstractUserModel;

public class PlayerModel extends AbstractUserModel {

    int exp = InventoryConfig.initExp;
    int level = InventoryConfig.initLevel;
    int gold = InventoryConfig.initGold;
    int gem = InventoryConfig.initGem;
    int fame = InventoryConfig.initFame;
    String name;

    public PlayerModel(int uid, String name){
        super(uid);
        this.name = name;
    }

    public int getExp() {
        return exp;
    }

    public void setExp(int exp) {
        this.exp = exp;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getGold() {
        return gold;
    }

    public void setGold(int gold) {
        this.gold = gold;
    }

    public int getGem() {
        return gem;
    }

    public void setGem(int gem) {
        this.gem = gem;
    }

    public int getFame() {
        return fame;
    }

    public void setFame(int fame) {
        this.fame = fame;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
