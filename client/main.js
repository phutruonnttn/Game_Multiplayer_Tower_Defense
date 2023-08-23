/**
 * Created by Team 2 - LongLH - GDF 17 on 31/10/2022.
 */


var gv = gv || {};

cc.game.onStart = function () {

    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(true);

    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    jsb.fileUtils.addSearchPath(fr.NativeService.getFolderUpdateAssets(), true);
    jsb.fileUtils.addSearchPath(fr.NativeService.getFolderUpdateAssets() + "/res", true);
    cc.loader.resPath = "res";

    cc.LoaderScene.preload(g_resources, function () {
        // Init monster spriteFrameCache
        for (var i = 0; i < res_monster_sprite_frame.length; i++) {
            cc.spriteFrameCache.addSpriteFrames(res_monster_sprite_frame[i])
        }
        cc.spriteFrameCache.addSpriteFrames(res.monster_die_fx_sprite_frames)

        // Init Tower Cannon spriteFrameCache
        for (var i = 0; i < res_tower_sprite_frame.length; i++) {
            cc.spriteFrameCache.addSpriteFrames(res_tower_sprite_frame[i])
        }

        //hide fps
        cc.director.setDisplayStats(true);

        DESIGN_RESOLUTION_WIDTH = SCREEN.RESOLUTION.WIDTH;
        DESIGN_RESOLUTION_HEIGHT = SCREEN.RESOLUTION.HEIGHT;
        cc.view.setDesignResolutionSize(DESIGN_RESOLUTION_WIDTH,DESIGN_RESOLUTION_HEIGHT, cc.ResolutionPolicy.SHOW_ALL);

        //socket
        gv.gameClient = new GameClient();
        gv.poolObjects = new PoolObject();

        //modules
        networkManager.connector = new networkManager.Connector(gv.gameClient);

        //JSON
        gv.MONSTER_JSON = cc.loader.getRes("json_config/Monster.json");
        gv.TOWER_JSON = cc.loader.getRes("json_config/Tower.json");
        gv.POTION_JSON = cc.loader.getRes("json_config/Potion.json");
        gv.TOWER_BUFF_JSON = cc.loader.getRes("json_config/TowerBuff.json");
        gv.TARGET_BUFF_JSON = cc.loader.getRes("json_config/TargetBuff.json");

        new User();

        fr.view(LoginScreen, 0);
        // fr.view(BattleScene, 0);
    }, this);
};

cc.game.run();