package handler;

import battle.BattleLoopMgr;
import battle.BattleMgr;
import bitzero.server.BitZeroServer;
import bitzero.server.core.BZEventParam;
import bitzero.server.core.BZEventType;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.data.DataCmd;
import cmd.CmdDefine;
import cmd.request.battle.*;
import cmd.response.battle.ResponseBattle;
import cmd.response.battle.ResponseEndBattle;
import config.battle.BattleConfig;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import extension.FresherExtension;
import model.battle.map.MapBattle;
import model.user.chest.ChestService;
import model.user.player.PlayerModel;
import model.user.player.PlayerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import util.server.ServerConstant;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BattleHandler extends BaseClientRequestHandler {
    public static short MULTI_IDS = 4000;

    private static Map<Integer, BattleLoopMgr> mapBattle = new HashMap<Integer, BattleLoopMgr>();
    private final Logger logger = LoggerFactory.getLogger("BattleHandler");
    private static BattleHandler single_instance = null;

    public BattleHandler(){
        super();
        single_instance = this;
    }

    public static BattleHandler getInstance() {
        if (single_instance == null) {
            single_instance = new BattleHandler();
        }
        return single_instance;
    }

    private FresherExtension getExtension(){
        return (FresherExtension) getParentExtension();
    }

    public void init() {
        getExtension().addEventListener(BZEventType.USER_DISCONNECT, this);
        getExtension().addEventListener(BZEventType.USER_RECONNECTION_SUCCESS, this);

        /**
         *  register new event, so the core will dispatch event type to this class
         */
        getExtension().addEventListener(DemoEventType.CHANGE_NAME, this);
    }

    public void handleServerEvent(IBZEvent ibzevent){

        if (ibzevent.getType() == BZEventType.USER_DISCONNECT)
            this.userDisconnect((User) ibzevent.getParameter(BZEventParam.USER));
        else if (ibzevent.getType() == DemoEventType.CHANGE_NAME)
            this.userChangeName((User) ibzevent.getParameter(DemoEventParam.USER), (String)ibzevent.getParameter(DemoEventParam.NAME));
    }

    public void sendResponseBattle(ResponseBattle responseBattle, User user1, User user2) {
        send(responseBattle,user1);
        send(responseBattle,user2);
    }

    private void userDisconnect(User user){
        // log user disconnect
    }

    public void sendEndBattle(ResponseEndBattle responseEndBattle) {
        mapBattle.remove(responseEndBattle.user.getId());

        // Update Fame
        PlayerService.getInstance().addFame(responseEndBattle.amountFame, PlayerService.getInstance().getModelFromCache(responseEndBattle.user));
        PlayerService.getInstance().saveModelToDatabase(responseEndBattle.user);

        // Update Chest and save to DB
        if (responseEndBattle.winner == BattleConfig.RESULT_WIN) {
            ChestService.getInstance().addChest(ChestService.getInstance().getModelFromCache(responseEndBattle.user));
            ChestService.getInstance().saveModelToDatabase(responseEndBattle.user);
        }
        send(responseEndBattle, responseEndBattle.user);
    }

    private void userChangeName(User user, String name){
        List<User> allUser = BitZeroServer.getInstance().getUserManager().getAllUsers();
        for(User aUser : allUser){
            // notify user's change
        }
    }

    public void createBattle(int randomSeed, User user1, MapBattle mapBattle1, int[] listDeskCard1, User user2, MapBattle mapBattle2, int[] listDeskCard2) {
        BattleMgr battleMgr = new BattleMgr(
                randomSeed,
                user1,
                mapBattle1,
                listDeskCard1,
                user2,
                mapBattle2,
                listDeskCard2
        );
        BattleLoopMgr battleLoopMgr = new BattleLoopMgr(battleMgr);

        // Update list and map battle
        mapBattle.put(user1.getId(), battleLoopMgr);
        mapBattle.put(user2.getId(), battleLoopMgr);
   }

    @Override
    public void handleClientRequest(User user, DataCmd dataCmd) {
        synchronized (user.getProperty(ServerConstant.PLAYER)){
            try {
                switch (dataCmd.getId()){
                    case CmdDefine.SUMMON_SYSTEM_MONSTER:{
                        receiveBattleAction(user, dataCmd.getId(), null);
                        break;
                    }
                    case CmdDefine.DROP_MONSTER: {
                        receiveBattleAction(user, dataCmd.getId(), new RequestDropMonster(dataCmd));
                        break;
                    }
                    case CmdDefine.DROP_SPELL:{
                        receiveBattleAction(user, dataCmd.getId(), new RequestDropSpell(dataCmd));
                        break;
                    }
                    case CmdDefine.DROP_TOWER:{
                        receiveBattleAction(user, dataCmd.getId(), new RequestDropTower(dataCmd));
                        break;
                    }
                    case CmdDefine.TARGET_OBSTACLE:{
                        receiveBattleAction(user, dataCmd.getId(), new RequestTargetObstacle(dataCmd));
                        break;
                    }
                    case CmdDefine.CANCEL_TOWER:{
                        receiveBattleAction(user, dataCmd.getId(), new RequestCancelTower(dataCmd));
                        break;
                    }
                    case CmdDefine.CHANGE_TARGET_TOWER:{
                        receiveBattleAction(user, dataCmd.getId(), new RequestChangeTargetTower(dataCmd));
                        break;
                    }
                    case CmdDefine.CANCEL_CARD:{
                        receiveBattleAction(user, dataCmd.getId(), new RequestCancelCard(dataCmd));
                        break;
                    }
                }
            } catch (Exception e){
                e.printStackTrace();
            }
        }
    }

    public void receiveBattleAction(User user, int cmdID, RequestBattleAction actionArguments) {
        // Tran dau chua end moi nhan action
        if (mapBattle.get(user.getId()) != null) {
            mapBattle.get(user.getId()).battleMgr.addUserBattleAction(user, cmdID, actionArguments);
        }
    }
}
