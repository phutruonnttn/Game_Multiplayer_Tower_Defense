/**
 * @author huynv6
 */
package model.user.card;


import config.user.CardConfig;
import readjson.JsonConfig;
import readjson.StatCard;

public class Card {
    public int id;
    public int amount;
    public int level;
    private StatCard stat;

    public Card(int id, int level, int amount) {
        this.id = id;
        this.amount = amount;
        this.level = level;
    }

    private StatCard getStat() {
        if (this.stat == null)
            this.stat = JsonConfig.getInstance().getStatCard(this.id);
        return this.stat;
    }

    public int getId() {
        return id;
    }

    public int getAmount() {
        return amount;
    }

    public int getLevel() {
        return level;
    }

    public int getType () {
        return CardConfig.GLOBAL_ID[this.id][CardConfig.KEY_CARD_TYPE];
    }

    public int getEnergy() {
        return this.getStat().getEnergy();
    }

    public int getIdInJsonFile() {
        return CardConfig.GLOBAL_ID[this.id][CardConfig.KEY_CARD_ID];
    }

    public int getRank() {
        return CardConfig.RANK[this.level];
    }

    public boolean hasSkill() {
        if (CardConfig.GLOBAL_ID[this.id][CardConfig.KEY_CARD_TYPE] == CardConfig.TOWER_TYPE)
            return this.level >= CardConfig.UNLOCK_TOWER_SKILL_LEVEL;
        return false;
    }
}
