/**
 * Created by Team 2 - LongLH - GDF 17 on 8/11/2022.
 */


var Popup = cc.Node.extend({

    ctor: function (prevPopup) {
        this._super();
        this.prevPopup = prevPopup;
        this.initPopup();
    },

    initPopup: function () {
        let btn = gv.commonButton(cc.winSize.width, cc.winSize.height, cc.winSize.width/2, cc.winSize.height/2);
        btn.setColor(cc.color("#000000"));
        btn.setOpacity(95);
        btn.addClickEventListener(this.back.bind(this));
        this.addChild(btn);
    },

    back: function () {
        this.removeFromParent(true);
    },

    destroy: function () {
        this.back();
        if (this.prevPopup instanceof Popup)
            this.prevPopup.destroy();
    }

});

Popup.create = function (popup) {
    if (!(popup instanceof Popup))
        return;
    fr.getCurrentScreen().addChild(popup);
}