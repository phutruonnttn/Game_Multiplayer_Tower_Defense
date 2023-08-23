package cmd.response.chest;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import model.user.chest.Chest;

import java.nio.ByteBuffer;

public class ResponseChestGetInfo extends BaseMsg {

    int numberChest;
    Chest[] listChest;
    int unlockIndex;
    int waitingTime;

    public ResponseChestGetInfo(int numberChest, Chest[] listChest, int unlockIndex, int waitingTime) {
        super(CmdDefine.CHEST_INFO);
        this.numberChest = numberChest;
        this.listChest = listChest;
        this.unlockIndex = unlockIndex;
        this.waitingTime = waitingTime;
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();

        bf.putInt(numberChest);
        for (int i = 0; i < numberChest; i++){
            bf.putInt(listChest[i].getIndex());
            bf.putInt(listChest[i].getStatus());
        }

        bf.putInt(unlockIndex);
        bf.putInt(waitingTime);

        return packBuffer(bf);
    }

}
