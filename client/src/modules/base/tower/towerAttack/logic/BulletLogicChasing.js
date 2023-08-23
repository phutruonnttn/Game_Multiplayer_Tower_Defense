/**
 * Created by Team 2 - LongLH - GDF 17 on 3/11/2022.
 */


var BulletLogicChasing = BulletLogic.extend({

    ctor: function (towerLogicAttack) {
        this._super(towerLogicAttack);
        this.target = towerLogicAttack.getTarget();
        this.latestTargetPos = this.target.getPosition();
    },

    getToPos: function () {
        let toPos;
        // Kiểm tra có đang khóa tọa độ hay không
        if (this.lockedTargetPos !== undefined) {
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
    },

    reachTarget: function () {
        if (this.damage <= 0 || this.target.isDied || !this.target.canTarget())
            return;
        this.target.decreaseHP(this.damage);
    },

});