package battle.model.tower.towerBuff;

import battle.GameMgr;
import battle.model.Coordinate;
import battle.model.tower.tower.Tower;
import battle.model.tower.towerAttack.TowerAttack;
import config.battle.BattleConfig;
import model.user.card.Card;
import readjson.BuffTower;
import readjson.JsonConfig;

import java.util.ArrayList;
import java.util.Map;

public abstract class TowerBuff extends Tower {

    protected final BuffTower buff;
    private boolean isBuffing;

    protected TowerBuff(Card card, GameMgr gameMgr) {
        super(card, gameMgr);
        this.buff = JsonConfig.getInstance().getBuffTower(this.stat.getAuraTowerBuffType());
    }

    protected double getBuffAmount() {
        return this.buff.getEffectValue(this.evolution);
    }

    public boolean canBuff(Tower tower) {
        return tower instanceof TowerAttack && this.level >= tower.level && this.inRange(tower.getPosition());
    }

    protected ArrayList<TowerAttack> getEffectedTowerAttack() {
        ArrayList<TowerAttack> listTowerAttack = new ArrayList<>();
        this.gameMgr.getListTowerInNeighborCell(this.cellPos.getX(), this.cellPos.getY(), this.getBaseRange()).forEach((Tower tower) -> {
            if (this.canBuff(tower))
                listTowerAttack.add((TowerAttack) tower);
        });
        return listTowerAttack;
    }

    public abstract void buffTower(TowerAttack towerAttack);
    public abstract void unBuffTower(TowerAttack towerAttack);

    protected void buffAll() {
        this.isBuffing = true;
        this.getEffectedTowerAttack().forEach(this::buffTower);
    }

    protected void unBuffAll() {
        this.isBuffing = false;
        this.getEffectedTowerAttack().forEach(this::unBuffTower);
    }

    @Override
    public void drop() {
        super.drop();
        this.isBuffing = false;
    }

    @Override
    public void goingEvolution() {
        super.goingEvolution();
        if (!this.canEvolution())
            return;
        this.unBuffAll();
    }

    @Override
    public void update(double dt) {
        super.update(dt);
        if (!this.isBuffing && this.loopCountDown <= 0)
            this.buffAll();
    }

    @Override
    public void destroy() {
        this.unBuffAll();
        super.destroy();
    }

}
