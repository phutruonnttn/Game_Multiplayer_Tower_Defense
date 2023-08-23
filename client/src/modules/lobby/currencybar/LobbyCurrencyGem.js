/**
 * Created by Team 2 - LongLH - GDF 17 on 3/11/2022.
 */


var LobbyCurrencyGem = LobbyCurrency.extend({

    ctor: function (node) {
        this._super(node);
        this.txtAmount.setString(Utils.getInstance().formatIntToCurrencyString(gv.user.gem));
    },

    increase: function () {
        gv.user.addGem(gv.CHEAT.GEM);
        // report to server
        getUserController().sendCheatGem();
    },

});