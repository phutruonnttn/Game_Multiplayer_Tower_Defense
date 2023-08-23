package battle;

import model.user.card.Card;
import bitzero.server.entities.User;
import config.user.CardConfig;
import model.user.card.CardModel;
import model.user.card.CardService;

public class DeskCardMgr {
    public int index;
    public int numberOfCard;
    public Card[] listCard;
    public boolean[] isShowed;
    
    public DeskCardMgr(User user, int[] listDeskCard) {
        index = -1;
        numberOfCard = CardConfig.numberCardUsing;
        listCard = new Card[numberOfCard];
        isShowed = new boolean[numberOfCard];

        // Load list card from user
        CardModel cardModel = CardService.getInstance().getModelFromCache(user);
        for (int i = 0; i < cardModel.listCardUsing.length; i++) {
            listCard[i] = cardModel.listCard[listDeskCard[i]];
        }

        for (int i = 0; i < numberOfCard; i++) {
            isShowed[i] = false;
        }

        for (int i = 0; i < 4; i++) {
            getNextIndex();
        }
    }

    public int getNextIndex() {
        do { 
            index = (index + 1) % numberOfCard;
        } while (isShowed[index]);
        isShowed[index] = true;
        return index;
    }

    public void hideCard(int index) {
        isShowed[index] = false;
    }
}
