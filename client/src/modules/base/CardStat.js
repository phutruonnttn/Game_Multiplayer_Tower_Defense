/**
 * Created by Team 2 - LongLH - GDF 17 on 9/11/2022.
 */

var cardStat;

var CardStat = cc.Class.extend({

    ctor: function () {

    },

    getStat: function (cardID, level = 1, evolution = 1) {
        let type = CARD.GLOBAL_ID[cardID].TYPE;
        let id = CARD.GLOBAL_ID[cardID].ID;
        switch (type) {
            case CARD.MONSTER_TYPE:
                return this.getStatMonster(id, level);
            case CARD.POTION_TYPE:
                return this.getStatPotion(id, level);
            case CARD.TOWER_TYPE:
                return this.getStatTower(id, level, evolution);
            default:
                return {};
        }
    },

    getClone: function (object) {
        let clone = {};
        for (let key in object)
            clone[key] = object[key];
        return clone;
    },

    getStatMonster: function (id, level = 1) {
        let stat = this.getClone(gv.MONSTER_JSON.monster[id]);
        stat.hp *= 1 + 0.1 * (level - 1);
        stat.moveType = stat.moveType == "land" ? BATTLE.MONSTER_WALK : BATTLE.MONSTER_FLY;
        return stat;
    },

    getStatTower: function (id, level = 1, evolution = 1) {
        let stat = this.getClone(gv.TOWER_JSON.tower[id]);
        for (let key in stat.stat[evolution])
            stat[key] = stat.stat[evolution][key];
        stat.stat = undefined;

        if (stat.bulletTargetBuffType !== undefined && stat.bulletTargetBuffType !== -1) {
            let targetBuff = this.getTargetBuff(stat.bulletTargetBuffType, level, evolution);
            this.appendBuffAttribute(stat, targetBuff);
        }

        if (stat.auraTowerBuffType !== undefined && stat.auraTowerBuffType !== -1) {
            let towerBuff = this.getTowerBuff(stat.auraTowerBuffType, level, evolution);
            this.appendBuffAttribute(stat, towerBuff);
        }

        stat.damage *= 1 + 0.1 * (level - 1);

        return stat;
    },

    getStatPotion: function (id, level = 1) {
        let rank = CARD.RANK[level];
        let stat = this.getClone(gv.POTION_JSON.potion[id]);

        stat.radius = gv.POTION_JSON.radius[stat.radiusType].value + gv.POTION_JSON.radius[stat.radiusType].increasePerRank * (rank - 1);

        if (stat.statPerLevel !== undefined) {
            for (let child in stat.statPerLevel)
                stat[child] = stat.statPerLevel[child][level];
        }

        if (stat.adjust === undefined)
            return stat;

        let adjust = stat.adjust;
        if (adjust.player !== undefined)
            adjust = adjust.player;
        if (adjust.enemy !== undefined)
            adjust = adjust.enemy;

        switch (adjust.type) {
            case ("targetBuffType"):
                let targetBuff = this.getTargetBuff(adjust.value, level);
                this.appendBuffAttribute(stat, targetBuff);
                break;
            case ("towerBuffType"):
                let towerBuff = this.getTowerBuff(adjust.value, level);
                this.appendBuffAttribute(stat, towerBuff);
                break;
        }
        return stat;
    },

    getTargetBuff: function (targetBuffType, level = 1, evolution = 1) {
        let buff = {};
        let targetBuff = this.getClone(gv.TARGET_BUFF_JSON.targetBuff[targetBuffType]);
        if (targetBuff.durationType === CARD.EFFECT_DURATION.LIMITED) {
            buff.duration = targetBuff.duration[evolution];
            if (targetBuff.durationUseCardLevel === true)
                buff.duration *= 1 + 0.1 * (level - 1);
        }
        buff[targetBuff.effects[evolution][0].name] = targetBuff.effects[evolution][0].value;
        return buff;
    },

    getTowerBuff: function (towerBuffType, level = 1, evolution = 1) {
        let buff = {};
        let towerBuff = this.getClone(gv.TOWER_BUFF_JSON.towerBuff[towerBuffType]);
        if (towerBuff.durationType === CARD.EFFECT_DURATION.LIMITED) {
            buff.duration = towerBuff.duration[evolution];
            if (towerBuff.durationUseCardLevel === true)
                buff.duration *= 1 + 0.1 * (level - 1);
        }
        buff[towerBuff.effects[evolution][0].name] = towerBuff.effects[evolution][0].value;
        return buff;
    },

    appendBuffAttribute: function (target, buff) {
        for (let key in buff)
            if (!(key in target))
                target[key] = buff[key];
    }

});

CardStat.getInstance = function () {
    if (cardStat === undefined)
        cardStat = new CardStat();
    return cardStat;
};