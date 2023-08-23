package battle;

import Constant.BattleError;
import battle.model.*;
import battle.model.shootableMonster.Monster;
import battle.model.shootableMonster.Satyr.Satyr;
import battle.model.shootableMonster.bat.Bat;
import battle.model.shootableMonster.config.MonsterType;
import battle.model.shootableMonster.config.RatioMonsterTurn;
import battle.model.shootableMonster.config.TurnMonsterConfig;
import battle.model.shootableMonster.darkGiant.DarkGiant;
import battle.model.shootableMonster.ninja.Ninja;
import battle.model.spell.Spell;
import battle.model.spell.SpellFactory;
import battle.model.tower.TowerFactory;
import battle.model.tower.towerAttack.Bullet;
import battle.model.tower.tower.Tower;
import battle.model.tower.towerAttack.TowerAttack;
import bitzero.engine.io.filter.IFilter;
import bitzero.server.entities.User;
import config.battle.BattleConfig;
import model.battle.map.MapBattle;
import model.battle.map.Point;
import model.user.card.Card;
import util.battle.BattleUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.atomic.AtomicBoolean;

public class GameMgr {

    public User user;
    public int currentHP;
    public int currentEnergy;
    public ArrayList<Monster> listMonster;
    public ArrayList<Tower> listTower;
    public ArrayList<Bullet> listBullet;
    public ArrayList<Obstacle> listTreeObstacle;
    public ArrayList<Obstacle> listHoleObstacle;
    public ArrayList<Spell> listSpell;
    public MapLogic mapLogic;
    public HashMap<Integer, Cell> cellTable = new HashMap<Integer, Cell>();
    public DeskCardMgr deskCardMgr;
    private int shootableObjectIdCounter;
    private final RandomCustom randomCustom;
    public Obstacle priorityObstacle;

    public GameMgr(User user, MapBattle mapBattle, int[] listDeskCard, RandomCustom randomCustom){
        // Random
        this.randomCustom = randomCustom;

        // State
        shootableObjectIdCounter = 0;
        this.user = user;
        currentHP = BattleConfig.INIT_HP;
        currentEnergy = BattleConfig.INIT_ENERGY;
        deskCardMgr = new DeskCardMgr(user, listDeskCard);

        // List object
        listMonster = new ArrayList<>();
        listTower = new ArrayList<>();
        listBullet = new ArrayList<>();
        listSpell = new ArrayList<>();
        listTreeObstacle = new ArrayList<>();
        listHoleObstacle = new ArrayList<>();

        // Map logic
        mapLogic = new MapLogic(mapBattle);

        initCellTable();
        initTreeObstacle();
        initHoleObstacle();

        this.priorityObstacle = null;
    }

    public void initCellTable() {
        for (int i = 0; i < BattleConfig.ROWS; i++) {
            for (int j = 0; j < BattleConfig.COLUMNS; j++) {
                this.cellTable.put(this.getCellKey(i, j),new Cell(i, j));
            }
        }
        this.cellTable.put(this.getCellKey(-1, 0), new Cell(-1, 0));
        this.cellTable.put(this.getCellKey(-1, 1), new Cell(-1, 1));
    }

    public void initTreeObstacle() {
        for (int i = 0; i < BattleConfig.ROWS; i++) {
            for (int j = 0; j < BattleConfig.COLUMNS; j++) {
                if (mapLogic.getTypeOfCell(i,j) == BattleConfig.TREE_TYPE) {
                    Coordinate position = positionOf(i,j);
                    Obstacle treeObstacle = new Obstacle(BattleConfig.TREE_TYPE, position, this.shootableObjectIdCounter++);
                    treeObstacle.point = new Point(i, j);
                    listTreeObstacle.add(treeObstacle);
                    this.getCell(i, j).obstacle = treeObstacle;
                }
            }
        }
    }

    public void initHoleObstacle() {
        for (int i = 0; i < BattleConfig.ROWS; i++) {
            for (int j = 0; j < BattleConfig.COLUMNS; j++) {
                if (mapLogic.getTypeOfCell(i,j) == BattleConfig.HOLE_TYPE) {
                    Coordinate position = positionOf(i,j);
                    Obstacle holeObstacle = new Obstacle(BattleConfig.HOLE_TYPE, position);
                    holeObstacle.point = new Point(i, j);
                    listHoleObstacle.add(holeObstacle);
                }
            }
        }
    }

    public int getRandomInRange(int min, int max) {
        return (int) (Math.round(BattleUtils.round(this.randomCustom.getRandom() * (max - min))) + min);
    }

    public boolean isEnoughEnergy(int amount) {
        if (amount <= currentEnergy) {
            return true;
        }
        return false;
    }

    public void dropMonster(Card card, RatioMonsterTurn ratio) {
        int amount =(int) Math.ceil(TurnMonsterConfig.AMOUNT_OF_TYPE[card.getIdInJsonFile()] * ratio.amount);
        for (int i = 0; i < amount; i++) {
            createMonster(MonsterType.values()[card.getIdInJsonFile()], card.level, ratio.hp, true);
        }
    }

    public boolean isInMap(Coordinate coordinate) {
        double mapWidth = BattleConfig.SQUARE_SIZE * BattleConfig.COLUMNS;
        double mapHeight = BattleConfig.SQUARE_SIZE * BattleConfig.ROWS;

        // Check trong map
        if (0 <= coordinate.getX() && coordinate.getX() <= mapWidth
            && 0 <= coordinate.getY() && coordinate.getY() <= mapHeight) {
            return true;
        }

        // Check o 2 o sinh quai
        if (0 <= coordinate.getX() && coordinate.getX() <= BattleConfig.SQUARE_SIZE * 2
                && mapHeight <= coordinate.getY()
                && coordinate.getY() <= mapHeight + BattleConfig.SQUARE_SIZE) {
            return true;
        }

        // Check o o nha chinh
        if (mapWidth <= coordinate.getX() && coordinate.getX() <= mapWidth + BattleConfig.SQUARE_SIZE
                && 0 <= coordinate.getY() && coordinate.getY() <= BattleConfig.SQUARE_SIZE) {
            return true;
        }

        return false;
    }

    // return error code
    public int dropSpell(Coordinate coordinate, Card card, int userAction) {
        // Check position
        if (!isInMap(coordinate)) {
            return BattleError.SPELL_INVALID_POSITION;
        }

        // Drop spell
        Spell spell = SpellFactory.create(card, this , coordinate, userAction);
        if (spell == null) {
            System.out.println("SPELL chua code logic");
        } else {
            this.listSpell.add(spell);
        }
        return BattleError.SUCCESS;
    }

    // return error code
    // Point (row,column)
    public int dropTower(Point point, Card card, int indexCard) {
        // Check index card (chi can check o server)
        if (!deskCardMgr.isShowed[indexCard]){
            return BattleError.DROP_TOWER_INVALID_CARD_USING;
        }

        // Check energy
        int energyCard = card.getEnergy();
        if (!isEnoughEnergy(energyCard)) {
            return BattleError.DROP_TOWER_NOT_ENOUGH_ENERGY;
        }

        // Check xem vi tri co nam trong map
        if (!(point.getX() >= 0 && point.getY() >= 0 && point.getX() < BattleConfig.ROWS && point.getY() < BattleConfig.COLUMNS)) {
            return BattleError.DROP_TOWER_INVALID_POSITION;
        }

        // Check vat can tren cell khong
        if (mapLogic.getTypeOfCell(point.getX(), point.getY()) == BattleConfig.HOLE_TYPE ||
                mapLogic.getTypeOfCell(point.getX(), point.getY()) == BattleConfig.TREE_TYPE) {
            return BattleError.DROP_TOWER_EXIST_OBSTACLE_ON_CELL;
        }

        // Neu tren cell la tower, check xem nang cap duoc khong
        if (mapLogic.getTypeOfCell(point.getX(), point.getY()) == BattleConfig.TOWER_TYPE){
            int error = this.getCell(point.getX(), point.getY()).tower.canEvolution(card);
            if (error == BattleError.SUCCESS) {
                // Upgrade tower
                this.getCell(point.getX(), point.getY()).tower.goingEvolution();
                updateEnergy(-energyCard);
            }
            return error;
        }

        // Check xem co monster tren cell khong
        if (isExistMonsterOnCell(point.getX(), point.getY())) {
            return BattleError.DROP_TOWER_EXIST_MONSTER_ON_CELL;
        }

        // Check xem con duong di tu diem xuat phat den dich khong
        if (!mapLogic.isCanMoveToTargetPointAfterAddObstacle(point.getX(), point.getY())) {
            return BattleError.DROP_TOWER_CAN_NOT_MOVE_TO_TARGET;
        }

        // Check xem co can duong den dich cua monster nao khong
        if (isBlockWayOfAnyMonster(point.getX(), point.getY())) {
            return BattleError.DROP_TOWER_BLOCK_WAY_OF_MONSTER;
        }

        // Drop tower
        // Update logic map
        mapLogic.addObstacle(point.getX(), point.getY(), BattleConfig.TOWER_TYPE);
        mapLogic.updateStepCountFromTarget();

        // Update state and list
        Tower tower = TowerFactory.create(card, this, positionOf(point.getX(), point.getY()));

        listTower.add(tower);
        this.getCell(point.getX(), point.getY()).tower = tower;
        updateEnergy(-energyCard);

        this.updateAllTargetMonster();

        return BattleError.SUCCESS;
    }

    public boolean isBlockWayOfAnyMonster(int px,int py) {
        mapLogic.addObstacle(px, py, BattleConfig.TMP_TYPE);
        mapLogic.updateStepCountFromTarget();

        for (int i = 0; i < listMonster.size(); i++) {
            if (!listMonster.get(i).canFly()) {
                Point nextPoint = mapLogic.getNextPointOfMonster(listMonster.get(i).prePoint,
                        listMonster.get(i).curPoint.getX(), listMonster.get(i).curPoint.getY());
                if (nextPoint.getX() == -1 && nextPoint.getY() == -1) {
                    mapLogic.addObstacle(px, py, BattleConfig.LAND_TYPE);
                    mapLogic.updateStepCountFromTarget();
                    return true;
                }
            }
        }

        mapLogic.addObstacle(px, py, BattleConfig.LAND_TYPE);
        mapLogic.updateStepCountFromTarget();
        return false;
    }

    // Kiem tra xem co monster nao dang tren o (x,y) khong?
    public boolean isExistMonsterOnCell(int x,int y) {
        for(int i = 0; i < listMonster.size(); i++) {
            if (!listMonster.get(i).canFly()) {
                Point currentPosition = getCellPositionGameGUI(listMonster.get(i).getPosition());
                if (currentPosition.getX() == x && currentPosition.getY() == y) {
                    return true;
                }
            }
        }
        return false;
    }

    public void createMonster(MonsterType typeOfMonster, int level, int HPRatio, boolean isMonsterDrop) {
        Monster monster;

        switch (typeOfMonster){
            case DARK_GIANT:{
                monster = new DarkGiant(this, this.shootableObjectIdCounter++, HPRatio, isMonsterDrop);
                break;
            }
            case BAT:
            {
                monster = new Bat(level, this, this.shootableObjectIdCounter++, HPRatio, isMonsterDrop);
                break;
            }
            case NINJA:{
                monster = new Ninja(level, this, this.shootableObjectIdCounter++, HPRatio, isMonsterDrop);
                break;
            }
            case SATYR:{
                monster = new Satyr(this, this.shootableObjectIdCounter++, HPRatio, isMonsterDrop);
                break;
            }
            default: monster = new Monster(typeOfMonster, level, this, this.shootableObjectIdCounter++, HPRatio, isMonsterDrop);
        }
        Coordinate position = positionOf(BattleConfig.STARTING_POINT.getX() - 1, BattleConfig.STARTING_POINT.getY() + 1);
        monster.initPosition(position.getX(), position.getY());
        this.listMonster.add(monster);
    }

    // Truyen vao vi tri (row,column) tren map -> tra ve toa do vi tri (x,y) tren man hinh
    public Coordinate positionOf(int row, int column){
        double heightMapGUI = BattleUtils.round(BattleConfig.SQUARE_SIZE * BattleConfig.ROWS);
        return new Coordinate(
            BattleUtils.round(column * BattleConfig.SQUARE_SIZE + BattleConfig.SQUARE_SIZE/2),
            BattleUtils.round(heightMapGUI - row * BattleConfig.SQUARE_SIZE - BattleConfig.SQUARE_SIZE/2)
        );
    }

    // Tra ve toa do o khi truyen vao touch theo toa do tren map GUI
    public Point getCellPositionGameGUI(Coordinate coordinates) {
        double heightMapGUI = BattleConfig.SQUARE_SIZE * BattleConfig.ROWS;

        int px = (int) Math.floor(((heightMapGUI - coordinates.getY()) / BattleConfig.SQUARE_SIZE));
        int py = (int) Math.floor(coordinates.getX() / BattleConfig.SQUARE_SIZE);
        return new Point(px,py);
    }

    public void updateEnergy(int amount) {
        currentEnergy += amount;
        if (currentEnergy < 0) {
            currentEnergy = 0;
        } else if (this.currentEnergy > BattleConfig.MAX_ENERGY) {
            this.currentEnergy = BattleConfig.MAX_ENERGY;
        }
    }

    public void updateMonster(double dt) {
        ArrayList<Monster> newListMonster = new ArrayList<>();

        for (int i = 0; i < listMonster.size(); i++) {
//            listMonster.get(i).update(dt);
            listMonster.get(i).updateDodge(dt);

            // Update energy
            if (listMonster.get(i).isDied && !listMonster.get(i).isReachedTarget) {
                updateEnergy(listMonster.get(i).gainEnergy);
            } else if (listMonster.get(i).isReachedTarget) {

                int energy, hp;
                if (this.listMonster.get(i).isBoss()){
                    energy = BattleConfig.ENERGY_HOUSE_ATTACKED_BOSS;
                    hp = 5;
                } else {
                    energy = BattleConfig.ENERGY_HOUSE_ATTACKED;
                    hp = 1;
                }
                updateEnergy(energy);
                currentHP = Math.max(currentHP - hp, 0);
            }

            // Xoa nhung monster da den dich hoac chet khoi list
            if (!listMonster.get(i).isReachedTarget && !listMonster.get(i).isDied) {
                newListMonster.add(listMonster.get(i));
            }
        }

        // Update mang
        listMonster = newListMonster;
    }

    public void updateTower(double dt) {
        ArrayList<Tower> newListTower = new ArrayList<>();

        // Huy obj da finished
        for (int i=0; i < this.listTower.size(); ++i) {
            if (!this.listTower.get(i).disable) {
                newListTower.add(this.listTower.get(i));
            } else {
                // Remove Tower From Map
                Tower tower = this.listTower.get(i);
                Point pointInMap = this.getCellPositionGameGUI(tower.getPosition());
                int px = pointInMap.getX();
                int py = pointInMap.getY();
                // Update logic
                this.mapLogic.addObstacle(px, py, BattleConfig.LAND_TYPE);
                this.mapLogic.updateStepCountFromTarget();
                this.updateAllTargetMonster();
                // Update state
                this.updateEnergy(tower.getEnergyBack());
            }
        }
        // update mảng
        this.listTower = newListTower;
        // Update obj tower
        for (int i=0; i < this.listTower.size(); ++i) {
            this.listTower.get(i).setIndex(i);
            this.listTower.get(i).update(dt);
        }
    }

    public void updateBullet(double dt) {
        ArrayList<Bullet> newListBullet = new ArrayList<>();

        // Huy obj da finished
        for (int i = 0; i < listBullet.size(); ++i)
            if (!listBullet.get(i).finished)
                newListBullet.add(listBullet.get(i));

        // Update mang
        this.listBullet = newListBullet;

        // Update obj bullet
        this.listBullet.forEach((Bullet bullet) -> {
            bullet.update(dt);
        });
    }

    public void updateObstacle(double dt) {
        ArrayList<Obstacle> listTree = new ArrayList<Obstacle>();
        for(int i = 0 ; i < listTreeObstacle.size(); i++){
            if(!listTreeObstacle.get(i).isDied){
                listTree.add(listTreeObstacle.get(i));
            }else {
                Point point = listTreeObstacle.get(i).point;
                this.mapLogic.addObstacle(point.getX(), point.getY(), BattleConfig.LAND_TYPE);
                this.mapLogic.updateStepCountFromTarget();
                this.updateAllTargetMonster();
            }
        }
        listTreeObstacle = listTree;
    }

    public void updateSpell(double dt) {
        ArrayList<Spell> newListLogicSpell = new ArrayList<>();

        // Huy obj da xong
        for (int i=0; i <this.listSpell.size(); ++i) {
            if (this.listSpell.get(i).getTimeExistence() > 0){
                newListLogicSpell.add(this.listSpell.get(i));
            }
        }

        // Update mang
        this.listSpell = newListLogicSpell;

        // Update obj con lai
        for (int i = 0; i < this.listSpell.size(); i++) {
            listSpell.get(i).update(dt);
        }
    }

    public void update(double dt){
        ArrayList m = this.getListMonsterInNeighborCell(2, 5, 10);
        updateMonster(dt);
        updateTower(dt);
        updateBullet(dt);
        updateObstacle(dt);
        updateSpell(dt);
    }

    public void updateAllTargetMonster(){

        for(Monster monster : this.listMonster){
            monster.updateTarget();
        }
    }

    public void addMonsterToCellTable(Monster monster, int i, int j){
        Cell cell = this.getCell(i, j);
        if(cell != null){
            cell.addMonster(monster);
        }
    }

    public void removeMonsterOnCellTable(Monster monster, int i, int j){
        Cell cell = this.getCell(i, j);
        if(cell != null){
            cell.removeMonster(monster);
        }
    }

    public Cell getCell(int i, int j){
        return this.cellTable.get(getCellKey(i, j));
    }

    private int getCellKey(int i, int j){
        return i*BattleConfig.COLUMNS+j;
    }

    public ArrayList<Cell> getListCellNeighbor(int x, int y, double radius){
        Cell cell = null;
        ArrayList<Cell> listCell = new ArrayList<Cell>();
        int iMin = Math.max((int) Math.floor(x - radius), -1);
        int iMax = Math.min((int) Math.ceil(x + radius), BattleConfig.ROWS - 1);
        int jMin = Math.max((int) Math.floor(y - radius), 0);
        int jMax = Math.min((int) Math.ceil(y + radius), BattleConfig.COLUMNS - 1);
        for (int i = iMin; i <= iMax; i++){
            for(int j =  jMin ; j <= jMax; j++){
                cell = this.getCell(i, j);
                if (cell != null) {
                    listCell.add(cell);
                }
            }
        }
        return listCell;
    }

    public ArrayList<Monster> getListMonsterInNeighborCell(int x, int y, double radius){
//        return this.listMonster;
        ArrayList<Cell> listCell = this.getListCellNeighbor(x, y, radius);
        ArrayList<Monster> listMonster = new ArrayList<Monster>();
        for(Cell cell : listCell){
            ArrayList<Monster> listMonsterInCell = cell.getMonstersInCell();
            listMonster.addAll(listMonsterInCell);
        }
        return listMonster;
    }

    public ArrayList<Tower> getListTowerInNeighborCell(int x, int y, double radius){
        ArrayList<Cell> listCell = this.getListCellNeighbor(x, y, radius);
        ArrayList<Tower> listTower = new ArrayList<Tower>();
        for(Cell cell : listCell){
            if(cell.tower != null){
                listTower.add(cell.tower);
            }
        }
        return listTower;
    }

    public ArrayList<Tower> getListTower() {
        return listTower;
    }

    public void forceTowerShootObstacle(Obstacle obstacle) {
        if (obstacle == null || obstacle.isDied)
            return;
        if (this.priorityObstacle != null && this.priorityObstacle.getId() == obstacle.getId()) {
            this.listTower.forEach((Tower tower) -> {
                if (tower instanceof TowerAttack &&
                    ((TowerAttack) tower).getTarget() != null &&
                    ((TowerAttack) tower).getTarget().getId() == obstacle.getId()
                ) {
                    ((TowerAttack) tower).findTarget();
                }
            });
            this.priorityObstacle = null;
        }
        else {
            this.listTower.forEach((Tower tower) -> {
                if (tower instanceof TowerAttack) {
                    if (((TowerAttack) tower).getTarget() instanceof Obstacle)
                        ((TowerAttack) tower).findTarget();
                    if (((TowerAttack) tower).canShoot(obstacle))
                        ((TowerAttack) tower).setTarget(obstacle);
                }
            });
            this.priorityObstacle = obstacle;
        }
    }
}
