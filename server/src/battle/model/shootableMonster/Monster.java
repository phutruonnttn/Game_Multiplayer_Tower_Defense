package battle.model.shootableMonster;

import battle.GameMgr;
import battle.model.buff.*;
import battle.model.Coordinate;
import battle.model.shootable.ShootableObject;
import battle.model.shootableMonster.config.MonsterType;
import battle.model.shootableMonster.config.MoveType;
import config.battle.BattleConfig;
import model.battle.map.Point;
import model.battle.map.Position;
import readjson.JsonConfig;
import readjson.StatMonster;
import util.battle.BattleUtils;


public class Monster extends ShootableObject {

    static final double gameGUIHeight = BattleConfig.SQUARE_SIZE * BattleConfig.ROWS;
    static double distanceToTurn = BattleUtils.round(BattleConfig.SQUARE_SIZE * BattleConfig.RATIO_DISTANCE_TO_TURN);

    /**
     *
     * @param p
     * @return
     * lay tam cua o cell tren map
     */
    public static Position getCentralOfCell(Point p) {

        return new Position(p.getY() * BattleConfig.SQUARE_SIZE + BattleConfig.SQUARE_SIZE / 2,
                gameGUIHeight - p.getX() * BattleConfig.SQUARE_SIZE - BattleConfig.SQUARE_SIZE / 2);
    }

    /**
     *
     * @param position
     * @return
     * tu toa do logic tinh ra vi tri cell
     */
    public  Point convertPositionToPoint(Position position) {
        Point point = this.gameMgr.getCellPositionGameGUI(new Coordinate(position.getX(), position.getY()));
        return point;
    }

    public GameMgr gameMgr;
    private double weight;
    private MonsterType type;
    private int level;
    public Ability ability;
    private double baseSpeed;
    public double curSpeed;
    public int gainEnergy;
    public MoveType moveType;

    //buff choang bang
    private StunBuff stun = new StunBuff(0, 0);
    //buff dong bang
    private FreezeBuff freeze = new FreezeBuff(0,0);
    //buff hoi mau
    private NotAccumulateBuff listHealUpBuff = new NotAccumulateBuff();
    //buff tru mau
    private NotAccumulateBuff listHealDownBuff = new NotAccumulateBuff();
    //buff tang speed
    private NotAccumulateBuff listSpeedUpBuff = new NotAccumulateBuff();
    //buff giam speed
    private NotAccumulateBuff listSpeedDownBuff = new NotAccumulateBuff();
    //buff tang sat thuong nhan vao
    private NotAccumulateBuff listTakenDamageUpBuff = new NotAccumulateBuff();
    //buff giam sat thuong nhan vao
    private NotAccumulateBuff listTakenDamageDownBuff = new NotAccumulateBuff();

    //bo dem tick tren monster
    public int clock = 0;


    public Point curPoint = new Point(0,0);
    public Point prePoint = new Point(0, 0);
    public Point nextPoint;
    public Position curTargetPosition = new Position(0, 0);

    public boolean isReachedTarget = false;

    public int countVectorDirection;
    public Coordinate currentVectorDirection;
    public double speedThrown = 0;
    Position vectorThrown = new Position(0, 0);
    public int HPRatio;
    public boolean isMonsterDrop;

    public Monster(MonsterType type, int lever, GameMgr gameMgr, int id, int HPRatio, boolean isMonsterDrop) {

        super(id);
        this.type = type;
        this.level = lever;
        this.gameMgr = gameMgr;
        this.HPRatio = HPRatio;
        this.isMonsterDrop = isMonsterDrop;
        this.init();
    }

    private void init(){

        StatMonster sm = JsonConfig.getInstance().getStatMonster(type.ordinal());
        this.baseHp = BattleUtils.round(this.calculateHpMonster(sm.getHp()) * this.HPRatio);
        this.hitRadius = sm.getHitRadius();
        this.baseSpeed = BattleUtils.round(sm.getSpeed()*BattleConfig.SQUARE_SIZE);
        this.weight = sm.getWeight();
        this.gainEnergy = sm.getGainEnergy();
        if (this.isMonsterDrop) {
            this.gainEnergy = 0;
        }

        setCurrentHP(this.baseHp);
        setCurSpeed(this.baseSpeed);

        this.curPoint = new Point(BattleConfig.STARTING_POINT.getX()-1, BattleConfig.STARTING_POINT.getY()+1);
        this.prePoint = new Point(BattleConfig.STARTING_POINT.getX()-2, BattleConfig.STARTING_POINT.getY()+1);
        this.nextPoint = this.getNextPoint();
        this.position = getCentralOfCell(this.curPoint);
        this.joinToCellLogic();

        this.curTargetPosition = getTargetPositionOfCell();
        this.moveType = sm.getMoveType();

        countVectorDirection = 0;
        currentVectorDirection = new Coordinate(0,0);
    }

    public int getId(){
        return this.id;
    }

    /**
     *
     * @param baseHp
     * @return
     * tinh hp dua tren level cua quai
     */
    public double calculateHpMonster(double baseHp){

        return baseHp * (1 + (this.level-1)*0.1);
    }

    public void log(){

        System.out.println(this.clock+" "+this.id+" "+this.position.getX()+" "+this.position.getY());
        System.out.println(this.curPoint.getX()+" "+this.curPoint.getY());
    }

    /**
     *
     * @param time
     * @param delayTime
     * @param hp
     * buff tang mau
     */
    public void buffHpUp(int time, int delayTime, double hp){

        buffHp(this.listHealUpBuff, time, delayTime, hp);
    }

    /**
     *
     * @param time so tick hieu ung ton tai
     * @param delayTime so tick giua 2 lan hoi mau
     * @param hp so mau hoi tren 1 lan
     * buff tru mau
     */
    public void buffHpDown(int time, int delayTime, double hp){
        buffHp(this.listHealDownBuff, time, delayTime, hp);
    }

    /**
     *
     * @return
     * kiem tra xem co phai quai bay khong
     */
    public boolean canFly(){

        if(this.moveType == MoveType.FLY){
            return true;
        }
        return false;
    }

    /**
     *
     * @param timeEffect so tick dong bang quai
     * dong bang quoai
     */
    public void freezeMonster(int timeEffect){

        freeze.setTimeEffect(timeEffect, this.clock);
    }

    /**
     *
     * @param percentage ty le tang theo %
     * @param amount ty le tang theo hang so
     * @param time so tick ton tai hieu ung
     */
    public void  speedUp(double percentage, double amount, int time){

        this.buffSpeed(listSpeedUpBuff ,percentage, amount, time);
    }

    /**
     *
     * @param percentage ty le tang theo %
     * @param amount ty le tang theo hang so
     * @param time so tick ton tai hieu ung
     */
    public void speedDown(double percentage, double amount, int time){

        this.buffSpeed(listSpeedDownBuff, percentage, amount, time);
    }

    public double getHitRadius() {

        return BattleUtils.round(this.hitRadius * BattleConfig.SQUARE_SIZE);
    }

    /**
     *
     * @param percentage ty le tang sat thuong nhan vao
     * @param time so tick ton tai hieu ung
     * tang sat thuong nhan vao tren quai
     */
    public void increasedDamageTaken(double percentage, int time){

        this.buffDamageTaken(this.listTakenDamageUpBuff, percentage, time);
    }

    /**
     *
     * @param percentage ty le giam sat thuong nhan vao
     * @param time so tick ton tai hieu ung
     * giam sat thuong nhan vao tren quai
     */
    public void reduceDamageTaken(double percentage, int time){

        this.buffDamageTaken(this.listTakenDamageDownBuff, percentage, time);
    }

    /**
     *
     * @param time so tick ma monster bi lam choang
     * lam choang monster
     */
    public void stunMonster(int time){

        this.stun.setTimeEffect(time, this.clock);
    }


    @Override
    public void decreaseHP(double amount){

        double down = 0, up = 0;
        TakenDamageBuff buffUp = (TakenDamageBuff)this.listTakenDamageUpBuff.getBuffActive(this.clock);
        TakenDamageBuff buffDown = (TakenDamageBuff)this.listTakenDamageDownBuff.getBuffActive(this.clock);

        if(buffUp != null){
            up = buffUp.getValue();
        }
        if(buffDown != null){
            down = buffDown.getValue();
        }

        amount *= 1 + up - down;
        super.decreaseHP(amount);
    }

    public double getCurrentHP() {

        return currentHP;
    }

    public double getBaseHp() {

        return baseHp;
    }

    public void runAbility(){

        if(this.ability!=null && this.ability.canActive()){
            this.ability.active();
        }
    }


    private boolean checkReachedCurTarget(){

        if(Math.abs(this.position.getX() - this.curTargetPosition.getX()) < BattleConfig.DELTA_DISTANCE
                && Math.abs(this.position.getY() - this.curTargetPosition.getY()) < BattleConfig.DELTA_DISTANCE){
            return true;
        }
        return false;
    }

    private boolean checkReachedTarget(){

        if(this.curPoint.getX() == BattleConfig.TARGET_POINT.getX()
                && this.curPoint.getY() == BattleConfig.TARGET_POINT.getY()){
            return  true;
        }
        return false;
    }

    public Position getTargetPositionOfCell(){

        Position curCentral = getCentralOfCell(this.curPoint);
        Position nextCentral = getCentralOfCell(this.nextPoint);
        this.curTargetPosition.setX((curCentral.getX()+nextCentral.getX())/2);
        this.curTargetPosition.setY((curCentral.getY()+nextCentral.getY())/2);

        return this.curTargetPosition;
    }

    public void update(double dt){

        this.clock += 1;
        if (this.isReachedTarget) {
            this.outCellLogic();
            return;
        }
        this.updateSpeed();
        this.updateHp();
        this.runAbility();

        if(this.nextPoint == null || this.checkReachedCurTarget()){

            this.updateCurrentAndPreviousPoint();
            this.nextPoint = this.getNextPoint();
            this.curTargetPosition = this.getTargetPositionOfCell();

            if (this.checkReachedTarget()) {
                this.isReachedTarget = true;
                this.isDied = true;
                this.outCellLogic();
                return;
            }
        }
        this.move(dt);
        if(this.speedThrown > 0){
            this.moveByThrowing(dt);
        }
    }

    public void initPosition(double x, double y){

        this.position.setX(x);
        this.position.setY(y);
    }


    public Point getNextPoint(){

        return gameMgr.mapLogic.getNextPointOfMonster(this.prePoint, this.curPoint.getX(), this.curPoint.getY());
    }

    public void moveUp(double dt){

        if(this.position.getY() + BattleConfig.DELTA_DISTANCE < this.curTargetPosition.getY()){
            if(this.position.getY() + this.curSpeed*dt > this.curTargetPosition.getY()){
                this.position.setY(this.curTargetPosition.getY());
            }else{
                this.position.setY(this.position.getY() + this.curSpeed*dt);
            }
        }
    }

    public void moveDown(double dt){

        if(this.position.getY() > this.curTargetPosition.getY() + BattleConfig.DELTA_DISTANCE){
            if(this.position.getY() - this.curSpeed*dt < this.curTargetPosition.getY()){
                this.position.setY(this.curTargetPosition.getY());
            }else{
                this.position.setY(this.position.getY() - this.curSpeed*dt);
            }
        }
    }

    public void moveLeft(double dt){

        if(this.position.getX() > this.curTargetPosition.getX() + BattleConfig.DELTA_DISTANCE){
            if(this.position.getX() - this.curSpeed*dt < this.curTargetPosition.getX()){
                this.position.setX(this.curTargetPosition.getX());
            }else{
                this.position.setX(this.position.getX() - this.curSpeed*dt);
            }
        }

    }

    public void moveRight(double dt){

        if(this.position.getX() + BattleConfig.DELTA_DISTANCE < this.curTargetPosition.getX()){
            if(this.position.getX() + this.curSpeed*dt > this.curTargetPosition.getX()){
                this.position.setX(this.curTargetPosition.getX());
            }else{
                this.position.setX(this.position.getX() + this.curSpeed*dt);
            }
        }
    }

    public void move(double dt){

        Position curCentral = getCentralOfCell(this.curPoint);
        double turnPositionTop = curCentral.getY() + distanceToTurn;
        double turnPositionBottom = curCentral.getY() - distanceToTurn;
        double turnPositionLeft = curCentral.getX() - distanceToTurn;
        double turnPositionRight = curCentral.getX() + distanceToTurn;

        if (turnPositionLeft <= position.getX()
                && position.getX() <= turnPositionRight
                && turnPositionBottom <= position.getY()
                && position.getY() <= turnPositionTop)
        {
            this.moveDown(dt/1.41);
            this.moveUp(dt/1.41);
            this.moveLeft(dt/1.41);
            this.moveRight(dt/1.41);
        } else {
            if (turnPositionLeft <= position.getX()
                    && position.getX() <= turnPositionRight){
                this.moveDown(dt);
                this.moveUp(dt);
            } else if(turnPositionBottom <= position.getY()
                    && position.getY() <= turnPositionTop){
                this.moveRight(dt);
                this.moveLeft(dt);
            }
        }
    };

    private void updateCurrentAndPreviousPoint(){
        this.outCellLogic();
        this.prePoint = this.curPoint;
        this.setCurPoint(this.nextPoint);
        this.joinToCellLogic();
    }

    private void buffHp(NotAccumulateBuff listHpBuff, int time, int delayTime, double hp){

        HealBuff hpBuff = (HealBuff) listHpBuff.getBuff(hp);
        if(hpBuff != null){
            hpBuff.setTimeEffect(time, this.clock);
        }else {
            listHpBuff.addBuff(new HealBuff(time, delayTime, hp, this.clock));
        }
    }

    private void buffSpeed(NotAccumulateBuff listSpeedBuff, double percentage, double amount, int time){

        double dv = amount + this.baseSpeed * percentage;
        SpeedBuff speedBuff = (SpeedBuff) listSpeedBuff.getBuff(dv);

        if(speedBuff != null){
            speedBuff.setTimeEffect(time, this.clock);
        }else {
            listSpeedBuff.addBuff(new SpeedBuff(time, dv, this.clock));
        }
    }

    private void buffDamageTaken(NotAccumulateBuff listTakenDamageBuff, double percentage, int time){

        TakenDamageBuff buff = (TakenDamageBuff) listTakenDamageBuff.getBuff(percentage);

        if(buff != null){
            buff.setTimeEffect(time, this.clock);
        }else {
            listTakenDamageBuff.addBuff(new TakenDamageBuff(time, percentage,this.clock));
        }
    }

    private void updateSpeed(){

        if(this.freeze.checkStatus(this.clock) || this.stun.checkStatus(this.clock) || this.speedThrown > 0){
            this.curSpeed = 0;
            return;
        }

        double up = 0, down = 0;
        SpeedBuff speedUpBuff = (SpeedBuff) listSpeedUpBuff.getBuffActive(this.clock);
        SpeedBuff speedDownBuff = (SpeedBuff) listSpeedDownBuff.getBuffActive(this.clock);

        if(speedUpBuff != null){
            up = speedUpBuff.getValue();
        }
        if(speedDownBuff != null) {
            down = speedDownBuff.getValue();
        }

        setCurSpeed(this.baseSpeed + up - down);
    }

    private void updateHp(){

        double up = 0, down = 0;
        HealBuff buffUp = (HealBuff) listHealUpBuff.getBuffActive(this.clock);
        HealBuff buffDown = (HealBuff) listHealDownBuff.getBuffActive(this.clock);

        if(buffUp != null){
            up = buffUp.getHp();
        }

        if(buffDown != null){
            down = buffDown.getHp();
        }

        this.decreaseHP(down);
        this.increaseHP(up);
    }

    private static int timeToTick(double time){

        return (int)(time * BattleConfig.FRAME_PER_SECOND);
    }

    private void joinToCellLogic(){

        this.gameMgr.addMonsterToCellTable(this, this.curPoint.getX(), this.curPoint.getY());
    }

    private void outCellLogic(){

        this.gameMgr.removeMonsterOnCellTable(this, this.curPoint.getX(), this.curPoint.getY());
    }

    private void setCurPoint(Point p){

        this.curPoint = p;
    }

    public void updateTarget(){

        this.nextPoint = this.getNextPoint();
        this.curTargetPosition = this.getTargetPositionOfCell();
    }

    public void setCurSpeed(double curSpeed) {
        this.curSpeed = BattleUtils.round(curSpeed);
    }

    public void setCurrentHP(double currentHP) {
        this.currentHP = BattleUtils.round(currentHP);
    }

    public boolean isFrozen(){

        return this.freeze.checkStatus(this.clock);
    }

    public boolean isStunned(){
        return this.stun.checkStatus(this.clock);
    }

    public boolean isCollision (Coordinate pos1, double radius1, Coordinate pos2, double radius2) {
        double distanceRadius = BattleUtils.round((radius1 + radius2) * BattleConfig.SQUARE_SIZE);
        if (BattleUtils.round((pos1.getX() - pos2.getX()) * (pos1.getX() - pos2.getX()))
                + BattleUtils.round((pos1.getY() - pos2.getY()) * (pos1.getY() - pos2.getY()))
                <= BattleUtils.round(distanceRadius * distanceRadius)) {
            return true;
        }
        return false;
    }

    public boolean isCollisionBorder(Coordinate coordinate) {
        Coordinate[] listPoint = {
                new Coordinate(coordinate.getX() + this.hitRadius * BattleConfig.SQUARE_SIZE, coordinate.getY()),
                new Coordinate(coordinate.getX() - this.hitRadius * BattleConfig.SQUARE_SIZE, coordinate.getY()),
                new Coordinate(coordinate.getX(), coordinate.getY() + this.hitRadius * BattleConfig.SQUARE_SIZE),
                new Coordinate(coordinate.getX(), coordinate.getY() - this.hitRadius * BattleConfig.SQUARE_SIZE),
        };

        for (int i = 0; i < listPoint.length; i++) {
            if (!this.isInCell(listPoint[i], this.curPoint)
                    && !this.isInCell(listPoint[i], this.nextPoint)
                    && !this.isInCell(listPoint[i], this.prePoint)) {
                return true;
            }
        }
        return false;
    }

    public boolean isFrontOfMonster(Coordinate thisCoordinate, Coordinate coordinate, Point currentVector) {
        int direction = BattleConfig.MAP_DIRECTION_TOP_LEFT_ORIGIN[currentVector.getX() + 1][currentVector.getY() + 1];
        switch (direction) {
            case BattleConfig.LEFT:
                return coordinate.getX() < thisCoordinate.getX();
            case BattleConfig.RIGHT:
                return coordinate.getX() > thisCoordinate.getX();
            case BattleConfig.TOP:
                return coordinate.getY() > thisCoordinate.getY();
            case BattleConfig.BOTTOM:
                return coordinate.getY() < thisCoordinate.getY();
        }
        return false;
    }

    public void moveAndDodge(double dt) {
        if (this.countVectorDirection > 0) {
            this.countVectorDirection--;
            this.position.setX(this.position.getX() + BattleUtils.round(this.currentVectorDirection.getX()*BattleUtils.round(this.curSpeed*dt)));
            this.position.setY(this.position.getY() + BattleUtils.round(this.currentVectorDirection.getY()*BattleUtils.round(this.curSpeed*dt)));
            return;
        }

        Coordinate currentVector = BattleUtils.getInstance().getVector(
                new Coordinate(this.curPoint.getX(), this.curPoint.getY()),
                new Coordinate(this.nextPoint.getX(), this.nextPoint.getY())
        );


        Position centralOfNextPoint = this.getCentralOfCell(this.nextPoint);
        Coordinate currentVectorDirection = BattleUtils.getInstance().normalizeVector(
                BattleUtils.getInstance().getVector(
                        new Coordinate(this.position.getX(), this.position.getY()),
                        new Coordinate(centralOfNextPoint.getX(), centralOfNextPoint.getY())
                )
        );

        // Xac dinh tam duong tron lay tiep tuyen
        double sumX = 0, sumY = 0, n = 0;
        for (int i = 0; i < this.gameMgr.listMonster.size(); i++) {
            Monster monster = this.gameMgr.listMonster.get(i);
            if (this.id != monster.id
                && this.canFly() == monster.canFly()
                && this.isFrontOfMonster(this.getPosition(), monster.getPosition(), new Point((int)currentVector.getX(), (int)currentVector.getY()))
                && this.isCollision(this.getPosition(), this.hitRadius, monster.getPosition(), monster.hitRadius)
            ) {
                sumX += monster.position.getX();
                sumY += monster.position.getY();
                n++;
            }
        }

        // Co xay ra va cham
        if (n != 0){
            Coordinate centralCircle = new Coordinate(BattleUtils.round(sumX/n), BattleUtils.round(sumY/n));

            Coordinate newVector = BattleUtils.getInstance().getVector(this.getPosition(), centralCircle);
            Coordinate newVectorDirection = BattleUtils.getInstance().normalizeVector(newVector);

            Coordinate vectorDirection1 = new Coordinate(-newVectorDirection.getY(), newVectorDirection.getX());
            Coordinate vectorDirection2 = new Coordinate(newVectorDirection.getY(), -newVectorDirection.getX());

            Coordinate vectorDirection = BattleUtils.getInstance().getCosAngle2Vector(currentVectorDirection, vectorDirection1) >=0 ? vectorDirection1 : vectorDirection2;
            Coordinate newPos = new Coordinate(
                    this.position.getX() + BattleUtils.round(vectorDirection.getX()*BattleUtils.round(this.curSpeed*dt)),
                    this.position.getY() + BattleUtils.round(vectorDirection.getY()*BattleUtils.round(this.curSpeed*dt))
            );
            if (!this.isCollisionBorder(newPos)) {
                this.countVectorDirection = 5;
                this.currentVectorDirection = vectorDirection;
                this.position.setX(newPos.getX());
                this.position.setY(newPos.getY());

            } else {
                this.position.setX(this.position.getX() + BattleUtils.round(currentVectorDirection.getX()*BattleUtils.round(this.curSpeed*dt)));
                this.position.setY(this.position.getY() + BattleUtils.round(currentVectorDirection.getY()*BattleUtils.round(this.curSpeed*dt)));

            }
        } else {
            this.position.setX(this.position.getX() + BattleUtils.round(currentVectorDirection.getX()*BattleUtils.round(this.curSpeed*dt)));
            this.position.setY(this.position.getY() + BattleUtils.round(currentVectorDirection.getY()*BattleUtils.round(this.curSpeed*dt)));
        }
    }

    public boolean isInCell(Coordinate coordinate, Point cell) {
        Point curPoint = this.gameMgr.getCellPositionGameGUI(coordinate);
        return (curPoint.getX() == cell.getX() && curPoint.getY() == cell.getY());
    }

    public boolean checkMonsterInNextCell() {
        Coordinate[] listPoint = {
                new Coordinate(this.position.getX() + this.hitRadius * BattleConfig.SQUARE_SIZE, this.position.getY()),
                new Coordinate(this.position.getX() - this.hitRadius * BattleConfig.SQUARE_SIZE, this.position.getY()),
                new Coordinate(this.position.getX(), this.position.getY() + this.hitRadius * BattleConfig.SQUARE_SIZE),
                new Coordinate(this.position.getX(), this.position.getY() - this.hitRadius * BattleConfig.SQUARE_SIZE),
        };

        for (int i = 0; i < listPoint.length; i++) {
            if (!this.isInCell(listPoint[i], this.nextPoint)) {
                return false;
            }
        }
        return true;
    }

    public void updateDodge(double dt) {

        this.clock += 1;
        if (this.isReachedTarget || this.isDied) {
            this.outCellLogic();
            return;
        }
        this.updateSpeed();
        this.updateHp();
        this.runAbility();

        if(this.nextPoint == null || this.checkMonsterInNextCell()){
            this.updateCurrentAndPreviousPoint();
            this.nextPoint = this.getNextPoint();
            this.curTargetPosition = this.getTargetPositionOfCell();
            if (this.checkReachedTarget()) {
                this.isReachedTarget = true;
                this.outCellLogic();
                this.isDied = true;
                return;
            }
        }
        this.moveAndDodge(dt);
        if(this.speedThrown > 0){
            this.moveByThrowing(dt);
        }
    }

    public void thrownOut (Coordinate from){
        this.speedThrown = BattleUtils.round(BattleConfig.STANDARD_SPEED*4);
        this.vectorThrown  = BattleUtils.getInstance().normalizeVector(
                new Position(this.position.getX() - from.getX(), this.position.getY() - from.getY()));
    }

    public void moveByThrowing(double dt){
        Position pos = new Position(
                BattleUtils.round(this.position.getX() + this.speedThrown * dt * vectorThrown.getX()),
                BattleUtils.round(this.position.getY() + this.speedThrown * dt * vectorThrown.getY())
        );
        Point point = this.convertPositionToPoint(pos);
        if(this.gameMgr.getCell(point.getX(), point.getY()) != null){
            if(this.gameMgr.mapLogic.getTypeOfCell(point.getX(), point.getY()) == BattleConfig.HOLE_TYPE
            || this.gameMgr.mapLogic.getTypeOfCell(point.getX(), point.getY()) == BattleConfig.LAND_TYPE){
                this.position = pos;
                this.outCellLogic();
                this.curPoint = point;
                this.joinToCellLogic();
                this.updateTarget();
            }
            if(this.gameMgr.mapLogic.getTypeOfCell(point.getX(), point.getY()) == BattleConfig.HOLE_TYPE){
                this.isDied = true;
                this.outCellLogic();
            }
        }
        this.speedThrown -= BattleUtils.round(2*Math.max(this.weight, BattleConfig.STANDARD_WEIGHT)*dt);
    }

    public boolean isBoss() {
        return false;
    }
}