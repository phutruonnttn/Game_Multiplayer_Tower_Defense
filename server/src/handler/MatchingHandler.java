package handler;

import Constant.MatchingError;
import bitzero.server.BitZeroServer;
import bitzero.server.core.BZEventParam;
import bitzero.server.core.BZEventType;
import bitzero.server.core.IBZEvent;
import bitzero.server.entities.User;
import bitzero.server.extensions.BaseClientRequestHandler;
import bitzero.server.extensions.data.DataCmd;
import cmd.CmdDefine;
import cmd.response.matching.ResponseCancelMatching;
import cmd.response.matching.ResponseFindMatch;
import config.user.CardConfig;
import event.eventType.DemoEventParam;
import event.eventType.DemoEventType;
import extension.FresherExtension;
import model.battle.map.MapBattle;
import model.matching.UserInMatching;
import model.user.card.Card;
import model.user.card.CardModel;
import model.user.card.CardService;
import model.user.player.PlayerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import util.battle.BattleUtils;

import java.util.*;

public class MatchingHandler extends BaseClientRequestHandler {
    public static short MULTI_IDS = 3000;

    private final Logger logger = LoggerFactory.getLogger("MatchingHandler");
    private PlayerService playerService = PlayerService.getInstance();
    public static TreeSet<UserInMatching> queueUser = new TreeSet<>();
    public static Map<User, UserInMatching> mapUserToUserInMatching = new HashMap<>();
    public static Map<Integer, Boolean> mapExistFameInQueue = new HashMap<>();
    private static MatchingHandler single_instance = null;

    public MatchingHandler() {
        super();
        single_instance = this;
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

    private void userDisconnect(User user){
        // Xoa user khoi queue
        System.out.println("Disconnect: User " + user.getId());
        UserInMatching userInMatching = mapUserToUserInMatching.get(user);
        if (userInMatching != null) {
            queueUser.remove(userInMatching);
            mapExistFameInQueue.remove(playerService.getModelFromCache(user).getFame());
            mapUserToUserInMatching.remove(user);
            userInMatching.cancelLoop();
        }
    }

    private void userChangeName(User user, String name){
        List<User> allUser = BitZeroServer.getInstance().getUserManager().getAllUsers();
        for(User aUser : allUser){
            // notify user's change
        }
    }

    @Override
    public void handleClientRequest(User user, DataCmd dataCmd) {
        synchronized (queueUser) {
            try{
                switch (dataCmd.getId()){
                    case CmdDefine.MATCHING:{
                        matchingHandle(user);
                        break;
                    }
                    case CmdDefine.CANCEL_MATCHING:{
                        cancelMatching(user);
                        break;
                    }
                }
            } catch (Exception e){
                e.printStackTrace();
            }
        }
    }

    public void cancelMatching(User user) {
        System.out.print("User " + user.getId() + " huy tran: ");
        UserInMatching userInMatching = mapUserToUserInMatching.get(user);
        boolean flag = false;
        if (userInMatching != null) {
            flag = queueUser.remove(userInMatching);
        }

        ResponseCancelMatching responseCancelMatching;
        if (flag) {
            // Huy thanh cong
            System.out.println("Thanh cong");
            mapExistFameInQueue.remove(playerService.getModelFromCache(user).getFame());
            mapUserToUserInMatching.remove(user);
            userInMatching.cancelLoop();
            responseCancelMatching = new ResponseCancelMatching(MatchingError.MATCHING_SUCCESS);
        } else {
            // User da vao tran
            System.out.println("That bai");
            responseCancelMatching = new ResponseCancelMatching(MatchingError.ALREADY_IN_MATCH);
        }
        send(responseCancelMatching,user);
    }

    public void matchingHandle(User user) {
        int userFame = playerService.getModelFromCache(user).getFame();

        // Neu ton tai user cung fame trong queue
        if (mapExistFameInQueue.get(userFame) != null) {
            // Lay user bang fame trong queue ra de ghep tran
            UserInMatching userInMatching = new UserInMatching(user, userFame - 0.5, false);
            UserInMatching userInQueue = queueUser.higher(userInMatching);
            System.out.println("User " + user.getId() + " joined queue!");

            // Create tran
            createBattle(user,userInQueue.user);
            removeUserInMatching(userInQueue);
        } else {
            // Add vao queue
            UserInMatching userInMatching = new UserInMatching(user, userFame, true);
            mapExistFameInQueue.put(userFame, true);
            mapUserToUserInMatching.put(user, userInMatching);
            queueUser.add(userInMatching);
            findMatch(userInMatching);
        }
    }

    public void findMatch(UserInMatching userInMatching) {
        // Show user in queue
        synchronized (queueUser) {
            System.out.println("-----User in queue-----");
            System.out.println("User ID - Fame - Range fame");
            for (UserInMatching user : queueUser) {
                System.out.println(user.user.getId() + " - " + user.fame + " - " + user.rangeFame);
            }
            System.out.println("-----------------------\n");
        }

        // Lay ra user co fame lon hon va nho hon ngay canh user nay
        UserInMatching lowerUser = queueUser.lower(userInMatching);
        UserInMatching higherUser = queueUser.higher(userInMatching);

        // Uu tien ghep voi user co fame nho hon
        if (lowerUser != null) {
            double distanceFame = userInMatching.fame - lowerUser.fame;
            if (distanceFame <= Math.max(userInMatching.rangeFame, lowerUser.rangeFame)) {
                createBattle(lowerUser.user, userInMatching.user);
                removeUserInMatching(lowerUser);
                removeUserInMatching(userInMatching);
                return;
            }
        }

        if (higherUser != null) {
            double distanceFame = higherUser.fame - userInMatching.fame;
            if (distanceFame <= Math.max(userInMatching.rangeFame, higherUser.rangeFame)) {
                createBattle(higherUser.user,userInMatching.user);
                removeUserInMatching(higherUser);
                removeUserInMatching(userInMatching);
            }
        }
    }

    public void removeUserInMatching(UserInMatching userInMatching) {
        mapExistFameInQueue.remove(playerService.getModelFromCache(userInMatching.user).getFame());
        queueUser.remove(userInMatching);
        mapUserToUserInMatching.remove(userInMatching.user);
        userInMatching.cancelLoop();
    }

    public void createBattle(User user1, User user2) {
        System.out.println("Matching: " + user1.getId() + " vs " + user2.getId());
        MapBattle mapBattle1 = new MapBattle();
        MapBattle mapBattle2 = new MapBattle();

        int[] listDeskCard = new int[CardConfig.numberCardUsing];
        for (int i = 0; i < CardConfig.numberCardUsing; i++) {
            listDeskCard[i] = i;
        }

        // Shuffle list card of client 1
        int[] arrayIndexSuffle = Arrays.copyOf(BattleUtils.getInstance().shuffleArray(listDeskCard), CardConfig.numberCardUsing);
        int[] listDeskCard1 = new int[CardConfig.numberCardUsing];
        int[] listLevelDeskCard1 = new int[CardConfig.numberCardUsing];
        CardModel cardModel1 = CardService.getInstance().getModelFromCache(user1);
        for (int i = 0; i < CardConfig.numberCardUsing; i++) {
            Card card = cardModel1.listCard[cardModel1.listCardUsing[arrayIndexSuffle[i]]];
            listDeskCard1[i] = card.id;
            listLevelDeskCard1[i] = card.level;
        }

        // Shuffle list card of client 2
        arrayIndexSuffle = Arrays.copyOf(BattleUtils.getInstance().shuffleArray(listDeskCard), CardConfig.numberCardUsing);
        int[] listDeskCard2 = new int[CardConfig.numberCardUsing];
        int[] listLevelDeskCard2 = new int[CardConfig.numberCardUsing];
        CardModel cardModel2 = CardService.getInstance().getModelFromCache(user2);
        for (int i = 0; i < CardConfig.numberCardUsing; i++) {
            Card card = cardModel2.listCard[cardModel2.listCardUsing[arrayIndexSuffle[i]]];
            listDeskCard2[i] = card.id;
            listLevelDeskCard2[i] = card.level;
        }

        // Generate random seed
        int randomSeed = (int)(Math.random()* Math.pow(2,16));

        // send response to client 1
        ResponseFindMatch responseFindMatch1 = new ResponseFindMatch(
                playerService.getModelFromCache(user2).getName(),
                playerService.getModelFromCache(user2).getFame(),
                randomSeed,
                listDeskCard1,listLevelDeskCard1,
                listDeskCard2,listLevelDeskCard2,
                mapBattle1, mapBattle2
        );
        send(responseFindMatch1,user1);

        // send response to client 2
        ResponseFindMatch responseFindMatch2 = new ResponseFindMatch(
                playerService.getModelFromCache(user1).getName(),
                playerService.getModelFromCache(user1).getFame(),
                randomSeed,
                listDeskCard2, listLevelDeskCard2,
                listDeskCard1, listLevelDeskCard1,
                mapBattle2, mapBattle1
        );
        send(responseFindMatch2,user2);

        BattleHandler.getInstance().createBattle(
                randomSeed,
                user1, mapBattle1, listDeskCard1,
                user2, mapBattle2, listDeskCard2
        );
    }

    public static MatchingHandler getInstance() {
        if (single_instance == null) {
            single_instance = new MatchingHandler();
        }
        return single_instance;
    }
}
