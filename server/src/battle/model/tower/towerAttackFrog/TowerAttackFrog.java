package battle.model.tower.towerAttackFrog;

import battle.GameMgr;
import battle.model.tower.towerAttack.Bullet;
import battle.model.tower.towerAttack.TowerAttack;
import model.user.card.Card;

public class TowerAttackFrog extends TowerAttack {

    public TowerAttackFrog(Card card, GameMgr gameMgr) {
        super(card, gameMgr);
    }

    protected Bullet createBullet() {
        return new BulletFrog(this);
    }

}
