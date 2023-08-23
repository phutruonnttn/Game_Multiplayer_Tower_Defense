package battle.model.tower.tower;

import Constant.BattleError;
import battle.GameMgr;
import battle.model.tower.towerAttack.TowerAttack;
import model.battle.map.Point;
import readjson.JsonConfig;
import battle.model.Coordinate;
import readjson.StatTower;
import config.battle.BattleConfig;
import model.user.card.Card;
import util.battle.BattleUtils;

public abstract class Tower {
    public boolean disable;
    public GameMgr gameMgr;
    private int index;

    public double x;
    public double y;
    protected Point cellPos;
    private final boolean hasSkill;
    private final int cardID;
    public final int towerID;
    public final int level;
    private final int rank;
    public int evolution;
    protected int loopCountDown;
    protected boolean isEvolving;
    protected final StatTower stat;
    protected int targetType;
    protected int loopCounter;

    protected double scaleRange;
    protected double scaleDamage;
    protected double scaleAttackSpeed;

    protected double frozenDuration;

    protected Tower(Card card, GameMgr gameMgr) {
        this.gameMgr = gameMgr;

        this.disable = false;

        this.hasSkill = card.hasSkill();
        this.cardID = card.id;
        this.towerID = card.getIdInJsonFile();
        this.level = card.level;
        this.rank = card.getRank();
        this.evolution = BattleConfig.TOWER_EVOLUTION_MIN;
        this.isEvolving = false;
        this.stat = JsonConfig.getInstance().getStatTower(this.towerID);
        this.targetType = this.stat.getTargetType();

        // buff of tower
        this.scaleRange = 1;
        this.scaleDamage = 1;
        this.scaleAttackSpeed = 1;

        // status of tower
        this.frozenDuration = 0;

        // Loop counter for update
//        this.loopCounter = this.gameMgr.getRandomInRange(0, BattleConfig.TOWER_MAX_DELAY_FRAME - 1);
        this.loopCounter = 0;

        this.drop();
    }

    public double getBaseRange() {
        return BattleUtils.round(this.stat.getRange(this.evolution) * this.scaleRange);
    }

    public double getRange() {
        return BattleUtils.round(this.getBaseRange() * BattleConfig.SQUARE_SIZE);
    }

    public int getEvolution() {
        return this.evolution;
    }

    public int getEnergyBack() {
        return (int) Math.floor(this.stat.getEnergy() * this.getEvolution() / 2.0);
    }

    public void buffActivate(int towerBuffID, int evolution, int level) {
        if (towerBuffID < 0)
            return;
        switch (JsonConfig.getInstance().getBuffTower(towerBuffID).getEffectName(evolution)) {
            case (BattleConfig.TOWER_BUFF_DAMAGE_UP_TXT): {
                this.buffDamage(JsonConfig.getInstance().getBuffTower(towerBuffID).getEffectValue(evolution));
                break;
            }
            case (BattleConfig.TOWER_BUFF_RANGE_UP_TXT): {
                this.buffRange(JsonConfig.getInstance().getBuffTower(towerBuffID).getEffectValue(evolution));
                break;
            }
            case (BattleConfig.TOWER_BUFF_ATTACK_SPEED_UP_TXT): {
                this.buffAttackSpeed(JsonConfig.getInstance().getBuffTower(towerBuffID).getEffectValue(evolution));
                break;
            }
            case (BattleConfig.TOWER_BUFF_FROZEN_TXT): {
                this.setFrozen(JsonConfig.getInstance().getBuffTower(towerBuffID).getDuration(evolution, level));
                break;
            }
        }
    }

    public void buffRange(double buffAmount) {
        this.scaleRange += buffAmount;
    }

    public void buffDamage(double buffAmount) {
        this.scaleDamage += buffAmount;
    }

    public void buffAttackSpeed(double buffAmount) {
        this.scaleAttackSpeed -= buffAmount;
    }

    public void drop() {
        this.loopCountDown = BattleConfig.FRAME_PER_SECOND;
    }

    public void setPosition(Coordinate pos) {
        this.x = pos.getX();
        this.y = pos.getY();
        this.cellPos = this.gameMgr.getCellPositionGameGUI(this.getPosition());
        this.buffActivate(this.gameMgr.mapLogic.getBuffOfCell(this.cellPos.getX(), this.cellPos.getY()),1,1);
    }

    public Coordinate getPosition() {
        return new Coordinate(this.x, this.y);
    }

    public void setIndex(int index) {
        this.index = index;
    }

    public int getIndex() {
        return this.index;
    }

    protected boolean canEvolution() {
        return !this.isEvolving && this.loopCountDown <= 0 && this.evolution + 1 <= Math.min(BattleConfig.TOWER_EVOLUTION_MAX, this.rank);
    }

    public int canEvolution(Card card) {
        if (card.id != this.cardID)
            return BattleError.DROP_TOWER_UPGRADE_INVALID_CARD;
        if (this.loopCountDown > 0 || this.isEvolving)
            return BattleError.DROP_TOWER_UPGRADE_BUSY;
        if (this.evolution + 1 > Math.min(BattleConfig.TOWER_EVOLUTION_MAX, this.rank))
            return BattleError.DROP_TOWER_UPGRADE_MAX;
        return BattleError.SUCCESS;
    }

    public void goingEvolution() {
        if (!this.canEvolution())
            return;
        this.isEvolving = true;
        this.loopCountDown = 1;
    }

    protected void evolutionUp() {
        if (!this.isEvolving || this.loopCountDown > 0)
            return;
        this.evolution += 1;
        this.isEvolving = false;
    }

    public boolean canUseSkill() {
        return this.evolution >= BattleConfig.TOWER_EVOLUTION_MAX;
    }

    protected boolean inRange(Coordinate otherPos) {
        return BattleUtils.getInstance().inCircle(this.getPosition(), this.getRange(), otherPos);
    }

    protected double getDistanceSqr(Coordinate otherPos) {
        Coordinate vector = BattleUtils.getInstance().getVector(this.getPosition(), otherPos);
        return BattleUtils.getInstance().getVectorLengthSqr(vector);
    }

    public void setFrozen(double duration) {
        this.frozenDuration = Math.max(this.frozenDuration, duration);
    }

    private void updateImmobile(double dt) {
        if (this.loopCountDown > 0)
            this.loopCountDown -= 1;
        if (this.frozenDuration > 0)
            this.frozenDuration -= dt;
    }

    protected boolean isImmobile() {
        return this.loopCountDown > 0 || this.frozenDuration > 0;
    }

    public void update(double dt) {
        if (this.isImmobile()) {
            this.updateImmobile(dt);
            return;
        }
        if (this.isEvolving)
            this.evolutionUp();
    }

    public void destroy() {
        this.disable = true;
    }

}