package cmd.response.player;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;

import java.nio.ByteBuffer;

public class ResponsePlayerGetInfo extends BaseMsg {

    int level;
    int exp;
    int gem;
    int gold;
    int fame;
    String userName;

    public ResponsePlayerGetInfo(int level, int exp, int gem, int gold, int fame, String userName) {
        super(CmdDefine.PLAYER_INFO);
        this.level = level;
        this.exp = exp;
        this.gem = gem;
        this.gold = gold;
        this.fame = fame;
        this.userName = userName;
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        bf.putInt(level);
        bf.putInt(exp);
        bf.putInt(gem);
        bf.putInt(gold);
        bf.putInt(fame);
        putStr(bf, userName);

        return packBuffer(bf);
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
