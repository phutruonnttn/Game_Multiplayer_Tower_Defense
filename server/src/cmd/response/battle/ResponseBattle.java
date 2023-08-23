package cmd.response.battle;

import Constant.BattleError;
import battle.model.BattleAction;
import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import cmd.request.battle.RequestBattleAction;
import config.battle.SynchronizeConfig;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ResponseBattle extends BaseMsg {
    public int loopMax;
    public List<BattleAction> listActionResponse;

    public ResponseBattle(int loopMax, List<BattleAction> listActionResponse) {
        super(CmdDefine.LOOP_MAX);
        this.loopMax = loopMax;
        this.listActionResponse = new ArrayList<>(listActionResponse);
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        bf.putInt(loopMax);
        bf.putInt(loopMax - SynchronizeConfig.DELAY_FRAME + 1);
        bf.putInt(listActionResponse.size());
        for (int i = 0; i < listActionResponse.size(); i++) {
            BattleAction actionResponse = listActionResponse.get(i);
            bf.putInt(actionResponse.cmdID);
            bf.putInt(actionResponse.user.getId());
            bf.putInt(actionResponse.errorCode);
            if (actionResponse.errorCode == BattleError.SUCCESS) {
                RequestBattleAction actionArguments = actionResponse.actionArguments;
                switch (actionResponse.cmdID) {
                    case CmdDefine.SUMMON_SYSTEM_MONSTER: {
                        break;
                    }
                    case CmdDefine.DROP_MONSTER:
                    case CmdDefine.CANCEL_CARD: {
                        bf.putInt(actionArguments.indexCard);
                        break;
                    }
                    case CmdDefine.DROP_SPELL: {
                        bf.putInt(actionArguments.indexCard);
                        bf.putInt(actionArguments.coordinateX);
                        bf.putInt(actionArguments.coordinateY);
                        bf.putInt(actionArguments.map);
                        break;
                    }
                    case CmdDefine.DROP_TOWER: {
                        bf.putInt(actionArguments.indexCard);
                        bf.putInt(actionArguments.coordinateX);
                        bf.putInt(actionArguments.coordinateY);
                        break;
                    }
                    case CmdDefine.TARGET_OBSTACLE: {
                        bf.putInt(actionArguments.coordinateX);
                        bf.putInt(actionArguments.coordinateY);
                        break;
                    }
                    case CmdDefine.CANCEL_TOWER: {
                        bf.putInt(actionArguments.coordinateX);
                        bf.putInt(actionArguments.coordinateY);
                        break;
                    }
                    case CmdDefine.CHANGE_TARGET_TOWER: {
                        bf.putInt(actionArguments.coordinateX);
                        bf.putInt(actionArguments.coordinateY);
                        bf.putInt(actionArguments.targetMode);
                        break;
                    }
                    case CmdDefine.END_BATTLE: {
                        // TODO
                        break;
                    }
                }
            }
        }

        return packBuffer(bf);
    }
}
