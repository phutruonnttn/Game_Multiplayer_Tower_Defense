/**
 * Created by Team 2 - LongLH - GDF 17 on 3/11/2022.
 */


var LobbyCurrency = cc.Class.extend({

    _txtAmount: "txtAmount",
    _btnIncrease: "btnIncrease",

    ctor: function (layoutCurrency) {
        this.layoutCurrency = layoutCurrency;
        this.init();
    },

    init: function () {
        this.txtAmount = this.layoutCurrency.getChildByName(this._txtAmount);
        this.btnIncrease = this.layoutCurrency.getChildByName(this._btnIncrease);
        this.btnIncrease.addClickEventListener(this.increase.bind(this));
    },

    updateUI: function (delta) {
        if (this.txtAmount === undefined || delta === undefined)
            return;
        EffectLobby.changeNumberLabel(this.txtAmount, delta, 0.3);
    },

});