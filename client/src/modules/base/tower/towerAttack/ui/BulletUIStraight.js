/**
 * Created by Team 2 - LongLH - GDF 17 on 3/11/2022.
 */

var BulletUIStraight = BulletUI.extend({

    ctor: function (bulletLogic) {
        this._super(bulletLogic);
    },

    initAnimation: function (fileAnimation) {
        this.animation = fr.createAtlasAnimation(fileAnimation);
        this.animation.setVisible(false);
        this.addChild(this.animation);
    },

    reachTarget: function () {
        // Hiệu ứng nổ của đạn
        if (this.isExploding)
            return;
        this.isExploding = true;
        this.animation.setVisible(true);
        this.animation.setAnimation(0, resAniId.tower.explode, 0);
        this.animation.setCompleteListener(this._super.bind(this));
    },

});