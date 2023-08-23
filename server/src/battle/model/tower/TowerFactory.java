package battle.model.tower;

import battle.GameMgr;
import battle.model.Coordinate;
import battle.model.tower.tower.Tower;
import battle.model.tower.towerAttackBear.TowerAttackBear;
import battle.model.tower.towerAttackBunny.TowerAttackBunny;
import battle.model.tower.towerAttackCrow.TowerAttackCrow;
import battle.model.tower.towerAttackFrog.TowerAttackFrog;
import battle.model.tower.towerAttackOlw.TowerAttackOlw;
import battle.model.tower.towerBuffGoat.TowerBuffGoat;
import battle.model.tower.towerBuffSnake.TowerBuffSnake;
import config.battle.BattleConfig;
import model.user.card.Card;

public class TowerFactory {

    public static Tower create(Card card, GameMgr gameMgr, Coordinate pos) {
        int towerID = card.getIdInJsonFile();
        Tower tower;
        switch (towerID) {
            case BattleConfig.TOWER_ID_OLW:
                 tower = new TowerAttackOlw(card, gameMgr);
                 break;
            case BattleConfig.TOWER_ID_CROW:
                tower = new TowerAttackCrow(card, gameMgr);
                break;
            case BattleConfig.TOWER_ID_FROG:
                tower = new TowerAttackFrog(card, gameMgr);
                break;
            case BattleConfig.TOWER_ID_BUNNY:
                tower = new TowerAttackBunny(card, gameMgr);
                break;
            case BattleConfig.TOWER_ID_BEAR:
                tower = new TowerAttackBear(card, gameMgr);
                break;
            case BattleConfig.TOWER_ID_SNAKE:
                tower = new TowerBuffSnake(card, gameMgr);
                break;
            case BattleConfig.TOWER_ID_GOAT:
                tower = new TowerBuffGoat(card, gameMgr);
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + towerID);
        }
        tower.setPosition(pos);
        return tower;
    }

}
