package cmd.response.card;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseCardUpgrade extends BaseMsg {

    public ResponseCardUpgrade(int err){
        super(CmdDefine.CARD_UPGRADE, err);
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        return packBuffer(bf);
    }
}
