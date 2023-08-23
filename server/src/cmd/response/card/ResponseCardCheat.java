package cmd.response.card;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseCardCheat extends BaseMsg {

    public ResponseCardCheat(int err){
        super(CmdDefine.CARD_CHEAT, err);
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        return packBuffer(bf);
    }

}
