package cmd.response.player;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseCheatGem extends BaseMsg {

    public ResponseCheatGem(int err){
        super(CmdDefine.GEM_CHEAT, err);
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        return packBuffer(bf);
    }
}
