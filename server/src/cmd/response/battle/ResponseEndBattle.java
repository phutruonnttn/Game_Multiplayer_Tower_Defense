package cmd.response.battle;

import bitzero.server.entities.User;
import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import config.battle.BattleConfig;
import model.user.chest.ChestModel;
import model.user.chest.ChestService;
import model.user.player.PlayerModel;
import model.user.player.PlayerService;

import java.nio.ByteBuffer;

public class ResponseEndBattle extends BaseMsg {

    public final int winner;
    public final int frameEnd;
    public final int amountFame;

    public User user;

    public ResponseEndBattle(int winner, int frameEnd, User user) {
        super(CmdDefine.END_BATTLE);
        this.user = user;
        this.winner = winner;
        this.frameEnd = frameEnd;
        PlayerModel playerModel = PlayerService.getInstance().getModelFromCache(this.user);
        switch (winner) {
            case (BattleConfig.RESULT_WIN):
                this.amountFame = BattleConfig.FAME_CHANGE;
                break;
            case (BattleConfig.RESULT_LOSE):
                this.amountFame = -Math.min(playerModel.getFame(), BattleConfig.FAME_CHANGE);
                break;
            case (BattleConfig.RESULT_DRAW):
                this.amountFame = 0;
                break;
            default:
                this.amountFame = 0;
        }
    }

    @Override
    public byte[] createData() {
        ByteBuffer bf = this.makeBuffer();
        bf.putInt(this.winner);
        bf.putInt(this.frameEnd);
        bf.putInt(this.amountFame);
        return this.packBuffer(bf);
    }
}
