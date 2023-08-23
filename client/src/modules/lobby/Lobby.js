/**
 * Created by Team 2 - LongLH - GDF 17 on 3/11/2022.
 */


var gv = gv || {};

var Lobby = cc.Layer.extend({

    _pageView: "pageView",
    _lobbyHomePage: "layoutHomePage",
    _lobbyCardPage: "layoutCardPage",
    _lobbyShopPage: "layoutShopPage",
    _layoutCurrencyBar: "layoutCurrencyBar",
    _layoutNavigationBar: "layoutNavigationBar",
    _layoutGem: "layoutGem",
    _layoutGold: "layoutGold",
    _btnLogout: "btnLogout",

    ctor: function () {
        this._super();
        gv.lobby = this;
        this.initLobby();
    },

    initLobby: function () {
        this.sceneLobby = ccs.load(res.lobby_scene, "").node;

        this.addChild(this.sceneLobby);

        this.initPage();
        this.initCurrencyBar();
        this.initNavigationBar();
        this.initBtnLogout();
    },

    initPage: function () {
        this.pageView = this.sceneLobby.getChildByName(this._pageView);
        // Cài đặt sao cho khi kéo trang thì thanh navigation ở phía dưới tự động thay đổi theo
        this.pageView.addEventListener(function (sender, event) {
            if (event === ccui.PageView.EVENT_TURNING)
                this.lobbyNavigationBar.updateUI();
        }.bind(this));

        // Khơi tạo từng trang riêng lẻ
        this.lobbyHomePage = new LobbyHomePage(this.pageView.getChildByName(this._lobbyHomePage));
        this.lobbyCardPage = new LobbyCardPage(this.pageView.getChildByName(this._lobbyCardPage));
        this.lobbyShopPage = new LobbyShopPage(this.pageView.getChildByName(this._lobbyShopPage));
    },

    initCurrencyBar: function () {
        let layoutCurrencyBar = this.sceneLobby.getChildByName(this._layoutCurrencyBar);
        this.lobbyGem = new LobbyCurrencyGem(layoutCurrencyBar.getChildByName(this._layoutGem));
        this.lobbyGold = new LobbyCurrencyGold(layoutCurrencyBar.getChildByName(this._layoutGold));
    },

    initNavigationBar: function () {
        this.lobbyNavigationBar = new LobbyNavigationBar(this.sceneLobby.getChildByName(this._layoutNavigationBar), this.pageView);
    },

    initBtnLogout: function () {
        let btnLogout = this.sceneLobby.getChildByName(this._btnLogout);
        btnLogout.addClickEventListener(function () {
            cc.log("-------Logout-------");
            gv.lobby.lobbyShopPage.clearCountDown();
            fr.view(LoginScreen);
        });
    },

});