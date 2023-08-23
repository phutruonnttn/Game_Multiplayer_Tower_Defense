package cmd.response.chest;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseChestOpen extends BaseMsg {

    int timeOpen;

    public ResponseChestOpen(int err){
        super(CmdDefine.CHEST_OPEN, err);
    }

    public ResponseChestOpen(int err, int timeOpen){
        super(CmdDefine.CHEST_OPEN, err);
        this.timeOpen = timeOpen;
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        bf.putInt(timeOpen);

        return packBuffer(bf);
    }
}
