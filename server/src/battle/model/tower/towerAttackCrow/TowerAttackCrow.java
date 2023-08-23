package battle.model.tower.towerAttackCrow;

import battle.GameMgr;
import battle.model.tower.towerAttack.Bullet;
import battle.model.tower.towerAttack.TowerAttack;
import model.user.card.Card;

public class TowerAttackCrow extends TowerAttack {

    public TowerAttackCrow(Card card, GameMgr gameMgr) {
        super(card, gameMgr);
    }

    protected Bullet createBullet() {
        return new BulletCrow(this);
    }

}
