var GameMgr = cc.Layer.extend({
    ctor:function (listDeskCard, listDeskCardLevel, mapGenerate, isPlayerMap, randomCustom) {
        this._super()

        // Random
        this.randomCustom = randomCustom;

        // State
        this.shootableObjectIdCounter = 0
        this.isPlayerMap = isPlayerMap
        this.currentHP = BATTLE.INIT_HP
        this.currentEnergy = BATTLE.INIT_ENERGY
        this.deskCardMgr = new DeskCardMgr(listDeskCard, listDeskCardLevel)

        // List logic object
        this.listLogicMonster = []
        this.listLogicTower = []
        this.listLogicBullet = []
        this.listLogicTreeObstacle = []
        this.listLogicHoleObstacle = []
        this.listLogicSpell = []

        // List UI object
        this.listUIMonster = []
        this.listUITower = []
        this.listUIBullet = []
        this.listUITreeObstacle = []
        this.listUIHoleObstacle = []

        // List cell table -> find priority target
        this.cellTable = {}

        // Map logic + mapGUI
        this.mapLogic = new MapLogic(mapGenerate)
        this.gameGUI = new GameGUI(this.mapLogic, this.isPlayerMap);

        // Initialize
        this.initCellTable()
        this.initTreeObstacle()
        this.initHoleObstacle()

        this.priorityObstacle = null;

    },

    initTreeObstacle: function () {
        for (var i = 0; i < BATTLE.ROWS; i++) {
            for (var j = 0; j < BATTLE.COLUMNS; j++) {
                if (this.mapLogic.getTypeOfCell(i,j) == BATTLE.TREE_TYPE) {
                    var position = this.gameGUI.positionOf(i,j)

                    var logicTreeObstacle = new LogicObstacle(BATTLE.TREE_TYPE, this.shootableObjectIdCounter++)
                    logicTreeObstacle.point = cc.p(i, j);
                    var UITreeObstacle = new ObstacleUI(BATTLE.TREE_TYPE, position, logicTreeObstacle, this)
                    logicTreeObstacle.setUI(UITreeObstacle);

                    var zOrder
                    if (this.isPlayerMap)
                        zOrder = this.gameGUI.getContentSize().height + BATTLE.SQUARE_SIZE - UITreeObstacle.y;
                    else
                        zOrder = UITreeObstacle.y;
                    this.gameGUI.addChild(UITreeObstacle, zOrder)

                    this.listUITreeObstacle.push(UITreeObstacle)
                    this.listLogicTreeObstacle.push(logicTreeObstacle)
                    this.getCell(i, j).obstacle = logicTreeObstacle;
                }
            }
        }
    },

    initHoleObstacle: function () {
        for (var i = 0; i < BATTLE.ROWS; i++) {
            for (var j = 0; j < BATTLE.COLUMNS; j++) {
                if (this.mapLogic.getTypeOfCell(i,j) == BATTLE.HOLE_TYPE) {
                    var position = this.gameGUI.positionOf(i,j)
                    var logicHoleObstacle = new LogicHole(BATTLE.HOLE_TYPE);
                    var UIHoleObstacle = new HoleUI(BATTLE.HOLE_TYPE, position, logicHoleObstacle);

                    var zOrder
                    if (this.isPlayerMap)
                        zOrder = this.gameGUI.getContentSize().height + BATTLE.SQUARE_SIZE - UIHoleObstacle.y;
                    else
                        zOrder = UIHoleObstacle.y;

                    this.gameGUI.addChild(UIHoleObstacle, zOrder);

                    this.listUIHoleObstacle.push(UIHoleObstacle)
                    this.listLogicHoleObstacle.push(logicHoleObstacle)
                }
            }
        }
    },

    initCellTable: function () {
        for (var i = 0; i < BATTLE.ROWS; i++) {
            for (var j = 0; j< BATTLE.COLUMNS; j++) {
                this.cellTable[this.getKeyCell(i, j)] = new Cell(i, j);
            }
        }
        this.cellTable[this.getKeyCell(-1, 0)] = new Cell(-1, 0);
        this.cellTable[this.getKeyCell(-1, 1)] = new Cell(-1, 1);
    },

    getRandomInRange: function (min, max) {
        return Math.round(Utils.round(this.randomCustom.getRandom() * (max - min)) + min);
    },

    showSuggestionPath: function () {
        this.gameGUI.showSuggestionPath(this.mapLogic.virtualPath)
    },

    initGamePlayerMgr: function () {
        var positionX = (cc.Director.getInstance().getVisibleSize().width -
            this.gameGUI.getContentSize().width) / 2
        var positionY = BATTLE.CONTROL_PANEL_HEIGHT
        this.gameGUI.setPosition(cc.p(positionX, positionY))
        this.addChild(this.gameGUI, 1)
        this.gameGUI.showSuggestionPath(this.mapLogic.virtualPath)
        this.gameGUI.showPath(BATTLE.STARTING_POINT.x - 1, BATTLE.STARTING_POINT.y)
    },

    initGameOpponentMgr: function () {
        var positionX = (cc.Director.getInstance().getVisibleSize().width -
            this.gameGUI.getContentSize().width) / 2
        var playerMapHeight = BATTLE.SQUARE_SIZE*BATTLE.ROWS
        var positionY = BATTLE.CONTROL_PANEL_HEIGHT + playerMapHeight + BATTLE.RIVER_HEIGHT
        this.gameGUI.setPosition(cc.p(positionX, positionY))
        this.gameGUI.showPath(BATTLE.STARTING_POINT.x-1, BATTLE.STARTING_POINT.y)
        this.addChild(this.gameGUI, 1)
    },

    isEnoughEnergy: function (amount) {
        return amount <= this.currentEnergy
    },

    // check xem toa do man hinh truyen vao co thuoc map khong
    isInMap: function (coordinate) {
        var pointInMap = this.gameGUI.getCellPositionDisplayView(coordinate)
        var px = pointInMap.x
        var py = pointInMap.y
        if ((px == -1 && py == 0) || (px == -1 && py == 1) || (px == BATTLE.ROWS - 1 && py == BATTLE.COLUMNS) ||
            (px >= 0 && py >= 0 && px < BATTLE.ROWS && py < BATTLE.COLUMNS)) {
            return true
        }
        return false
    },

    // card: card.info
    dropSpell: function (coordinate, card, isPlayerAction) {
        // Add spell logic and UI
        let spellUI = SpellFactoryUI.create(card, this, coordinate);
        this.gameGUI.addChild(spellUI);

        let spellLogic = SpellFactoryLogic.create(card, this, coordinate, isPlayerAction);
        if (spellLogic == -1) {
            cc.log("SPELL chua code logic, hieu ung fix ve spell ice");
        } else {
            this.listLogicSpell.push(spellLogic)
        }

        // Show effect
        EffectDropCard.create(card.getNameUI(), card.level, coordinate, this.gameGUI)
    },

    // cardBattle: (cardBattle.info, cardBattle.index)
    // return: error code
    requestDropSpell: function (playerCurrentEnergy, coordinate, cardBattle, map) {
        // Check energy
        var energyCard = cardBattle.info.getEnergy()
        if (playerCurrentEnergy < energyCard) {
            return gv.ERROR.SPELL_NOT_ENOUGH_ENERGY
        }

        var coordinateInMap = this.gameGUI.getCoordinateMapDisplayView(coordinate)
        // Đối xứng lại tọa độ thả nếu như thả phép vào Opponent's MAP
        if (this.isPlayerMap === false) {
            coordinateInMap.x = this.gameGUI.getContentSize().width - coordinateInMap.x;
            coordinateInMap.y = this.gameGUI.getContentSize().height - coordinateInMap.y;
        }

        // Send request drop spell
        getBattleController().sendDropSpell(
            cardBattle.index,
            Utils.getInstance().roundAndParseToInt(coordinateInMap.x),
            Utils.getInstance().roundAndParseToInt(coordinateInMap.y),
            map
        )
        return gv.ERROR.SUCCESS
    },

    // card: card.info
    dropMonster: function (card, ratio) {
        var amount = Math.ceil(TURN_MONSTER.AMOUNT_OF_TYPE[card.getIdInJsonFile()] * ratio.amount)

        if (this.isPlayerMap) {
            for (var i = 0; i < amount; i++) {
                this.createMonster(card.getIdInJsonFile(), card.level, ratio.hp, BATTLE.RED_SHADOW, true)
            }
        } else {
            for (var i = 0; i < amount; i++) {
                this.createMonster(card.getIdInJsonFile(), card.level, ratio.hp, BATTLE.BLUE_SHADOW, true)
            }
        }

        // Show effect
        let position = this.gameGUI.positionOf(BATTLE.STARTING_POINT.x-1, BATTLE.STARTING_POINT.y+1)
        EffectDropCard.create(card.getNameUI(), card.level, position, this.gameGUI)
    },

    // player drop monster to opponent map
    // cardBattle: (cardBattle.info, cardBattle.index)
    // return: error code
    requestDropMonster: function (playerCurrentEnergy, coordinate, cardBattle) {
        // Check energy
        var energyCard = cardBattle.info.getEnergy()
        if (playerCurrentEnergy < energyCard) {
            return gv.ERROR.MONSTER_NOT_ENOUGH_ENERGY
        }

        // Check position
        var pointInMap = this.gameGUI.getCellPositionDisplayView(coordinate)
        var px = pointInMap.x
        var py = pointInMap.y
        if ((px == -1 && py == 0) || (px == -1 && py == 1) || (px == BATTLE.ROWS - 1 && py == BATTLE.COLUMNS) ||
            (px >= 0 && py >= 0 && px < BATTLE.ROWS && py < BATTLE.COLUMNS)) {
            getBattleController().sendDropMonster(cardBattle.index)
            return gv.ERROR.SUCCESS
        }
        return gv.ERROR.MONSTER_INVALID_POSITION
    },

    // card: card.info
    // point: (row,column)
    dropTower: function (point,card) {
        var energyCard = card.getEnergy()
        var px = point.x
        var py = point.y

        if (this.mapLogic.getTypeOfCell(px,py) === BATTLE.TOWER_TYPE){
            this.getCell(px, py).tower.goingEvolution();
            this.updateEnergy(-energyCard);
        } else {
            // Update logic map
            this.mapLogic.addObstacle(px, py, BATTLE.TOWER_TYPE);
            this.mapLogic.updateStepCountFromTarget();
            this.updateAllTargetMonster();

            // Add Tower Logic and UI
            let position = this.gameGUI.positionOf(px, py)
            let towerLogicAndUI = TowerFactory.create(card, this, position);

            this.gameGUI.addChild(towerLogicAndUI.ui);
            this.gameGUI.showPath(BATTLE.STARTING_POINT.x - 1, BATTLE.STARTING_POINT.y);

            // Update state and list
            this.updateEnergy(-energyCard);
            this.getCell(px, py).tower = towerLogicAndUI.logic;
            this.listLogicTower.push(towerLogicAndUI.logic);
            this.listUITower.push(towerLogicAndUI.ui);

            // Show effect
            EffectDropCard.create(card.getNameUI(), card.level, position, this.gameGUI)
         }
    },

    // cardBattle: (cardBattle.info, cardBattle.index)
    // return: error code
    requestDropTower: function (coordinate, cardBattle) {
        // Check energy
        var energyCard = cardBattle.info.getEnergy()
        if (!this.isEnoughEnergy(energyCard)) {
            return gv.ERROR.DROP_TOWER_NOT_ENOUGH_ENERGY
        }
        // Check position
        var pointInMap = this.gameGUI.getCellPositionDisplayView(coordinate)
        var px = pointInMap.x
        var py = pointInMap.y

        // Check xem vi tri co nam trong map
        if (!(px >= 0 && py >= 0 && px < BATTLE.ROWS && py < BATTLE.COLUMNS)) {
            return gv.ERROR.DROP_TOWER_INVALID_POSITION
        }

        // Check vat can tren cell khong
        if (this.mapLogic.getTypeOfCell(px,py) === BATTLE.HOLE_TYPE ||
            this.mapLogic.getTypeOfCell(px,py) === BATTLE.TREE_TYPE) {
            return gv.ERROR.DROP_TOWER_EXIST_OBSTACLE_ON_CELL
        }

        // Neu tren cell la tower, check xem nang cap duoc khong
        if (this.mapLogic.getTypeOfCell(px,py) === BATTLE.TOWER_TYPE){
            let error = this.getCell(px, py).tower.canEvolution(cardBattle.info);
            if (error === gv.ERROR.SUCCESS) {
                getBattleController().sendDropTower(cardBattle.index, px, py);
            }
            return error;
        }

        // Check xem co monster tren cell khong
        if (this.isExistMonsterOnCell(px,py)) {
            return gv.ERROR.DROP_TOWER_EXIST_MONSTER_ON_CELL
        }

        // Check xem con duong di tu diem xuat phat den dich khong
        if (!this.mapLogic.isCanMoveToTargetPointAfterAddObstacle(px,py)) {
            return gv.ERROR.DROP_TOWER_CAN_NOT_MOVE_TO_TARGET
        }

        // Check xem co can duong den dich cua monster nao khong
        if (this.isBlockWayOfAnyMonster(px,py)) {
            return gv.ERROR.DROP_TOWER_BLOCK_WAY_OF_MONSTER
        }

        // Send request drop tower
        getBattleController().sendDropTower(cardBattle.index, px, py)
        return gv.ERROR.SUCCESS
    },

    isBlockWayOfAnyMonster: function (px, py) {
        this.mapLogic.addObstacle(px, py, BATTLE.TMP_TYPE)
        this.mapLogic.updateStepCountFromTarget()

        for(var i = 0; i< this.listLogicMonster.length; i++) {
            var monster = this.listLogicMonster[i]
            if (!monster.canFly()) {
                var nextPoint = this.mapLogic.getNextPointOfMonster(monster.previousPoint,
                    monster.currentPoint.x, monster.currentPoint.y)
                if (nextPoint.x == -1 && nextPoint.y == -1) {
                    this.mapLogic.addObstacle(px, py, BATTLE.LAND_TYPE)
                    this.mapLogic.updateStepCountFromTarget()
                    return true
                }
            }
        }

        this.mapLogic.addObstacle(px, py, BATTLE.LAND_TYPE)
        this.mapLogic.updateStepCountFromTarget()
        return false
    },

    // Kiem tra xem co monster nao dang tren o (x,y) khong?
    isExistMonsterOnCell: function (x,y) {
        for(var i = 0; i< this.listLogicMonster.length; i++) {
            if (!this.listLogicMonster[i].canFly()) {
                if (this.listLogicMonster[i].currentPoint.x == x
                    && this.listLogicMonster[i].currentPoint.y == y) {
                    return true
                }
            }
        }
        return false
    },

    createMonster: function (typeOfMonster, level=1, HPRatio =1, typeShadow, isMonsterDrop) {
        var logicMonster;
        var UIMonster;
        switch (typeOfMonster){
            case MONSTER_TYPE.BAT: {
                logicMonster = new BatLogic(level, this, this.shootableObjectIdCounter++, HPRatio, isMonsterDrop);
                break;
            }
            case MONSTER_TYPE.SATYR: {
                logicMonster = new SatyrLogic(this, this.shootableObjectIdCounter++, HPRatio, isMonsterDrop);
                break;
            }
            case MONSTER_TYPE.DARK_GIANT: {
                logicMonster = new DarkGiantLogic(this, this.shootableObjectIdCounter++, HPRatio, isMonsterDrop);
                break;
            }
            case MONSTER_TYPE.NINJA: {
                logicMonster = new NinjaLogic(level, this, this.shootableObjectIdCounter++, HPRatio, isMonsterDrop);
                break;
            }
            default: logicMonster = new LogicMonster(typeOfMonster, level, this, this.shootableObjectIdCounter++, HPRatio, isMonsterDrop)

        }
        switch (typeOfMonster){
            case MONSTER_TYPE.SATYR:{
                UIMonster = new SatyrUI(this, logicMonster, typeShadow, this.isPlayerMap);
                break;
            }
            case MONSTER_TYPE.NINJA:{
                UIMonster = new NinjaUi(this, logicMonster, typeShadow, this.isPlayerMap);

                break;
            }
            case MONSTER_TYPE.BAT:{
                UIMonster = new BatUI(this, logicMonster, typeShadow, this.isPlayerMap);
                break;
            }
            case MONSTER_TYPE.DARK_GIANT:{
                UIMonster = new DarkGiantUI(this, logicMonster, typeShadow, this.isPlayerMap);
                break;
            }
            default: UIMonster = new MonsterUI(typeOfMonster, this, logicMonster, typeShadow, this.isPlayerMap);
        }

        var position = this.gameGUI.positionOf(BATTLE.STARTING_POINT.x-1, BATTLE.STARTING_POINT.y+1)
        UIMonster.setPosition(position)
        logicMonster.initPosition(UIMonster.x, UIMonster.y)
        this.gameGUI.addChild(UIMonster)

        this.listLogicMonster.push(logicMonster)
        this.listUIMonster.push(UIMonster)
    },

    updateEnergy: function (amount) {
        this.currentEnergy = this.currentEnergy + amount
        if (this.currentEnergy < 0) {
            this.currentEnergy = 0
        } else if (this.currentEnergy > BATTLE.MAX_ENERGY) {
            this.currentEnergy = BATTLE.MAX_ENERGY
        }
    },

    updateLogicMonster: function (dt) {
        var tmpListLogicMonster = []
        for (var i = 0; i < this.listLogicMonster.length; i++) {
            // this.listLogicMonster[i].update(dt)
            this.listLogicMonster[i].updateDodge(dt)

            // Update energy, gameGUI
            if (this.listLogicMonster[i].isDied && !this.listLogicMonster[i].isReachedTarget) {
                // Update state
                this.updateEnergy(this.listLogicMonster[i].gainEnergy)
            } else if (this.listLogicMonster[i].isReachedTarget) {
                // Update state
                var energy, hp
                if (this.listLogicMonster[i].isBoss()){
                    energy = BATTLE.ENERGY_HOUSE_ATTACKED_BOSS
                    hp = 5
                } else {
                    energy = BATTLE.ENERGY_HOUSE_ATTACKED
                    hp = 1
                }

                this.updateEnergy(energy)
                this.currentHP = Math.max(this.currentHP - hp, 0)
            }

            // Xoa nhung monster da den dich hoac chet khoi list
            if (!this.listLogicMonster[i].isReachedTarget && !this.listLogicMonster[i].isDied) {
                tmpListLogicMonster.push(this.listLogicMonster[i])
            }
        }
        this.listLogicMonster = tmpListLogicMonster
    },

    updateLogicTower: function (dt) {
        let newListLogicTower = [];
        // Huy obj da finished
        for (let i=0;i<this.listLogicTower.length;++i) {
            if (!this.listLogicTower[i].disable) {
                newListLogicTower.push(this.listLogicTower[i]);
            } else {
                // Remove Tower From Map
                // get position
                let towerLogic = this.listLogicTower[i];
                let pointInMap = this.gameGUI.getCellPositionGameGUI(towerLogic.getPosition());
                let px = pointInMap.x;
                let py = pointInMap.y;
                // Update logic map
                this.mapLogic.addObstacle(px, py, BATTLE.LAND_TYPE);
                this.mapLogic.updateStepCountFromTarget();
                this.updateAllTargetMonster();
                // Update state
                this.updateEnergy(towerLogic.getEnergyBack());
            }
        }
        // update mảng
        this.listLogicTower = newListLogicTower;
        // Update obj tower
        this.listLogicTower.forEach(function (towerLogic, index) {
            towerLogic.setIndex(index);
            towerLogic.update(dt);
        });
    },

    updateLogicBullet: function (dt) {
        let newListLogicBullet = [];

        // Huy obj da finished
        for (let i=0;i<this.listLogicBullet.length;++i)
            if (!this.listLogicBullet[i].finished)
                newListLogicBullet.push(this.listLogicBullet[i]);

        // Update mang
        this.listLogicBullet = newListLogicBullet;

        // Update obj bullet
        this.listLogicBullet.forEach(function (bulletLogic) {
            bulletLogic.update(dt);
        });
    },

    updateLogicObstacle: function (dt) {

        let newListTree = [];
        for(let i = 0; i < this.listLogicTreeObstacle.length; i++){
            if(this.listLogicTreeObstacle[i].isDied){
                let p = this.listLogicTreeObstacle[i].point;
                this.mapLogic.addObstacle(p.x, p.y, BATTLE.LAND_TYPE);
                this.mapLogic.updateStepCountFromTarget();
                this.updateAllTargetMonster()
                this.gameGUI.showPath(BATTLE.STARTING_POINT.x - 1, BATTLE.STARTING_POINT.y);
            }else {
                newListTree.push(this.listLogicTreeObstacle[i]);
            }
        }
        this.listLogicTreeObstacle = newListTree;
    },

    updateLogicSpell: function (dt) {
        let newListLogicSpell = [];
        for (let i=0;i<this.listLogicSpell.length;++i)
            if (this.listLogicSpell[i].timeExistence > 0)
                newListLogicSpell.push(this.listLogicSpell[i]);
        this.listLogicSpell = newListLogicSpell;
        this.listLogicSpell.forEach(function (spellLogic) {
            spellLogic.update(dt);
        });
    },

    updateLogic: function (dt){
        this.updateLogicMonster(dt);
        this.updateLogicTower(dt);
        this.updateLogicBullet(dt);
        this.updateLogicObstacle(dt);
        this.updateLogicSpell(dt);
    },

    updateUIMonster: function (dt) {
        var tmpListUIMonster = []
        for (var i = 0; i < this.listUIMonster.length; i++) {
            this.listUIMonster[i].update(dt)
            if(this.listUIMonster[i].isDiedByHole){
                this.listUIMonster[i].fallIntoHole();
                let self = this;
                let monsterUI = this.listUIMonster[i];
                setTimeout(function (){
                    monsterUI.stopAllActions();
                    self.gameGUI.removeChild(monsterUI)
                }, 1100);
            }else {
        
                // Update gameGUI
                if (this.listUIMonster[i].isDied && !this.listUIMonster[i].isReachedTarget) {
                    // Update GUI
                    this.gameGUI.removeChild(this.listUIMonster[i])

                } else if (this.listUIMonster[i].isReachedTarget) {
                    // Update GUI
                    this.gameGUI.showEffectDecreaseHP()
                    this.gameGUI.removeChild(this.listUIMonster[i])

                    var energy
                    if (this.listUIMonster[i].isBoss()){
                        energy = BATTLE.ENERGY_HOUSE_ATTACKED_BOSS
                    } else {
                        energy = BATTLE.ENERGY_HOUSE_ATTACKED
                    }

                    this.gameGUI.showEffectHouseAttacked(energy)
                }
                // Xoa nhung monster da den dich hoac chet khoi list
                if (!this.listUIMonster[i].isReachedTarget && !this.listUIMonster[i].isDied) {
                    tmpListUIMonster.push(this.listUIMonster[i])
                }
            }
        }
        this.listUIMonster = tmpListUIMonster
    },

    updateUITower: function (dt) {
        let newListUITower = [];
        for (let i=0;i<this.listUITower.length;++i) {
            let towerUI = this.listUITower[i];
            if (!towerUI.towerLogic.disable) {
                newListUITower.push(towerUI);
            } else {
                // Remove Tower From Map
                // Update GUI
                this.gameGUI.showPath(BATTLE.STARTING_POINT.x - 1, BATTLE.STARTING_POINT.y)
                towerUI.removeFromParent(true);
            }
        }
        this.listUITower = newListUITower;
        this.listUITower.forEach(function (towerUI) {
            towerUI.update(dt);
        });
    },

    updateUIBullet: function (dt) {
        let newListUIBullet = [];
        for (let i=0;i<this.listUIBullet.length;++i)
            if (!this.listUIBullet[i].finished)
                newListUIBullet.push(this.listUIBullet[i]);
            else
                this.listUIBullet[i].removeFromParent(true);
        this.listUIBullet = newListUIBullet;
        this.listUIBullet.forEach(function (bulletUI) {
            bulletUI.update(dt);
        });
    },

    updateUIObstacle: function (dt) {
        let newListUIObstacle = [];
        for(let i = 0 ; i < this.listUITreeObstacle.length; i++){
            this.listUITreeObstacle[i].update();
            if(this.listUITreeObstacle[i].isDied){
                this.gameGUI.removeChild(this.listUITreeObstacle[i]);
            }else {
                newListUIObstacle.push(this.listUITreeObstacle[i]);
            }
        }
        this.listUITreeObstacle = newListUIObstacle;
    },

    updateUI: function (dt) {
        this.updateUIMonster(dt);
        this.updateUITower(dt);
        this.updateUIBullet(dt);
        this.updateUIObstacle(dt);
    },

    updateAllTargetMonster: function () {
        this.listLogicMonster.forEach(function (monster){
            monster.updateTarget();
        })
    },




    getKeyCell: function (x, y){
        return x * BATTLE.COLUMNS + y;
    },
    getCell: function (x, y){
        return this.cellTable[this.getKeyCell(x, y)];
    },
    addMonsterToCellTable: function (monster, x, y){
        var cell = this.getCell(x, y);
        if(cell){
            cell.monsters.addMonster(monster)
        }
    },
    removeMonsterOnCellTable: function (monster, x, y){
        var cell = this.getCell(x, y);
        if(cell){
            cell.monsters.removeMonster(monster);
        }
    },
    getListCellNeighbor: function (x, y, radius){
        var listCell = [];
        var iMin = Math.max(Math.floor(x - radius), -1);
        var iMax = Math.min(Math.ceil(x + radius), BATTLE.ROWS - 1);
        var jMin = Math.max(Math.floor(y - radius), 0);
        var jMax = Math.min(Math.ceil(y + radius), BATTLE.COLUMNS - 1);
        for (var i = iMin; i <= iMax; i++){
            for (var j = jMin; j <= jMax; j++){
                var cell = this.getCell(i, j);
                if (cell) {
                    listCell.push(cell);
                }
            }
        }
        return listCell;
    },
    getListMonsterInCellNeighbor: function (x, y, radius){
        // return this.listLogicMonster;
        var listCell = this.getListCellNeighbor(x, y, radius);
        var listMonster = [];
        listCell.forEach(function (cell){
            var listMonsterInCell = cell.monsters.getListMonster();
            listMonsterInCell.forEach(function (monster){
                listMonster.push(monster);
            });
        });
        return listMonster;
    },
    getListTowerInCellNeighbor: function (x, y, radius){
        var listCell = this.getListCellNeighbor(x, y, radius);
        var listTower = [];
        listCell.forEach(function (cell){
            if(cell.tower){
                listTower.push(cell.tower);
            }
        });
        return listTower;
    },

    // Khiến tất cả trụ bắn vật cản, nếu đã bắn vật cản đó rồi thì chuyển sang bắn quái
    forceTowerShootObstacle: function (obstacle) {
        if (obstacle === undefined || obstacle === null || obstacle.isDied)
            return;
        if (this.priorityObstacle !== null && this.priorityObstacle.getId() === obstacle.getId()) {
            this.listLogicTower.forEach(function (towerLogic) {
                if (towerLogic instanceof TowerLogicAttack &&
                    towerLogic.getTarget() != null &&
                    towerLogic.getTarget().getId() === obstacle.getId()
                ) {
                    towerLogic.findTarget();
                }
            });
            this.priorityObstacle.obstacleUI.setTargeted(false);
            this.priorityObstacle = null;
        }
        else {
            this.listLogicTower.forEach(function (towerLogic) {
                if (towerLogic instanceof TowerLogicAttack) {
                    if (towerLogic.getTarget() instanceof LogicObstacle)
                        towerLogic.findTarget();
                    if (towerLogic.canShoot(obstacle))
                        towerLogic.setTarget(obstacle);
                }
            });
            if (this.priorityObstacle instanceof LogicObstacle && !this.priorityObstacle.isDied)
                this.priorityObstacle.obstacleUI.setTargeted(false);
            this.priorityObstacle = obstacle;
            this.priorityObstacle.obstacleUI.setTargeted(true);
        }
    },

})
