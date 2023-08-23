package cmd.send.demo;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import model.user.PlayerInfo;

import java.nio.ByteBuffer;

public class ResponseRequestUserInfo extends BaseMsg {
    public PlayerInfo info;
    public ResponseRequestUserInfo(PlayerInfo _info) {
        super(CmdDefine.GET_USER_INFO);
        info = _info;
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = makeBuffer();

        return packBuffer(bf);
    }
}
