package cmd.response.matching;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponseCancelMatching extends BaseMsg {
    public int codeError;

    public ResponseCancelMatching(int codeError) {
        super(CmdDefine.CANCEL_MATCHING);
        this.codeError = codeError;
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        bf.putInt(codeError);
        return packBuffer(bf);
    }
}
