/**
 * @author huynv6
 */
package model.user.card;

import config.user.CardConfig;
import model.user.base.AbstractUserModel;

public class CardModel extends AbstractUserModel {

    public Card[] listCard = new Card[CardConfig.numberCard];
    public int[] listCardUsing = new int[CardConfig.numberCardUsing];

    public CardModel(int uid){

        super(uid);

        for (int id : CardConfig.listIdInit){
            listCard[id] = new Card(CardConfig.listIdInit[id], CardConfig.initCard[0], CardConfig.initCard[1]);
        }

        for (int i = 0 ; i < CardConfig.numberCardUsing; i++){
            listCardUsing[i] = CardConfig.initListCardUsingId[i];
        }
    }
}
