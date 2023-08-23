package handler;

import bitzero.server.BitZeroServer;
import bitzero.server.core.BZEventParam;
import bitzero.server.core.BZEventType;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.data.DataCmd;
import cmd.CmdDefine;
import cmd.request.lobby.*;
import cmd.response.card.ResponseCardChange;
import cmd.response.card.ResponseCardCheat;
import cmd.response.card.ResponseCardGetInfo;
import cmd.response.card.ResponseCardUpgrade;
import cmd.response.chest.ResponseChestCheat;
import cmd.response.chest.ResponseChestGetGift;
import cmd.response.chest.ResponseChestGetInfo;
import cmd.response.chest.ResponseChestOpen;
import cmd.response.player.ResponseCheatGem;
import cmd.response.player.ResponseCheatGold;
import cmd.response.player.ResponsePlayerGetInfo;
import cmd.response.shop.ResponseShopBuyCard;
import cmd.response.shop.ResponseShopBuyChest;
import cmd.response.shop.ResponseShopBuyGold;
import cmd.response.shop.ResponseShopGetInfo;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import extension.FresherExtension;
import model.user.Shop.ShopModel;
import model.user.Shop.ShopService;
import model.user.card.CardModel;
import model.user.card.CardService;
import model.user.chest.ChestModel;
import model.user.chest.ChestService;
import model.user.player.PlayerModel;
import model.user.player.PlayerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import util.server.ServerConstant;

import java.util.List;

public class UserHandler extends BaseClientRequestHandler{
    public static short USER_MULTI_IDS = 1000;
    private final Logger logger = LoggerFactory.getLogger("UserHandler");
    ChestService chestService = ChestService.getInstance();
    PlayerService playerService = PlayerService.getInstance();
    ShopService shopService = ShopService.getInstance();
    CardService cardService = CardService.getInstance();

    public UserHandler(){
        super();
    }

    public void init(){
        getExtension().addEventListener(BZEventType.USER_DISCONNECT, this);
        getExtension().addEventListener(BZEventType.USER_RECONNECTION_SUCCESS, this);

        /**
         *  register new event, so the core will dispatch event type to this class
         */
        getExtension().addEventListener(DemoEventType.CHANGE_NAME, this);
    }

    private FresherExtension getExtension(){
        return (FresherExtension) getParentExtension();
    }

    public void handleServerEvent(IBZEvent ibzevent){

        if (ibzevent.getType() == BZEventType.USER_DISCONNECT)
            this.userDisconnect((User) ibzevent.getParameter(BZEventParam.USER));
        else if (ibzevent.getType() == DemoEventType.CHANGE_NAME)
            this.userChangeName((User) ibzevent.getParameter(DemoEventParam.USER), (String)ibzevent.getParameter(DemoEventParam.NAME));
    }

    public void handleClientRequest(User user, DataCmd dataCmd){
        synchronized (user.getProperty(ServerConstant.PLAYER)){
            try{
                switch (dataCmd.getId()){
                    case CmdDefine.GET_USER_INFO:{
                        getUserInfo(user);
                        break;
                    }
                    case CmdDefine.CHEST_INFO:{
                        sendChestUserInfo(user);
                        break;
                    }
                    case  CmdDefine.CHEST_GET_GIFT:{
                        RequestChestGetGift req = new RequestChestGetGift(dataCmd);
                        getGift(user, req.getIndex());
                        break;
                    }
                    case CmdDefine.PLAYER_INFO:{
                        sendInventoryUserInfo(user);
                        break;
                    }
                    case CmdDefine.CARD_INFO:{
                        sendCardUserInfo(user);
                        break;
                    }
                    case CmdDefine.CARD_CHANGE:{
                        RequestCardChange req = new RequestCardChange(dataCmd);
                        changeCard(user, req.getCardId(), req.getTargetIndex());
                        break;
                    }
                    case  CmdDefine.CARD_UPGRADE:{
                        RequestCardUpgrade req = new RequestCardUpgrade(dataCmd);
                        upgradeCard(user, req.getCardId());
                        break;
                    }
                    case CmdDefine.CHEST_OPEN:{
                        RequestChestOpen req = new RequestChestOpen(dataCmd);
                        openChest(user, req.getIndex());
                        break;
                    }
                    case CmdDefine.SHOP_INFO:{
                        sendShopUserInfo(user);
                        break;
                    }
                    case CmdDefine.ITEM_CHEST_BUY:{
                        RequestShopBuyChest req = new RequestShopBuyChest(dataCmd);
                        buyChest(user, req.getIndex());
                        break;
                    }
                    case CmdDefine.ITEM_CARD_BUY:{
                        RequestShopBuyCard req = new RequestShopBuyCard(dataCmd);
                        buyPieceCard(user, req.getIndex());
                        break;
                    }
                    case CmdDefine.SHOP_BUY_GOLD:{
                        RequestShopBuyGold req = new RequestShopBuyGold(dataCmd);
                        buyGold(user, req.getIndex());
                        break;
                    }

                    case CmdDefine.CARD_CHEAT:{
                        RequestCardCheat req = new RequestCardCheat(dataCmd);
                        cheatCard(user, req.getCardId(), req.getAmount());
                        break;
                    }
                    case CmdDefine.CHEST_CHEAT:{
                        cheatChest(user);
                        break;
                    }
                    case CmdDefine.GEM_CHEAT:{
                        cheatGem(user);
                        break;
                    }
                    case CmdDefine.GOLD_CHEAT:{
                        cheatGold(user);
                        break;
                    }
                }
            } catch (Exception e){
                e.printStackTrace();
            }
        }

    }

    private void getUserInfo(User user){

        sendCardUserInfo(user);

        sendChestUserInfo(user);

        sendInventoryUserInfo(user);

        sendShopUserInfo(user);

    }


    private void cheatGold(User user){

        PlayerModel playerModel = playerService.getModelFromCache(user);

        ResponseCheatGold res = playerService.cheatGold(playerModel);
        playerService.saveModelToDatabase(user);

        send(res, user);
    }

    private void cheatGem(User user){

        PlayerModel playerModel = playerService.getModelFromCache(user);

        ResponseCheatGem res = playerService.cheatGem(playerModel);
        playerService.saveModelToDatabase(user);

        send(res, user);
    }

    private void sendCardUserInfo(User user){

        CardModel cardModel = cardService.getModelFromCache(user);

        ResponseCardGetInfo res = cardService.getData(cardModel);

        send(res, user);
    }

    private void upgradeCard(User user, int cardId){

        CardModel cardModel = cardService.getModelFromCache(user);
        PlayerModel playerModel = playerService.getModelFromCache(user);

        ResponseCardUpgrade res = cardService.upgradeCard(
                cardModel,
                cardId,
                playerModel
        );

        cardService.saveModelToDatabase(user);
        playerService.saveModelToDatabase(user);

        send(res, user);
    }

    private void changeCard(User user, int cardId, int targetIndex){

        CardModel cardModel = cardService.getModelFromCache(user);

        ResponseCardChange res = cardService.changeCard(cardModel, cardId, targetIndex);
        cardService.saveModelToDatabase(user);

        send(res, user);
    }

    private void sendShopUserInfo(User user){

        ShopModel shopModel = shopService.getModelFromCache(user);
        CardModel cardModel = cardService.getModelFromCache(user);

        ResponseShopGetInfo res = shopService.getData(shopModel, cardModel);

        send(res, user);

    }

    private void sendChestUserInfo(User user){

        ChestModel chestModel = chestService.getModelFromCache(user);

        ResponseChestGetInfo res = chestService.getData(chestModel);

        send(res, user);
    }

    private void sendInventoryUserInfo(User user){

        PlayerModel playerModel = playerService.getModelFromCache(user);
        ResponsePlayerGetInfo res = playerService.getData(playerModel);
        send(res, user);
    }

    private void buyPieceCard(User user, int index){

        ShopModel shopModel = shopService.getModelFromCache(user);
        PlayerModel playerModel = playerService.getModelFromCache(user);
        CardModel cardModel = cardService.getModelFromCache(user);

        ResponseShopBuyCard res = shopService.buyPieceCard(shopModel, index, playerModel, cardModel);

        shopService.saveModelToDatabase(user);
        cardService.saveModelToDatabase(user);
        playerService.saveModelToDatabase(user);

        send(res, user);
    }

    private void buyGold(User user, int index){

        ShopModel shopModel = shopService.getModelFromCache(user);
        PlayerModel playerModel = playerService.getModelFromCache(user);

        ResponseShopBuyGold res = shopService.buyCoin(shopModel, playerModel, index);

        shopService.saveModelToDatabase(user);

        playerService.saveModelToDatabase(user);

        send(res, user);
    }


    private void cheatCard(User user, int cardId, int amount){

        CardModel cardModel = cardService.getModelFromCache(user);

        ResponseCardCheat res = cardService.cheatCard(cardModel, cardId, amount);
        cardService.saveModelToDatabase(user);

        send(res, user);
    }

    private void buyChest(User user, int index){

        ShopModel shopModel = shopService.getModelFromCache(user);
        PlayerModel playerModel = playerService.getModelFromCache(user);
        CardModel cardModel = cardService.getModelFromCache(user);

        ResponseShopBuyChest res = shopService.buyChest(shopModel, index, playerModel, cardModel);

        shopService.saveModelToDatabase(user);
        cardService.saveModelToDatabase(user);
        playerService.saveModelToDatabase(user);

        send(res, user);

    }

    private void getGift(User user, int index){

        ChestModel chestModel = chestService.getModelFromCache(user);
        PlayerModel playerModel = playerService.getModelFromCache(user);
        CardModel cardModel = cardService.getModelFromCache(user);

        ResponseChestGetGift res = chestService.getGiftChest(chestModel, playerModel, cardModel, index);
        chestService.saveModelToDatabase(user);
        playerService.saveModelToDatabase(user);
        cardService.saveModelToDatabase(user);

        send(res, user);
    }

    private void openChest(User user, int index){

        ChestModel chestModel = chestService.getModelFromCache(user);

        ResponseChestOpen res = chestService.open(chestModel, index);

        chestService.saveModelToDatabase(user);

        send(res, user);
    }

    private void cheatChest(User user){
        ChestModel chestModel = chestService.getModelFromCache(user);

        ResponseChestCheat res = chestService.cheatChest(chestModel);
        chestService.saveModelToDatabase(user);

        send(res, user);
    }

    private void userDisconnect(User user){
        // log user disconnect
    }

    private void userChangeName(User user, String name){
        List<User> allUser = BitZeroServer.getInstance().getUserManager().getAllUsers();
        for(User aUser : allUser){
            // notify user's change
        }
    }

}
