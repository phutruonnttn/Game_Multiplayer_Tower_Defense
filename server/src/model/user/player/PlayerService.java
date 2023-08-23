/**
 * @author huynv6
 */

package model.user.player;

import Constant.InventoryError;
import bitzero.server.entities.User;
import cmd.response.player.ResponseCheatGem;
import cmd.response.player.ResponseCheatGold;
import cmd.response.player.ResponsePlayerGetInfo;
import config.user.InventoryConfig;
import model.user.base.BaseService;
import util.server.ServerConstant;

public class PlayerService extends BaseService {

    private static PlayerService playerService = null;

    public static PlayerService getInstance(){

        if(playerService == null){
            playerService = new PlayerService();
        }

        return playerService;
    }

    @Override
    public PlayerModel getModelFromCache(User user){

        return (PlayerModel) user.getProperty(ServerConstant.PLAYER);
    }

    public ResponsePlayerGetInfo getData(PlayerModel playerModel){

        return new ResponsePlayerGetInfo(
                playerModel.level,
                playerModel.exp,
                playerModel.gem,
                playerModel.gold,
                playerModel.fame,
                playerModel.name);

    }

    /**
     *
     * @param playerModel
     * @param amount
     * @return
     * cong gold
     */
    public int addGold(PlayerModel playerModel, int amount){

        playerModel.gold += amount;

        return InventoryError.INVENTORY_SUCCESS;
    }

    /**
     *
     * @param playerModel
     * @param amount
     * @return
     * tru gold
     */
    public int subGold(PlayerModel playerModel, int amount){

        if(playerModel.gold < amount){
            return InventoryError.INVENTORY_GOLD_NOT_ENOUGH;
        }

        playerModel.gold -= amount;

        return InventoryError.INVENTORY_SUCCESS;

    }

    /**
     *
     * @param playerModel
     * @param amount
     * @return
     * cong gem
     */
    public int addGem(PlayerModel playerModel, int amount){

        playerModel.gem += amount;

        return InventoryError.INVENTORY_SUCCESS;

    }

    /**
     *
     * @param playerModel
     * @param amount
     * @return
     * tru gem
     */
    public int subGem(PlayerModel playerModel, int amount){

        if(playerModel.gem < amount){
            return InventoryError.INVENTORY_GEM_NOT_ENOUGH;
        }

        playerModel.gem -= amount;

        return InventoryError.INVENTORY_SUCCESS;

    }

    public ResponseCheatGold cheatGold(PlayerModel playerModel){

        addGold(playerModel, InventoryConfig.cheatGold);

        return new ResponseCheatGold(InventoryError.INVENTORY_SUCCESS);
    }

    public ResponseCheatGem cheatGem(PlayerModel playerModel){

        addGem(playerModel, InventoryConfig.cheatGem);

        return new ResponseCheatGem(InventoryError.INVENTORY_SUCCESS);
    }

    public void addFame(int amount, PlayerModel playerModel) {
        playerModel.fame += amount;
    }
}
