/**
 * @author huynv6
 */

package model.user.chest;

import Constant.ChestError;
import Constant.InventoryError;
import bitzero.server.entities.User;
import cmd.response.chest.ResponseChestCheat;
import cmd.response.chest.ResponseChestGetGift;
import cmd.response.chest.ResponseChestGetInfo;
import cmd.response.chest.ResponseChestOpen;
import config.user.ChestConfig;
import model.user.base.BaseService;
import model.user.card.CardModel;
import model.user.card.CardService;
import model.user.player.PlayerModel;
import model.user.player.PlayerService;
import util.RandomNumber;
import util.TimeUtil;
import util.server.ServerConstant;

public class ChestService extends BaseService {

    private static ChestService chestHandler = null;

    public static ChestService getInstance(){

        if(chestHandler == null){
            chestHandler = new ChestService();
        }

        return chestHandler;
    }

    /**
     *
     * @param chestModel
     * @return
     * lay thong tin ve chest
     */
    public ResponseChestGetInfo getData(ChestModel chestModel) {

        int numberChest = chestModel.numberChest;
        Chest[] listChest = new Chest[numberChest];
        int k = 0;
        for (Chest chest:chestModel.listChest){
            if(chest != null){
                listChest[k++] = chest;
            }
        }

        int unlockIndex = chestModel.openIndex;
        int waitingTime = (int)(chestModel.timeToOpen - TimeUtil.getCurTimeSecond());

        return new ResponseChestGetInfo(numberChest, listChest, unlockIndex, waitingTime);
    }

    @Override
    public ChestModel getModelFromCache(User user){

        try {
            return (ChestModel) user.getProperty(ServerConstant.PLAYER_CHEST);
        }catch (Exception e){
            e.printStackTrace();
        }

        return null;
    }

    /**
     *
     * @param chestModel
     * @param index
     * @return
     * yeu cau mo khoa ruong co vi tri la index
     */
    public ResponseChestOpen open(ChestModel chestModel, int index){

        if(chestModel.openIndex != -1){
            if(chestModel.timeToOpen - TimeUtil.getCurTimeSecond() <= 0){
                chestModel.listChest[chestModel.openIndex].status = 1;
                chestModel.openIndex = -1;
                chestModel.timeToOpen = 0;
            }
            else
                return new ResponseChestOpen(ChestError.CHEST_OPENING);
        }

        if(index < 0 || index + 1 > ChestConfig.numberSlot || chestModel.listChest[index] == null){
            return new ResponseChestOpen(ChestError.CHEST_NOT_EXIST);
        }

        chestModel.openIndex = index;
        chestModel.timeToOpen = ChestConfig.waitingTime + TimeUtil.getCurTimeSecond();

        return new ResponseChestOpen(ChestError.CHEST_SUCCESS, (int)chestModel.timeToOpen);

    }

    /**
     *
     * @param chestModel
     * @param inventory
     * @param cardModel
     * @param index
     * @return
     * lay qua trong ruong ra neu ruong van con thoi gian thi tru gem
     */
    public ResponseChestGetGift getGiftChest(ChestModel chestModel, PlayerModel inventory, CardModel cardModel, int index){

        PlayerService playerService = PlayerService.getInstance();

        if(index < 0 || index + 1 > ChestConfig.numberSlot || chestModel.listChest[index] == null){
            return new ResponseChestGetGift(ChestError.CHEST_NOT_EXIST);
        }

        int gemToOpen;
        if(index == chestModel.openIndex){
            gemToOpen = getGemForOpenChest((int)(chestModel.timeToOpen - TimeUtil.getCurTimeSecond()));
        }else {
            if(chestModel.listChest[index].status == 0){
                gemToOpen = getGemForOpenChest(ChestConfig.waitingTime);
            }else {
                gemToOpen = 0;
            }
        }

        int status = playerService.subGem(inventory, gemToOpen);
        if(status != InventoryError.INVENTORY_SUCCESS){
            return new ResponseChestGetGift(InventoryError.INVENTORY_GEM_NOT_ENOUGH);
        }

        chestModel.listChest[index] = null;
        chestModel.numberChest -= 1;

        if(index == chestModel.openIndex){
            chestModel.openIndex = -1;
        }

        int [] result = addChestReward(inventory, cardModel);

        return new ResponseChestGetGift(result[0], result[1], result[2], result[3], result[4], result[5]);
    }

    /**
     *
     * @param inventory
     * @param cardModel
     * @return
     * sinh qua trong ruong va them vao resource cua user
     */
    public int[] addChestReward(PlayerModel inventory, CardModel cardModel){

        PlayerService playerService = PlayerService.getInstance();

        int gold = getGoldFromChest();
        playerService.addGold(inventory, gold);

        int[] listCard = getListCardFromChest();
        CardService cardService = CardService.getInstance();

        cardService.addCardPiece(cardModel, listCard[0], listCard[1]);
        cardService.addCardPiece(cardModel, listCard[2], listCard[3]);

        return new int[]{InventoryError.INVENTORY_SUCCESS, gold ,listCard[0], listCard[1], listCard[2], listCard[3]};

    }

    /**
     *
     * @param chestModel
     * @return
     * them chest vao list chest theo thu tu trai qua phai vao o trong
     */
    public int addChest(ChestModel chestModel){

        if(chestModel.numberChest >= ChestConfig.numberSlot){
            return ChestError.CHEST_SLOT_IS_FULL;
        }

        for (int i = 0; i < ChestConfig.numberSlot; i++){
            if(chestModel.listChest[i] == null){
                chestModel.listChest[i] = new Chest(i);
                break;
            }
        }

        chestModel.numberChest ++;
        return ChestError.CHEST_SUCCESS;

    }

    /**
     *
     * @param chestModel
     * @return
     * them chest
     */
    public ResponseChestCheat cheatChest(ChestModel chestModel){
        int err = addChest(chestModel);
        return new ResponseChestCheat(err);
    }

    private int getGemForOpenChest(int waitingTime){

        if(waitingTime < 0) {
            return 0;
        }

        return (int)Math.ceil(1.0 * waitingTime/ChestConfig.timePerGem);
    }

    /**
     * lay ngau nhien so vang trong chest
     * @return
     */
    private int getGoldFromChest(){

        return RandomNumber.getNumberInRange(ChestConfig.goldMin, ChestConfig.goldMax);
    }

    /**
     *
     * @return
     * sinh card trong chest
     */
    private int[] getListCardFromChest(){

        CardService cardService = CardService.getInstance();

        int cardId1 = cardService.getRandomCardId();
        int amount1 = RandomNumber.getNumberInRange(ChestConfig.numberPieceMin, ChestConfig.numberPieceMax);

        int cardId2 = cardService.getRandomCardId();
        int amount2 = RandomNumber.getNumberInRange(ChestConfig.numberPieceMin, ChestConfig.numberPieceMax);

        return new int[]{cardId1, amount1 ,cardId2 , amount2};
    }
}
