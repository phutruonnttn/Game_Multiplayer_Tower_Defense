var BattleMgr = cc.Layer.extend({
    ctor:function (
        randomSeed,
        listPlayerDeskCard,
        listPlayerDeskCardLevel,
        mapPlayer,
        listOpponentDeskCard,
        listOpponentDeskCardLevel,
        mapOpponent
    ) {
        this._super()

        this.randomCustom = new RandomCustom(randomSeed)

        // Add player game Mgr
        this.gamePlayerMgr = new GameMgr(listPlayerDeskCard, listPlayerDeskCardLevel, mapPlayer, true, new RandomCustom(randomSeed))
        this.gamePlayerMgr.initGamePlayerMgr()
        this.addChild(this.gamePlayerMgr, 0)

        // Add opponent game Mgr
        this.gameOpponentMgr = new GameMgr(listOpponentDeskCard, listOpponentDeskCardLevel, mapOpponent, false, new RandomCustom(randomSeed))
        this.gameOpponentMgr.initGameOpponentMgr()
        this.addChild(this.gameOpponentMgr, 0)

        // Queue action
        this.listActions = []

        // State
        this.randomCustom = new RandomCustom(randomSeed)
        this.listPreMonsterPlayer = []
        this.listPreMonsterOpponent = []
        this.ratioHPPlayer = 0
        this.ratioHPOpponent = 0
        this.countTurn = 0
        this.countLoop = 0
        this.timer = BATTLE.INIT_TIME_COUNT_DOWN

        this.delayFrameCreateMonster = 0
    },

    isTower: function (card) {
        return card.getType() == CARD.TOWER_TYPE
    },

    isMonster: function (card) {
        return card.getType() == CARD.MONSTER_TYPE
    },

    isPotion: function (card) {
        return card.getType() == CARD.POTION_TYPE
    },

    // Tao moi monster theo tung turn
    createTurnMonster: function () {
        this.delayFrameCreateMonster++
        if (this.delayFrameCreateMonster >= BATTLE.DELAY_FRAME_TO_CREATE_MONSTER ) {
            if (this.listPreMonsterPlayer.length > 0) {
                var monsterType = this.listPreMonsterPlayer.shift()
                this.gamePlayerMgr.createMonster(monsterType, 1, this.ratioHPPlayer, BATTLE.NORMAL_SHADOW, false)
            }

            if (this.listPreMonsterOpponent.length > 0) {
                var monsterType = this.listPreMonsterOpponent.shift()
                this.gameOpponentMgr.createMonster(monsterType, 1, this.ratioHPOpponent, BATTLE.NORMAL_SHADOW, false)
            }

            this.delayFrameCreateMonster = 0
        }
    },

    requestCreateMonsterImmediately: function () {
        if (this.gamePlayerMgr.listLogicMonster.length == 0
            && this.listPreMonsterPlayer.length == 0)
        {
            getBattleController().sendSummonSystemMonster();
        }
    },

    requestDropCard: function (coordinate, card) {
        if (this.isTower(card.info)) {
            return this.requestDropTowerPlayer(coordinate,card)
        }
        if (this.isMonster(card.info)) {
            return this.requestDropMonsterToOpponent(coordinate, card)
        }
        if (this.isPotion(card.info)) {
            return this.requestDropSpell(coordinate, card)
        }
    },

    // return: error code
    requestDropSpell: function (coordinate, card) {
        var statCard = CardStat.getInstance().getStatPotion(card.info.getIdInJsonFile())
        var mapTarget = statCard.map

        if (this.gamePlayerMgr.isInMap(coordinate)) {
            if (mapTarget == "enemy") {
                return gv.ERROR.SPELL_INVALID_POSITION_MAP
            } else {
                return this.gamePlayerMgr.requestDropSpell(this.gamePlayerMgr.currentEnergy, coordinate, card, true)
            }
        } else if (this.gameOpponentMgr.isInMap(coordinate)) {
            if (mapTarget == "player") {
                return gv.ERROR.SPELL_INVALID_POSITION_MAP
            } else {
                return this.gameOpponentMgr.requestDropSpell(this.gamePlayerMgr.currentEnergy, coordinate, card, false)
            }
        }
        return gv.ERROR.SPELL_INVALID_POSITION
    },

    // return: error code
    requestDropTowerPlayer: function (coordinate, card) {
        return this.gamePlayerMgr.requestDropTower(coordinate, card)
    },

    // return: error code
    requestDropMonsterToOpponent: function (coordinate, card) {
        return this.gameOpponentMgr.requestDropMonster(this.gamePlayerMgr.currentEnergy, coordinate, card)
    },

    createMonsterImmediately: function (){
        this.timer = BATTLE.INIT_TIME_COUNT_DOWN
        this.countTurn++
        if (this.countTurn <= BATTLE.MAX_TURN) {
            this.createListPreMonster()
            this.delayFrameCreateMonster = BATTLE.DELAY_FRAME_TO_CREATE_MONSTER
        }
    },

    handleDropMonster: function(action) {
        // Neu action do nguoi choi thuc hien
        if (action.userID == gv.user.id) {
            var card = this.gamePlayerMgr.deskCardMgr.listCard[action.indexCard]

            var sumLV = 0
            for (var i = 0; i < this.gamePlayerMgr.listLogicTower.length; i++) {
                sumLV += this.gamePlayerMgr.listLogicTower[i].evolution
            }
            var ratio;
            if (sumLV >= 30) {
                ratio = TURN_MONSTER.RATIO[30]
            } else {
                ratio = TURN_MONSTER.RATIO[sumLV]
            }

            this.gameOpponentMgr.dropMonster(card, ratio)
            this.gamePlayerMgr.updateEnergy(-card.getEnergy())

            gv.battleScene.updateDesk(action.indexCard)
        }
        // Neu action do doi thu thuc hien
        else {
            var card = this.gameOpponentMgr.deskCardMgr.listCard[action.indexCard]

            var sumLV = 0
            for (var i = 0; i < this.gameOpponentMgr.listLogicTower.length; i++) {
                sumLV += this.gameOpponentMgr.listLogicTower[i].evolution
            }
            var ratio;
            if (sumLV >= 30) {
                ratio = TURN_MONSTER.RATIO[30]
            } else {
                ratio = TURN_MONSTER.RATIO[sumLV]
            }

            this.gamePlayerMgr.dropMonster(card, ratio)
            this.gameOpponentMgr.updateEnergy(-card.getEnergy())

            // Chu y getNextIndex xong moi hideCard
            // -> Tranh truong hop index vong ve dau thi hien 1 card 2 lan
            this.gameOpponentMgr.deskCardMgr.getNextIndex()
            this.gameOpponentMgr.deskCardMgr.hideCard(action.indexCard)
        }
    },

    handleDropTower: function (action) {
        var gameMgr = action.userID == gv.user.id ? this.gamePlayerMgr : this.gameOpponentMgr
        var card = gameMgr.deskCardMgr.listCard[action.indexCard]

        gameMgr.dropTower(
            cc.p(action.coordinateX, action.coordinateY),
            card
        )

        // Neu action do nguoi choi thuc hien
        if (action.userID == gv.user.id) {
            gv.battleScene.updateDesk(action.indexCard)
        } else {
            // Chu y getNextIndex xong moi hideCard
            // -> Tranh truong hop index vong ve dau thi hien 1 card 2 lan
            this.gameOpponentMgr.deskCardMgr.getNextIndex()
            this.gameOpponentMgr.deskCardMgr.hideCard(action.indexCard)
        }
    },

    handleTargetObstacle: function (action) {
        let gameMgr = action.userID === gv.user.id ? this.gamePlayerMgr : this.gameOpponentMgr;
        if (action.errorCode === gv.ERROR.SUCCESS)
            gameMgr.forceTowerShootObstacle(gameMgr.getCell(action.coordinateX, action.coordinateY).obstacle);
    },

    handleCancelTower: function (action) {
        let gameMgr = action.userID === gv.user.id ? this.gamePlayerMgr : this.gameOpponentMgr;
        if (action.errorCode === gv.ERROR.SUCCESS)
            gameMgr.getCell(action.coordinateX, action.coordinateY).tower.destroy();
    },

    handleChangeTargetTower: function (action) {
        let gameMgr = action.userID === gv.user.id ? this.gamePlayerMgr : this.gameOpponentMgr;
        if (action.errorCode === gv.ERROR.SUCCESS)
            gameMgr.getCell(action.coordinateX, action.coordinateY).tower.setTargetMode(action.targetMode);
    },

    handleDropSpell: function (action) {
        var gameMgr = action.userID == gv.user.id ? this.gamePlayerMgr : this.gameOpponentMgr
        var card = gameMgr.deskCardMgr.listCard[action.indexCard]

        var isPlayerAction
        // Neu action do nguoi choi thuc hien
        if (action.userID == gv.user.id) {
            this.gamePlayerMgr.updateEnergy(-card.getEnergy())
            gv.battleScene.updateDesk(action.indexCard)
            isPlayerAction = true
        } else {
            this.gameOpponentMgr.updateEnergy(-card.getEnergy())

            // Chu y getNextIndex xong moi hideCard
            // -> Tranh truong hop index vong ve dau thi hien 1 card 2 lan
            this.gameOpponentMgr.deskCardMgr.getNextIndex()
            this.gameOpponentMgr.deskCardMgr.hideCard(action.indexCard)
            isPlayerAction = false
        }

        // Check xem drop spell tren map nao
        if (action.map == gv.user.id) {
            this.gamePlayerMgr.dropSpell(
                cc.p(action.coordinateX/1000, action.coordinateY/1000),
                card,
                isPlayerAction
            )
        } else {
            this.gameOpponentMgr.dropSpell(
                cc.p(action.coordinateX/1000, action.coordinateY/1000),
                card,
                isPlayerAction
            )
        }
    },

    handleCancelCard: function(action) {
        // Neu action do nguoi choi thuc hien
        if (action.userID == gv.user.id) {
            this.gamePlayerMgr.updateEnergy(-BATTLE.ENERGY_DESTROY_CARD)
            gv.battleScene.updateDesk(action.indexCard)
        }

        // Neu action do doi thu thuc hien
        else {
            this.gameOpponentMgr.updateEnergy(-BATTLE.ENERGY_DESTROY_CARD)

            // Chu y getNextIndex xong moi hideCard
            // -> Tranh truong hop index vong ve dau thi hien 1 card 2 lan
            this.gameOpponentMgr.deskCardMgr.getNextIndex()
            this.gameOpponentMgr.deskCardMgr.hideCard(action.indexCard)
        }
    },

    runListAction: function() {
        while (this.listActions.length > 0 && this.listActions[0].frameRunAction == this.countLoop){
            var action = this.listActions.shift()
            if (action.errorCode == gv.ERROR.SUCCESS) {
                switch (action.cmdID) {
                    case gv.CMD.SUMMON_SYSTEM_MONSTER:{
                        this.createMonsterImmediately();
                        break;
                    }
                    case gv.CMD.DROP_MONSTER:{
                        this.handleDropMonster(action);
                        break;
                    }
                    case gv.CMD.DROP_SPELL: {
                        this.handleDropSpell(action);
                        break;
                    }
                    case gv.CMD.DROP_TOWER:{
                        this.handleDropTower(action);
                        break;
                    }
                    case gv.CMD.TARGET_OBSTACLE: {
                        this.handleTargetObstacle(action);
                        break;
                    }
                    case gv.CMD.CANCEL_TOWER: {
                        this.handleCancelTower(action);
                        break;
                    }
                    case gv.CMD.CHANGE_TARGET_TOWER: {
                        this.handleChangeTargetTower(action);
                        break;
                    }
                    case gv.CMD.END_BATTLE:{
                        break;
                    }
                    case gv.CMD.CANCEL_CARD: {
                        this.handleCancelCard(action);
                        break;
                    }
                }
            } else {
                cc.log("Error battle: " + action.errorCode)
                if (action.userID == gv.user.id) {
                    gv.battleScene.showNotification(action.errorCode)
                }
            }
        }
    },

    updateCountLoop: function () {
        this.countLoop++
    },

    createListPreMonster: function () {
        // this.listPreMonsterPlayer = []
        // this.listPreMonsterOpponent = []

        var turn = this.countTurn

        // For player
        var sumLVOpponent = 0
        for (var i = 0; i < this.gameOpponentMgr.listLogicTower.length; i++) {
            sumLVOpponent += this.gameOpponentMgr.listLogicTower[i].evolution
        }
        var ratioPlayer;
        if (sumLVOpponent >= 30) {
            ratioPlayer = TURN_MONSTER.RATIO[30]
        } else {
            ratioPlayer = TURN_MONSTER.RATIO[sumLVOpponent]
        }
        this.ratioHPPlayer = ratioPlayer.hp

        // For opponent
        var sumLVPlayer = 0
        for (var i = 0; i < this.gamePlayerMgr.listLogicTower.length; i++) {
            sumLVPlayer += this.gamePlayerMgr.listLogicTower[i].evolution
        }
        var ratioOpponent;
        if (sumLVPlayer >= 30) {
            ratioOpponent = TURN_MONSTER.RATIO[30]
        } else {
            ratioOpponent = TURN_MONSTER.RATIO[sumLVPlayer]
        }
        this.ratioHPOpponent = ratioOpponent.hp

        for (var i = 0; i < TURN_MONSTER.TURN[turn].length; i++) {
            var monsterType = TURN_MONSTER.TURN[turn][i].type
            var indexInMonsterType = Math.floor(TURN_MONSTER.TYPE[monsterType].length * this.randomCustom.getRandom())
            var monster = TURN_MONSTER.TYPE[monsterType][indexInMonsterType]

            var amountPlayer, amountOpponent
            if (monsterType == TURN_MONSTER.BOSS_TYPE) {
                amountPlayer = 1
                amountOpponent = 1
            } else {
                amountPlayer = Math.ceil(TURN_MONSTER.TURN[turn][i].ratio * TURN_MONSTER.AMOUNT_OF_TYPE[monster] * ratioPlayer.amount)
                amountOpponent = Math.ceil(TURN_MONSTER.TURN[turn][i].ratio * TURN_MONSTER.AMOUNT_OF_TYPE[monster] * ratioOpponent.amount)
            }

            for (var j = 0; j < amountPlayer; j++) {
                this.listPreMonsterPlayer.push(monster)
            }

            for (var j = 0; j < amountOpponent; j++) {
                this.listPreMonsterOpponent.push(monster)
            }
        }
    },

    updateTimer: function (dt){
        this.timer -= dt
        if (this.timer < 0) {
            this.timer = BATTLE.INIT_TIME_COUNT_DOWN
            this.countTurn++
            if (this.countTurn <= BATTLE.MAX_TURN) {
                this.createListPreMonster()
                this.delayFrameCreateMonster = BATTLE.DELAY_FRAME_TO_CREATE_MONSTER
            }
        }
    },

    updateLogic: function (dt){
        this.updateTimer(dt)
        this.updateCountLoop()
        this.runListAction()
        this.createTurnMonster()
        this.gamePlayerMgr.updateLogic(dt)
        this.gameOpponentMgr.updateLogic(dt)

        // Ghi log ra file
        // LogState.getInstance().logToFile(this.gamePlayerMgr, this.countLoop)
    },

    updateUI: function (dt) {
        this.gamePlayerMgr.updateUI(dt)
        this.gameOpponentMgr.updateUI(dt)
    }
})
