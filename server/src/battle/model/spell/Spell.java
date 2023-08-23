package battle.model.spell;

import battle.GameMgr;
import battle.model.Coordinate;
import config.battle.BattleConfig;
import model.user.card.Card;
import readjson.JsonConfig;
import readjson.StatCard;
import readjson.StatPotion;
import util.battle.BattleUtils;

public abstract class Spell {
    public GameMgr gameMgr;
    public int spellID ;
    public int level;
    public StatPotion stat;
    public double radius;
    public double range;
    public double x;
    public double y;
    public int userAction;

    public Spell(Card card, GameMgr gameMgr, Coordinate position,int userAction) {
        this.gameMgr = gameMgr;

        // State
        this.spellID = card.getIdInJsonFile();
        this.level = card.level;
        this.userAction = userAction;
        this.stat = JsonConfig.getInstance().getStatPotion(this.spellID);
        this.radius = this.stat.getRadius(card.getRank()) * BattleConfig.SQUARE_SIZE;
        this.range = this.radius * 2;

        // So frame ma spell se ton tai
        this.x = position.getX();
        this.y = position.getY();
    }

    public boolean isInRange(Coordinate coordinate) {
        return (BattleUtils.round((this.x - coordinate.getX())*(this.x - coordinate.getX()))
                + BattleUtils.round((this.y  - coordinate.getY())*(this.y - coordinate.getY()))
                <= BattleUtils.round(this.radius * this.radius));
    }

    public abstract void update(double dt);

    public abstract int getTimeExistence();
}
