package cmd.response.chest;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseChestCheat extends BaseMsg {

    public ResponseChestCheat(int err){
        super(CmdDefine.CHEST_CHEAT, err);
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        return packBuffer(bf);
    }
}
