package battle.model.tower.towerAttack;

import battle.model.Coordinate;
import battle.model.shootable.ShootableObject;
import battle.model.shootableMonster.Monster;

public abstract class BulletChasing extends Bullet{

    protected ShootableObject target;
    private Coordinate latestTargetPos;
    private Coordinate lockedTargetPos;

    protected BulletChasing(TowerAttack towerAttack) {
        super(towerAttack);
        this.target = towerAttack.getTarget();
        this.latestTargetPos = this.target.getPosition();
    }

    protected Coordinate getToPos() {
        Coordinate toPos;
        // Kiểm tra có đang khóa tọa độ hay không
        if (this.lockedTargetPos != null) {
            // Nếu đã khóa tọa độ, không cần cập nhật tọa độ mục tiêu nữa
            toPos = this.lockedTargetPos;
        }
        else {
            // Kiểm tra mục tiêu còn tồn tại trên bản đồ hay không
            if (this.target.isDied) {
                // Nếu mục tiêu đã biến mất khỏi bản đồ, sử dụng tọa độ gần đây nhất
                toPos = this.lockedTargetPos = this.latestTargetPos;
            }
            else {
                // Nếu mục tiêu còn sống, lưu lại tọa độ mới nhất
                toPos = this.latestTargetPos = this.target.getPosition();
            }
        }
        return toPos;
    }

    protected void reachTarget () {
        if (this.damage <= 0 || this.target.isDied || !this.target.canTarget())
            return;
        this.target.decreaseHP(this.damage);
    }

}
