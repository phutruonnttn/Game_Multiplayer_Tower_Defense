package cmd.send.demo;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.awt.*;
import java.nio.ByteBuffer;

public class ResponseMove extends BaseMsg {
    private Point pos;
    public ResponseMove(short error, Point pos) {
        super(CmdDefine.MOVE, error);
        this.pos = pos;
    }
    
    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();
        bf.putInt(pos.x);
        bf.putInt(pos.y);
        return packBuffer(bf);
    }

    public Point getPos(){
        return pos;
    }
}
