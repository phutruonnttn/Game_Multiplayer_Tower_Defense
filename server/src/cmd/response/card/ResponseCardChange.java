package cmd.response.card;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseCardChange extends BaseMsg {

    public ResponseCardChange(int err){
        super(CmdDefine.CARD_CHANGE, err);
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        return packBuffer(bf);
    }
}
