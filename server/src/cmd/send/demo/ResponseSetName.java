package cmd.send.demo;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

/**
 * Created by hieupt on 11/8/18.
 */
public class ResponseSetName extends BaseMsg {
    private String name;
    public ResponseSetName(short error, String name) {
        super(CmdDefine.SET_NAME, error);
        this.name = name;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        putStr(bf, name);
        return packBuffer(bf);
    }

    public String getName(){
        return name;
    }
}
