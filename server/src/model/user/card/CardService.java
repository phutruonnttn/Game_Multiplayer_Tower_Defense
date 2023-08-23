/**
 *
 * @author huynv6
 *
 */
package model.user.card;

import Constant.CardError;
import Constant.InventoryError;
import bitzero.server.entities.User;
import cmd.response.card.ResponseCardChange;
import cmd.response.card.ResponseCardCheat;
import cmd.response.card.ResponseCardGetInfo;
import cmd.response.card.ResponseCardUpgrade;
import config.user.CardConfig;
import model.user.base.BaseService;
import model.user.player.PlayerModel;
import model.user.player.PlayerService;
import util.RandomNumber;
import util.server.ServerConstant;

import java.util.ArrayList;

public class CardService extends BaseService {

    private static CardService cardService = null;
    private CardService(){};

    public static CardService getInstance(){

        if(cardService == null){
            cardService = new CardService();
        }

        return cardService;
    }

    /**
     *
     * @param cardModel
     * @return
     * lay thong tin ve card cua user bao gom danh sach the chien dau vaf danh sach the so huu
     */
    public ResponseCardGetInfo getData(CardModel cardModel){

        int l1 = cardModel.listCard.length;
        int l2 = cardModel.listCardUsing.length;

        return new ResponseCardGetInfo(l1, cardModel.listCard, l2, cardModel.listCardUsing);

    }

    @Override
    public CardModel getModelFromCache(User user){

        return (CardModel) user.getProperty(ServerConstant.PLAYER_CARD);
    }

    /**
     *
     * @param cardModel
     * @param cardId
     * @param targetIndex
     * @return
     * thuc hien chon 1 the bai vao danh sach the chien dau
     */
    public ResponseCardChange changeCard(CardModel cardModel, int cardId, int targetIndex){

            if(!checkCardExist(cardId)){
                return new ResponseCardChange(CardError.CARD_NOT_EXIST);
            }

            if(!checkTargetIndex(targetIndex)){
                return new ResponseCardChange(CardError.CARD_INDEX_INVALID);
            }

            if(!checkOwnedCard(cardModel, cardId)){
                return new ResponseCardChange(CardError.CARD_NOT_OWNED);
            }

            if(checkCardUsed(cardModel, cardId)){
                return  new ResponseCardChange(CardError.CARD_USED);
            }

            cardModel.listCardUsing[targetIndex] = cardId;

            return new ResponseCardChange(CardError.CARD_SUCCESS);
    }

    /**
     *
     * @param cardModel
     * @param cardId id cua card
     * @param amount so luong manh the
     * @return
     * them manh the cua 1 loai the bai
     */
    public void addCardPiece(CardModel cardModel, int cardId, int amount){

        if(cardModel.listCard[cardId] == null){
            cardModel.listCard[cardId] = new Card(cardId, CardConfig.initCard[0], CardConfig.initCard[1]);
        }

        cardModel.listCard[cardId].amount += amount;
    }

    public ResponseCardCheat cheatCard(CardModel cardModel, int cardId, int amount){
        addCardPiece(cardModel, cardId, amount);
        return  new ResponseCardCheat(CardError.CARD_SUCCESS);
    }

    /**
     *
     * @param cardModel
     * @param cardId
     * @param playerModel
     * @return
     *
     */
    public ResponseCardUpgrade upgradeCard(CardModel cardModel, int cardId, PlayerModel playerModel){

        if(!checkCardExist(cardId)){
            return new ResponseCardUpgrade(CardError.CARD_NOT_EXIST);
        }

        if(!checkOwnedCard(cardModel, cardId)){
            return new ResponseCardUpgrade(CardError.CARD_NOT_OWNED);
        }

        int nextLevel = cardModel.listCard[cardId].level + 1;
        if(nextLevel > CardConfig.levelCardMax){
            return new ResponseCardUpgrade(CardError.CARD_MAX_LEVEL);
        }

        int costPiece = CardConfig.costUpgrade[nextLevel][0];
        if(cardModel.listCard[cardId].amount < costPiece){
            return  new ResponseCardUpgrade(CardError.CARD_NOT_ENOUGH_PIECE);
        }

        PlayerService playerService = PlayerService.getInstance();
        int costGold = CardConfig.costUpgrade[nextLevel][1];
        int status = playerService.subGold(playerModel, costGold);
        if(status != InventoryError.INVENTORY_SUCCESS){
            return new ResponseCardUpgrade(InventoryError.INVENTORY_GOLD_NOT_ENOUGH);
        }

        cardModel.listCard[cardId].amount -= costPiece;
        cardModel.listCard[cardId].level = nextLevel;

        return new ResponseCardUpgrade(CardError.CARD_SUCCESS);
    }

    /**
     *
     * @return
     * lay ngau nhien id cua 1 loai the bai
     */
    public int getRandomCardId(){
        return RandomNumber.getNumberInRange(0, CardConfig.numberCard-1);
    }

    /**
     *
     * @param cardModel
     * @param numberCard
     * @return
     * lay ve danh sach id card ma user chua dat cap toi da , thu tu cac card la ngau nhien
     */
    public ArrayList<Integer> getListCardNotFull(CardModel cardModel , int numberCard){

        int [] randomIndexArr = RandomNumber.getRangeShuffle(cardModel.listCard.length - 1);
        ArrayList<Integer> result = new ArrayList<Integer>();
        for (int i = 0; i < randomIndexArr.length; i++){
            if(numberCard <= 0){
                break;
            }
            Card card = cardModel.listCard[randomIndexArr[i]];
            if(card == null || card.level < CardConfig.levelCardMax){
                result.add(card.id);
                numberCard--;
            }
        }
        return result;
    }

    /**
     *
     * @param cardId
     * @return
     * kiem tra id card co ton tai
     */
    private boolean checkCardExist(int cardId){

        if(cardId < 0 || cardId >= CardConfig.systemCard.length){
            return false;
        }

        return true;
    }

    /**
     *
     * @param index
     * @return
     * kiem tra vi tri card hop le
     */
    private boolean checkTargetIndex(int index){

        if(index < 0 || index >= CardConfig.numberCardUsing){
            return  false;
        }

        return true;
    }

    /**
     *
     * @param cardModel
     * @param cardId
     * @return
     * kiem tra user co so huu card co id la cardId
     */
    private boolean checkOwnedCard(CardModel cardModel, int cardId){

        if(cardModel.listCard[cardId] != null){
            return true;
        }

        return false;
    }

    /**
     *
     * @param cardModel
     * @param cardId
     * @return
     * kiem tra card da nam trong danh sach card chien dau hay chua
     */
    private boolean checkCardUsed(CardModel cardModel, int cardId){

        for(int id : cardModel.listCardUsing){
            if(cardId == id){
                return true;
            }
        }

        return false;
    }
}
