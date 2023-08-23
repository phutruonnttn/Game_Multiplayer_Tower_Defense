package handler;

import battle.BattleLoopMgr;
import config.battle.SynchronizeConfig;

public class LoopBattleHandle implements Runnable {
    public BattleLoopMgr battleLoopMgr;

    public LoopBattleHandle(BattleLoopMgr battleLoopMgr) {
        this.battleLoopMgr = battleLoopMgr;
    }

    @Override
    public void run() {
        battleLoopMgr.runUpdateLoop(SynchronizeConfig.DELAY_FRAME);
    }
}
