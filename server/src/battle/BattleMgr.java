package battle;

import Constant.BattleError;
import battle.model.BattleAction;
import battle.model.Coordinate;
import battle.model.Obstacle;
import battle.model.RandomCustom;
import battle.model.shootableMonster.config.MonsterType;
import battle.model.shootableMonster.config.RatioMonsterTurn;
import battle.model.shootableMonster.config.TurnMonsterConfig;
import battle.model.tower.tower.Tower;
import battle.model.tower.towerAttack.TowerAttack;
import bitzero.server.entities.User;
import cmd.CmdDefine;
import cmd.request.battle.RequestBattleAction;
import config.battle.BattleConfig;
import config.battle.SynchronizeConfig;
import logState.LogState;
import model.battle.map.MapBattle;
import model.battle.map.Point;
import model.user.card.Card;
import util.battle.BattleUtils;

import java.util.*;

public class BattleMgr {
    public GameMgr gamePlayer1Mgr;
    public GameMgr gamePlayer2Mgr;
    public int countTurn;
    public int countLoop;
    public double timer;
    public int delayFrameCreateMonster;
    public int countReceiveAction;

    public ArrayDeque<BattleAction> queueAction1;
    public ArrayDeque<BattleAction> queueAction2;

    public ArrayDeque<Integer> listPreMonster1;
    public ArrayDeque<Integer> listPreMonster2;
    public int ratioHP1;
    public int ratioHP2;

    public List<BattleAction> listActionResponse;

    public User user1;
    public User user2;
    public RandomCustom randomCustom;

    public BattleMgr(int randomSeed, User user1, MapBattle mapBattle1, int[] listDeskCard1, User user2, MapBattle mapBattle2, int[] listDeskCard2) {
        this.user1 = user1;
        this.user2 = user2;

        randomCustom = new RandomCustom(randomSeed);

        gamePlayer1Mgr = new GameMgr(user1, mapBattle1, listDeskCard1, new RandomCustom(randomSeed));
        gamePlayer2Mgr = new GameMgr(user2, mapBattle2, listDeskCard2, new RandomCustom(randomSeed));

        countTurn = 0;
        countLoop = 0;
        timer = BattleConfig.INIT_TIME_COUNT_DOWN;

        delayFrameCreateMonster = 0;

        countReceiveAction= 0;

        queueAction1 = new ArrayDeque<>();
        queueAction2 = new ArrayDeque<>();

        listPreMonster1 = new ArrayDeque<>();
        listPreMonster2 = new ArrayDeque<>();
        ratioHP1 = 0;
        ratioHP2 = 0;

        listActionResponse = Collections.synchronizedList(new ArrayList<>());
    }

    public void addActionToQueue(ArrayDeque<BattleAction> queueAction, BattleAction battleAction) {
        if (queueAction.size() == SynchronizeConfig.MAX_USER_ACTION) {
            queueAction.removeFirst();
        }
        queueAction.addLast(battleAction);
    }

    public void addUserBattleAction(User user, int cmdID, RequestBattleAction actionArguments) {
        countReceiveAction++;
        BattleAction battleAction = new BattleAction(user, cmdID, countReceiveAction, actionArguments);
        if (this.user1.getId() == user.getId()) {
            addActionToQueue(queueAction1, battleAction);
        } else {
            addActionToQueue(queueAction2, battleAction);
        }
    }

    public void createListPreMonster() {
//        this.listPreMonster1.clear();
//        this.listPreMonster2.clear();

        int turn = this.countTurn;

        // For player 1
        int sumLV2 = 0;
        for (int i = 0; i < this.gamePlayer2Mgr.listTower.size(); i++) {
            sumLV2 += this.gamePlayer2Mgr.listTower.get(i).evolution;
        }
        RatioMonsterTurn ratio1;
        if (sumLV2 >= 30) {
            ratio1 = TurnMonsterConfig.RATIO[30];
        } else {
            ratio1 = TurnMonsterConfig.RATIO[sumLV2];
        }
        this.ratioHP1 = ratio1.hp;

        // For player 2
        int sumLV1 = 0;
        for (int i = 0; i < this.gamePlayer1Mgr.listTower.size(); i++) {
            sumLV1 += this.gamePlayer1Mgr.listTower.get(i).evolution;
        }
        RatioMonsterTurn ratio2;
        if (sumLV1 >= 30) {
            ratio2 = TurnMonsterConfig.RATIO[30];
        } else {
            ratio2 = TurnMonsterConfig.RATIO[sumLV1];
        }
        this.ratioHP2 = ratio2.hp;

        for (int i = 0; i < TurnMonsterConfig.TURN.get(turn).size(); i++) {
            int monsterType = TurnMonsterConfig.TURN.get(turn).get(i).type;
            int indexInMonsterType = (int)Math.floor(TurnMonsterConfig.TYPE[monsterType].length * this.randomCustom.getRandom());
            int monster = TurnMonsterConfig.TYPE[monsterType][indexInMonsterType];


            int amount1;
            int amount2;
            if (monsterType == TurnMonsterConfig.BOSS_TYPE) {
                amount1 = 1;
                amount2 = 1;
            } else {
                amount1 = (int) Math.ceil(
                        TurnMonsterConfig.TURN.get(turn).get(i).ratio
                                * TurnMonsterConfig.AMOUNT_OF_TYPE[monster]
                                * ratio1.amount
                );
                amount2 = (int) Math.ceil(
                        TurnMonsterConfig.TURN.get(turn).get(i).ratio
                                * TurnMonsterConfig.AMOUNT_OF_TYPE[monster]
                                * ratio2.amount
                );
            }

            for (int j = 0; j < amount1; j++) {
                this.listPreMonster1.addLast(monster);
            }

            for (int j = 0; j < amount2; j++) {
                this.listPreMonster2.addLast(monster);
            }
        }
    }

    // Tao moi monster theo tung turn
    public void createTurnMonster() {
        delayFrameCreateMonster++;
        if (delayFrameCreateMonster >= BattleConfig.DELAY_FRAME_TO_CREATE_MONSTER) {

            if (this.listPreMonster1.size() > 0) {
                int typeNumber = this.listPreMonster1.getFirst();
                this.listPreMonster1.removeFirst();

                MonsterType monsterType = TurnMonsterConfig.CAST_TO_MONSTER_TYPE[typeNumber];

                gamePlayer1Mgr.createMonster(monsterType, 1, this.ratioHP1, false);
            }

            if (this.listPreMonster2.size() > 0) {
                int typeNumber = this.listPreMonster2.getFirst();
                this.listPreMonster2.removeFirst();

                MonsterType monsterType = TurnMonsterConfig.CAST_TO_MONSTER_TYPE[typeNumber];

                gamePlayer2Mgr.createMonster(monsterType, 1, this.ratioHP2, false);
            }

            delayFrameCreateMonster = 0;
        }
    }

    public void createMonsterImmediately(){
        timer = BattleConfig.INIT_TIME_COUNT_DOWN;
        countTurn++;
        if (countTurn <= BattleConfig.MAX_TURN) {
            createListPreMonster();
            delayFrameCreateMonster = BattleConfig.DELAY_FRAME_TO_CREATE_MONSTER;
        }
    }

    public void updateTimer(double dt){
        timer -= dt;
        if (timer < 0) {
            timer = BattleConfig.INIT_TIME_COUNT_DOWN;
            countTurn++;
            if (countTurn <= BattleConfig.MAX_TURN) {
                createListPreMonster();
                delayFrameCreateMonster = BattleConfig.DELAY_FRAME_TO_CREATE_MONSTER;
            }
        }
    }

    public void updateCountLoop() {
        countLoop++;
    }

    public void handleSummonSystemMonster(BattleAction battleAction) {
        GameMgr gameMgr = battleAction.user.getId() == user1.getId() ? gamePlayer1Mgr : gamePlayer2Mgr;
        ArrayDeque<Integer> listPreMonster = battleAction.user.getId() == user1.getId() ? listPreMonster1 : listPreMonster2;

        if (gameMgr.listMonster.size() == 0 && listPreMonster.size() == 0) {
            createMonsterImmediately();
        } else {
            battleAction.errorCode = BattleError.SUMMON_EXIST_MONSTER_ON_MAP;
        }
        listActionResponse.add(battleAction);
    }

    public void handleCancelCard(BattleAction battleAction) {
        GameMgr gameMgr = battleAction.user.getId() == user1.getId() ? gamePlayer1Mgr : gamePlayer2Mgr;

        // Loi index card
        if (!gameMgr.deskCardMgr.isShowed[battleAction.actionArguments.indexCard]){
            battleAction.errorCode = BattleError.CANCEL_CARD_INVALID_INDEX_CARD;
        }
        // Loi khong du energy
        else if (gameMgr.currentEnergy < BattleConfig.ENERGY_DESTROY_CARD) {
            battleAction.errorCode = BattleError.CANCEL_CARD_NOT_ENOUGH_ENERGY;
        }
        // Cancel card
        else {
            // Update energy
            gameMgr.updateEnergy(-BattleConfig.ENERGY_DESTROY_CARD);

            // Update desk card (cancel card)
            // Note: getNextIndex xong moi hideCard (Error: index vong ve dau thi hien 1 card 2 lan)
            gameMgr.deskCardMgr.getNextIndex();
            gameMgr.deskCardMgr.hideCard(battleAction.actionArguments.indexCard);
        }
        listActionResponse.add(battleAction);
    }

    public void handleDropMonster(BattleAction battleAction) {
        GameMgr gameMgr = battleAction.user.getId() == user1.getId() ? gamePlayer1Mgr : gamePlayer2Mgr;
        GameMgr gameMgrOpponent = battleAction.user.getId() == user1.getId() ? gamePlayer2Mgr : gamePlayer1Mgr;
        Card card = gameMgr.deskCardMgr.listCard[battleAction.actionArguments.indexCard];

        // Check index card
        if (!gameMgr.deskCardMgr.isShowed[battleAction.actionArguments.indexCard]){
            battleAction.errorCode = BattleError.MONSTER_INVALID_CARD_USING;
        }
        // Check energy
        else if (gameMgr.currentEnergy < card.getEnergy()) {
            battleAction.errorCode = BattleError.MONSTER_NOT_ENOUGH_ENERGY;
        }
        else {
            // Get ratio
            int sumLV = 0;
            for (int i = 0; i < gameMgr.listTower.size(); i++) {
                sumLV += gameMgr.listTower.get(i).evolution;
            }
            RatioMonsterTurn ratio;
            if (sumLV >= 30) {
                ratio = TurnMonsterConfig.RATIO[30];
            } else {
                ratio = TurnMonsterConfig.RATIO[sumLV];
            }

            // Drop monster on opponent map
            gameMgrOpponent.dropMonster(card, ratio);

            // Update energy
            gameMgr.updateEnergy(-card.getEnergy());

            // Update desk card
            // Note: getNextIndex xong moi hideCard (Error: index vong ve dau thi hien 1 card 2 lan)
            gameMgr.deskCardMgr.getNextIndex();
            gameMgr.deskCardMgr.hideCard(battleAction.actionArguments.indexCard);
        }
        listActionResponse.add(battleAction);
    }

    public void handleDropSpell(BattleAction battleAction) {
        User remainingUser = battleAction.user.getId() == user1.getId() ? user2 : user1;
        GameMgr gameMgr = battleAction.user.getId() == user1.getId() ? gamePlayer1Mgr : gamePlayer2Mgr;
        GameMgr gameMgrOpponent = battleAction.user.getId() == user1.getId() ? gamePlayer2Mgr : gamePlayer1Mgr;
        Card card = gameMgr.deskCardMgr.listCard[battleAction.actionArguments.indexCard];

        // Check index card
        if (!gameMgr.deskCardMgr.isShowed[battleAction.actionArguments.indexCard]){
            battleAction.errorCode = BattleError.SPELL_INVALID_CARD_USING;
        }
        // Check energy
        else if (gameMgr.currentEnergy < card.getEnergy()) {
            battleAction.errorCode = BattleError.SPELL_NOT_ENOUGH_ENERGY;
        } else {
            // Update energy
            gameMgr.updateEnergy(-card.getEnergy());

            // Neu spell duoc drop tren map user goi
            if (battleAction.actionArguments.map == 1) {
                battleAction.errorCode = gameMgr.dropSpell(
                        new Coordinate((double)battleAction.actionArguments.coordinateX/1000,
                                (double)battleAction.actionArguments.coordinateY/1000),
                        card,
                        battleAction.user.getId()
                );
                battleAction.actionArguments.map = battleAction.user.getId();
            }
            // Neu spell duoc drop tren map opponent cua client goi
            else {
                battleAction.errorCode = gameMgrOpponent.dropSpell(
                        new Coordinate((double)battleAction.actionArguments.coordinateX/1000,
                                (double)battleAction.actionArguments.coordinateY/1000),
                        card,
                        battleAction.user.getId()
                );
                battleAction.actionArguments.map = remainingUser.getId();
            }

            if (battleAction.errorCode == BattleError.SUCCESS) {
                // Update desk card
                // Note: getNextIndex xong moi hideCard (Error: index vong ve dau thi hien 1 card 2 lan)
                gameMgr.deskCardMgr.getNextIndex();
                gameMgr.deskCardMgr.hideCard(battleAction.actionArguments.indexCard);
            }
        }

        // Add action to list response
        listActionResponse.add(battleAction);
    }

    public void handleDropTower(BattleAction battleAction) {
        GameMgr gameMgr = battleAction.user.getId() == user1.getId() ? gamePlayer1Mgr : gamePlayer2Mgr;
        Card card = gameMgr.deskCardMgr.listCard[battleAction.actionArguments.indexCard];

        // Drop tower
        battleAction.errorCode = gameMgr.dropTower(
            new Point(battleAction.actionArguments.coordinateX, battleAction.actionArguments.coordinateY),
            card,
            battleAction.actionArguments.indexCard
        );

        if (battleAction.errorCode == BattleError.SUCCESS) {
            // Update desk card
            // Note: getNextIndex xong moi hideCard (Error: index vong ve dau thi hien 1 card 2 lan)
            gameMgr.deskCardMgr.getNextIndex();
            gameMgr.deskCardMgr.hideCard(battleAction.actionArguments.indexCard);
        }

        // Add action to list response
        listActionResponse.add(battleAction);
    }

    public void handleTargetObstacle(BattleAction battleAction) {
        try {
            GameMgr gameMgr = battleAction.user.getId() == user1.getId() ? gamePlayer1Mgr : gamePlayer2Mgr;
            Obstacle obstacle = gameMgr.getCell(battleAction.actionArguments.coordinateX, battleAction.actionArguments.coordinateY).obstacle;
            if (obstacle == null || obstacle.isDied)
                throw new NullPointerException();
            gameMgr.forceTowerShootObstacle(obstacle);
        } catch (NullPointerException e) {
            battleAction.errorCode = BattleError.TARGET_OBSTACLE_INVALID_POSITION;
        } finally {
            // Add action to list response
            this.listActionResponse.add(battleAction);
        }
    }

    public void handleCancelTower(BattleAction battleAction) {
        try {
            GameMgr gameMgr = battleAction.user.getId() == user1.getId() ? gamePlayer1Mgr : gamePlayer2Mgr;
            Tower tower = gameMgr.getCell(battleAction.actionArguments.coordinateX, battleAction.actionArguments.coordinateY).tower;
            if (tower.disable)
                throw new NullPointerException();
            tower.destroy();
        } catch (NullPointerException e) {
            battleAction.errorCode = BattleError.CANCEL_TOWER_INVALID_POSITION;
        } finally {
            // Add action to list response
            this.listActionResponse.add(battleAction);
        }
    }

    public void handleChangeTargetTower(BattleAction battleAction) {
        try {
            GameMgr gameMgr = battleAction.user.getId() == user1.getId() ? gamePlayer1Mgr : gamePlayer2Mgr;
            Tower tower = gameMgr.getCell(battleAction.actionArguments.coordinateX, battleAction.actionArguments.coordinateY).tower;
            if (tower.disable)
                throw new NullPointerException();
            ((TowerAttack) tower).setTargetMode(battleAction.actionArguments.targetMode);
        } catch (NullPointerException e) {
            battleAction.errorCode = BattleError.CHANGE_TARGET_TOWER_INVALID_POSITION;
        } catch (IllegalStateException e) {
            battleAction.errorCode = BattleError.CHANGE_TARGET_TOWER_INVALID_TARGET_MODE;
        } catch (ClassCastException e) {
            battleAction.errorCode = BattleError.CHANGE_TARGET_TOWER_INVALID_TOWER_TYPE;
        } finally {
            // Add action to list response
            this.listActionResponse.add(battleAction);
        }
    }

    public void runAction(BattleAction battleAction) {
        try {
            switch (battleAction.cmdID) {
                case CmdDefine.SUMMON_SYSTEM_MONSTER:{
                    handleSummonSystemMonster(battleAction);
                    break;
                }
                case CmdDefine.DROP_MONSTER:{
                    handleDropMonster(battleAction);
                    break;
                }
                case CmdDefine.DROP_SPELL: {
                    handleDropSpell(battleAction);
                    break;
                }
                case CmdDefine.DROP_TOWER: {
                    handleDropTower(battleAction);
                    break;
                }
                case CmdDefine.TARGET_OBSTACLE: {
                    handleTargetObstacle(battleAction);
                    break;
                }
                case CmdDefine.END_BATTLE: {
                    break;
                }
                case CmdDefine.CANCEL_TOWER: {
                    handleCancelTower(battleAction);
                    break;
                }
                case CmdDefine.CHANGE_TARGET_TOWER: {
                    handleChangeTargetTower(battleAction);
                    break;
                }
                case CmdDefine.CANCEL_CARD:{
                    handleCancelCard(battleAction);
                    break;
                }
            }
        } catch (Exception e) {
            System.out.println(e);
        }
    }

    public void handleAction() {
        while (queueAction1.size() + queueAction2.size() > 0){
            int countReceiveAction1 = SynchronizeConfig.MAX_COUNT_RECEIVE_ACTION;
            int countReceiveAction2 = SynchronizeConfig.MAX_COUNT_RECEIVE_ACTION;

            if (!queueAction1.isEmpty()) {
                countReceiveAction1 = queueAction1.getFirst().countReceiveAction;
            }
            if (!queueAction2.isEmpty()) {
                countReceiveAction2 = queueAction2.getFirst().countReceiveAction;
            }
            if (countReceiveAction1 < countReceiveAction2) {
                runAction(queueAction1.getFirst());
                queueAction1.removeFirst();
            } else {
                runAction(queueAction2.getFirst());
                queueAction2.removeFirst();
            }
        }
    }

    public boolean checkEndBattle() {
        return gamePlayer1Mgr.currentHP <= 0 || gamePlayer2Mgr.currentHP <= 0 || this.countTurn > BattleConfig.MAX_TURN;
    }

    private int getResult() {
        if (gamePlayer1Mgr.currentHP > 0 && gamePlayer2Mgr.currentHP > 0 && this.countTurn <= BattleConfig.MAX_TURN)
            return BattleConfig.RESULT_UNKNOW;
        if (gamePlayer1Mgr.currentHP == gamePlayer2Mgr.currentHP)
            return BattleConfig.RESULT_DRAW;
        return gamePlayer1Mgr.currentHP > gamePlayer2Mgr.currentHP ? BattleConfig.RESULT_WINNER_PLAYER1 : BattleConfig.RESULT_WINNER_PLAYER2;
    }

    public int getResultPlayer(int player) {
        int result = getResult();
        if (result == BattleConfig.RESULT_UNKNOW || result == BattleConfig.RESULT_DRAW)
            return BattleConfig.RESULT_DRAW;
        return result == player ? BattleConfig.RESULT_WIN : BattleConfig.RESULT_LOSE;
    }

    public void update(double dt, boolean doHandleAction){
        updateTimer(dt);

        if (checkEndBattle())
            return;

        updateCountLoop();
        if (doHandleAction) {
            handleAction();
        }
        createTurnMonster();
        gamePlayer1Mgr.update(dt);
        gamePlayer2Mgr.update(dt);

        // Ghi log ra file
//        LogState.getInstance().logToFile(this.gamePlayer1Mgr, this.countLoop);
//        LogState.getInstance().logToFile(this.gamePlayer2Mgr, this.countLoop);
    }
}