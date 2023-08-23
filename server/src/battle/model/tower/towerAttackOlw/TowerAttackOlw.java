package battle.model.tower.towerAttackOlw;

import battle.GameMgr;
import battle.model.tower.towerAttack.Bullet;
import battle.model.tower.towerAttack.TowerAttack;
import model.user.card.Card;

public class TowerAttackOlw extends TowerAttack {

    public TowerAttackOlw(Card card, GameMgr gameMgr) {
        super(card, gameMgr);
    }

    protected Bullet createBullet() {
        return new BulletOlw(this);
    }

}
