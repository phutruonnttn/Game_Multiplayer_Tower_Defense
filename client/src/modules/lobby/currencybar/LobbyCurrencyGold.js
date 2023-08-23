/**
 * Created by Team 2 - LongLH - GDF 17 on 3/11/2022.
 */


var LobbyCurrencyGold = LobbyCurrency.extend({

    ctor: function (node) {
        this._super(node);
        this.txtAmount.setString(Utils.getInstance().formatIntToCurrencyString(gv.user.gold));
    },

    increase: function () {
        gv.user.addGold(gv.CHEAT.GOLD);
        // report to server
        getUserController().sendCheatGold();
    },

    updateUI: function (delta) {
        this._super(delta);
        gv.lobby.lobbyCardPage.updateUI();
    }

});