package battle;

import bitzero.server.BitZeroServer;
import cmd.response.battle.ResponseBattle;
import cmd.response.battle.ResponseEndBattle;
import config.battle.BattleConfig;
import config.battle.SynchronizeConfig;
import handler.BattleHandler;
import handler.LoopBattleHandle;
import util.battle.BattleUtils;

import java.util.ArrayList;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

public class BattleLoopMgr {
    public BattleMgr battleMgr;
    public ScheduledFuture simulateLoop;
    public LoopBattleHandle loopBattleHandle;

    public BattleLoopMgr(BattleMgr battleMgr) {
        this.battleMgr = battleMgr;
        this.loopBattleHandle = new LoopBattleHandle(this);
        runSimulateLoopClient();
    }

    public void cancelSimulateLoopClient() {
        simulateLoop.cancel(true);
    }

    public void runSimulateLoopClient() {
        simulateLoop = BitZeroServer.getInstance().getTaskScheduler().schedule(
                this.loopBattleHandle,
                2,
                TimeUnit.SECONDS
        );
    }

    public void runUpdateLoop(int numberFrameToUpdate) {
        // Start time to run update loop
        long startTime = System.nanoTime();
        for (int i = 0; i < numberFrameToUpdate; i++) {
            battleMgr.update(BattleUtils.round((double) 1 / BattleConfig.FRAME_PER_SECOND), i == 0);
        }

        // Send maxLoop + list action to user
        ResponseBattle responseBattle = new ResponseBattle(battleMgr.countLoop, battleMgr.listActionResponse);
        BattleHandler.getInstance().sendResponseBattle(responseBattle, battleMgr.user1, battleMgr.user2);

        // Clear list action
        battleMgr.listActionResponse.clear();

        // End time to run update loop
        long endTime = System.nanoTime();

        if (this.battleMgr.checkEndBattle()) {
            System.out.println("Send end battle: " + battleMgr.countLoop);
            System.out.println("HP: " + battleMgr.gamePlayer1Mgr.currentHP + " - " + battleMgr.gamePlayer2Mgr.currentHP);
            BattleHandler.getInstance().sendEndBattle(
                new ResponseEndBattle(
                    battleMgr.getResultPlayer(BattleConfig.RESULT_WINNER_PLAYER1),
                    battleMgr.countLoop, battleMgr.user1
                )
            );
            BattleHandler.getInstance().sendEndBattle(
                new ResponseEndBattle(
                    battleMgr.getResultPlayer(BattleConfig.RESULT_WINNER_PLAYER2),
                    battleMgr.countLoop, battleMgr.user2
                )
            );
            cancelSimulateLoopClient();
        } else {
            int delay = (int) (BattleUtils.round((double) SynchronizeConfig.DELAY_FRAME / BattleConfig.FRAME_PER_SECOND) * 1000000000)
                        - (int) (endTime - startTime);
            this.simulateLoop = BitZeroServer.getInstance().getTaskScheduler().schedule(
                this.loopBattleHandle,
                delay,
                TimeUnit.NANOSECONDS
            );
        }
    }
}
