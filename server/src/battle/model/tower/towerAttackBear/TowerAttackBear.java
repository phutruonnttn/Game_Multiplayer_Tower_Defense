package battle.model.tower.towerAttackBear;

import battle.GameMgr;
import battle.model.tower.towerAttack.Bullet;
import battle.model.tower.towerAttack.TowerAttack;
import model.user.card.Card;
import readjson.JsonConfig;

public class TowerAttackBear extends TowerAttack {

    public TowerAttackBear(Card card, GameMgr gameMgr) {
        super(card, gameMgr);
    }

    protected Bullet createBullet() {
        return new BulletBear(this);
    }

}
