package battle.model.tower.towerAttackBunny;

import battle.GameMgr;
import battle.model.tower.towerAttack.Bullet;
import battle.model.tower.towerAttack.TowerAttack;
import model.user.card.Card;

public class TowerAttackBunny extends TowerAttack {

    public TowerAttackBunny(Card card, GameMgr gameMgr) {
        super(card, gameMgr);
    }

    protected Bullet createBullet() {
        return new BulletBunny(this);
    }

}
