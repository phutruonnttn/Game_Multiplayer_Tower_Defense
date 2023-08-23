/**
 * @author huynv6
 */

package model.user.Shop;

import Constant.InventoryError;
import Constant.ShopError;
import bitzero.server.entities.User;
import cmd.response.shop.ResponseShopBuyCard;
import cmd.response.shop.ResponseShopBuyChest;
import cmd.response.shop.ResponseShopBuyGold;
import cmd.response.shop.ResponseShopGetInfo;
import config.user.ShopConfig;
import model.user.base.BaseService;
import model.user.card.CardModel;
import model.user.card.CardService;
import model.user.chest.ChestService;
import model.user.player.PlayerModel;
import model.user.player.PlayerService;
import util.RandomNumber;
import util.server.ServerConstant;

import java.util.ArrayList;
import java.util.Calendar;

public class ShopService extends BaseService {

    public static ShopService shopService = null;
    public static ShopService getInstance(){

        if(shopService == null){
            shopService = new ShopService();
        }

        return shopService;
    }

    @Override
    public ShopModel getModelFromCache(User user){

        return (ShopModel) user.getProperty(ServerConstant.PLAYER_SHOP);
    }

    public ResponseShopGetInfo getData(ShopModel shopModel, CardModel cardModel){

        if(checkNeedResetShop(shopModel)){
            refreshShop(shopModel, cardModel);
        };

        Item[] listItem = new Item[ShopConfig.numberItem];
        int numberItem = 0;
        for(Item item : shopModel.listItem){
            if(item != null){
                listItem[numberItem++] = item;
            }
        }

        int numberGold = ShopConfig.numberCoin;
        Gold[] listGold = new Gold[ShopConfig.numberCoin];
        for (int i = 0; i < ShopConfig.numberCoin; i++){
            listGold[i] = new Gold(i, ShopConfig.listCoin[i][1], ShopConfig.listCoin[i][0]);
        }

        return new ResponseShopGetInfo(numberItem, listItem, numberGold, listGold);
    }

    public ResponseShopBuyGold buyCoin(ShopModel shopModel, PlayerModel playerModel, int index){

        if(checkNeedResetShop(shopModel)){
            return new ResponseShopBuyGold(ShopError.SHOP_EXPIRED);
        }

        if(index < 0 || index >= ShopConfig.numberCoin){
            return new ResponseShopBuyGold(ShopError.SHOP_COIN_INDEX_INVALID);
        }

        PlayerService playerService = PlayerService.getInstance();

        int costGem = ShopConfig.listCoin[index][0];

        int status = playerService.subGem(playerModel, costGem);
        if(status != InventoryError.INVENTORY_SUCCESS){
            return new ResponseShopBuyGold(InventoryError.INVENTORY_GEM_NOT_ENOUGH);
        }

        playerService.addGold(playerModel, ShopConfig.listCoin[index][1]);

        return new ResponseShopBuyGold(ShopError.SHOP_SUCCESS);

    }

    public ResponseShopBuyChest buyChest(ShopModel shopModel, int index, PlayerModel playerModel, CardModel cardModel){

        if(checkNeedResetShop(shopModel)){
            return new ResponseShopBuyChest(ShopError.SHOP_EXPIRED);
        }

        if(index < 0 || index >= ShopConfig.numberItem){
            return new ResponseShopBuyChest(ShopError.SHOP_ITEM_INDEX_INVALID);
        }

        if(shopModel.listItem[index].isBought != 0){
            return new ResponseShopBuyChest(ShopError.SHOP_ITEM_WAS_BOUGHT);
        }

        if(shopModel.listItem[index].type != ShopConfig.shopItemChestType){
            return new ResponseShopBuyChest(ShopError.SHOP_ITEM_INVALID_TYPE);
        }

        PlayerService playerService = PlayerService.getInstance();
        int status = playerService.subGold(playerModel, ShopConfig.priceItemChest);
        if(status != InventoryError.INVENTORY_SUCCESS){
            return new ResponseShopBuyChest(InventoryError.INVENTORY_GOLD_NOT_ENOUGH);
        }

        Item item = shopModel.listItem[index];
        item.isBought = 1;

        int [] result = ChestService.getInstance().addChestReward(playerModel, cardModel);

        return new ResponseShopBuyChest(result[0], result[1], result[2], result[3], result[4], result[5]);

    }

    public ResponseShopBuyCard buyPieceCard(ShopModel shopModel, int index, PlayerModel playerModel, CardModel cardModel){

        if(checkNeedResetShop(shopModel)){
            return new ResponseShopBuyCard(ShopError.SHOP_EXPIRED);
        }

        if(index < 0 || index >= ShopConfig.numberItem){
            return new ResponseShopBuyCard(ShopError.SHOP_ITEM_INDEX_INVALID);
        }

        if(shopModel.listItem[index].isBought != 0){
            return new ResponseShopBuyCard(ShopError.SHOP_ITEM_WAS_BOUGHT);
        }

        if(shopModel.listItem[index].type != ShopConfig.shopItemCardType){
            return new ResponseShopBuyCard(ShopError.SHOP_ITEM_INVALID_TYPE);
        }

        Item item = shopModel.listItem[index];

        PlayerService playerService = PlayerService.getInstance();
        int status = playerService.subGold(playerModel, item.amount*ShopConfig.pricePieceCard);
        if(status != InventoryError.INVENTORY_SUCCESS){
            return new ResponseShopBuyCard(InventoryError.INVENTORY_GOLD_NOT_ENOUGH);
        }

        CardService cardService = CardService.getInstance();
        cardService.addCardPiece(cardModel, item.pieceId, item.amount);
        item.isBought = 1;

        return  new ResponseShopBuyCard(ShopError.SHOP_SUCCESS);

    }

    public void refreshShop(ShopModel shopModel, CardModel cardModel){

        shopModel.createdDay = Calendar.getInstance().get(Calendar.DAY_OF_YEAR);
        int k = 0;

        //sinh chest
        for( int i = 0; k < ShopConfig.numberItem && i < ShopConfig.maxChest; i++ ){
            int numPiece, type, itemId;
            double p = Math.random();
            if(p < ShopConfig.probabilityChestExist){
                numPiece = 1;
                itemId = -1;
                type = ShopConfig.shopItemChestType;
                shopModel.listItem[k] = new Item(itemId, numPiece, type, k);
                k++;
        }}
        //sinh card
        ArrayList<Integer> listIdCard = CardService.getInstance().getListCardNotFull(cardModel, ShopConfig.maxCard);
        for(int i = 0; k < ShopConfig.numberItem && i < listIdCard.size(); i++){
            int numPiece, type, itemId;
            int min = ShopConfig.amountPiece[0];
            int max = ShopConfig.amountPiece[1];
            int step = ShopConfig.amountPiece[2];
            type = ShopConfig.shopItemCardType;
            numPiece = RandomNumber.getNumberInRange(min, max, step);
            itemId = listIdCard.get(i);
            shopModel.listItem[k] = new Item(itemId, numPiece, type, k);
            k++;
        }

        shopModel.save();
    }

    private boolean checkNeedResetShop(ShopModel shopModel){

        if(shopModel.createdDay != Calendar.getInstance().get(Calendar.DAY_OF_YEAR)){
            return true;
        };

        return false;
    }
}
