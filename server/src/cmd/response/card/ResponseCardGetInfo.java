package cmd.response.card;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import model.user.card.Card;

import java.nio.ByteBuffer;

public class ResponseCardGetInfo extends BaseMsg {

    private int numberCard;
    private Card[] listCard;
    private int numberCardUsing;
    private int[] listCardUsing;

    public ResponseCardGetInfo(int numberCard, Card[] listCard, int numberCardUsing, int[] listCardUsing) {
        super(CmdDefine.CARD_INFO);
        this.numberCard = numberCard;
        this.listCard = listCard;
        this.numberCardUsing = numberCardUsing;
        this.listCardUsing = listCardUsing;
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        bf.putInt(numberCard);
        for(int i = 0; i < numberCard; i++){
            bf.putInt(listCard[i].getId());
            bf.putInt(listCard[i].getLevel());
            bf.putInt(listCard[i].getAmount());
        }
        bf.putInt(numberCardUsing);
        for (int i = 0; i < numberCardUsing; i++){
            bf.putInt(listCardUsing[i]);
        }
        return packBuffer(bf);
    }

}
