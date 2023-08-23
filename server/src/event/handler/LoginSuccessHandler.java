package event.handler;

import bitzero.server.core.BZEvent;
import bitzero.server.core.BZEventParam;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.BaseServerEventHandler;
import bitzero.server.extensions.ExtensionLogLevel;
import bitzero.util.ExtensionUtility;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import model.user.Shop.ShopModel;
import model.user.card.CardModel;
import model.user.chest.ChestModel;
import model.user.player.PlayerModel;
import util.server.ServerConstant;

import java.util.HashMap;
import java.util.Map;

public class LoginSuccessHandler extends BaseServerEventHandler {
    public LoginSuccessHandler() {
        super();
    }

    public void handleServerEvent(IBZEvent iBZEvent) {
        this.onLoginSuccess((User) iBZEvent.getParameter(BZEventParam.USER));
    }

    /**
     * @param user
     * description: after login successful to server, core framework will dispatch this event
     */
    private void onLoginSuccess(User user) {
        trace(ExtensionLogLevel.DEBUG, "On Login Success ", user.getId());
        CardModel cardModel = null;
        ShopModel shopModel = null;
        ChestModel chestModel = null;
        PlayerModel playerModel = null;

        try {
            playerModel = (PlayerModel) PlayerModel.getModel(user.getId(), PlayerModel.class);
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (playerModel==null){
            cardModel = new CardModel(user.getId());
            playerModel = new PlayerModel(user.getId(), "user_" + user.getId());
            shopModel = new ShopModel(user.getId());
            chestModel = new ChestModel(user.getId());
            try {
                cardModel.save();
                playerModel.save();
                shopModel.save();
                chestModel.save();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }else {
            try {
                cardModel = (CardModel) CardModel.getModel(user.getId(), CardModel.class);
                shopModel = (ShopModel) ShopModel.getModel(user.getId(), ShopModel.class);
                playerModel = (PlayerModel) PlayerModel.getModel(user.getId(), PlayerModel.class);
                chestModel = (ChestModel) ChestModel.getModel(user.getId(), ChestModel.class);
            }catch (Exception e){
                e.printStackTrace();
            }
        }

        /**
         * cache playerinfo in RAM
         */
        user.setProperty(ServerConstant.PLAYER_SHOP, shopModel);
        user.setProperty(ServerConstant.PLAYER_CARD, cardModel);
        user.setProperty(ServerConstant.PLAYER_CHEST, chestModel);
        user.setProperty(ServerConstant.PLAYER, playerModel);
        /**
         * send login success to client
         * after receive this message, client begin to send game logic packet to server
         */
        ExtensionUtility.instance().sendLoginOK(user);
        
        /**
         * dispatch event here
         */
        Map evtParams = new HashMap();
        evtParams.put(DemoEventParam.USER, user);
        evtParams.put(DemoEventParam.NAME, user.getName());
        ExtensionUtility.dispatchEvent(new BZEvent(DemoEventType.LOGIN_SUCCESS, evtParams));

    }

}
