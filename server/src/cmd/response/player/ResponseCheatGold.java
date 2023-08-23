package cmd.response.player;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseCheatGold extends BaseMsg {

    public ResponseCheatGold(int err){
        super(CmdDefine.GOLD_CHEAT, err);
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        return packBuffer(bf);
    }

}
