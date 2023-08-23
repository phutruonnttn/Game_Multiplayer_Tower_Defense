/**
 * Created by KienVN on 8/2/2016.
 */

_dbccHelper = null;
db.DBCCHelper = cc.Class.extend(
    {
        buildAsyncArmatureNode:function(skeletonFilePath, textureFilePath, armatureName, dragonBonesName)
        {
            //db.DBCCFactory.getInstance().loadTextureAtlas(textureFilePath, dragonBonesName);
            //db.DBCCFactory.getInstance().loadDragonBonesData(skeletonFilePath, dragonBonesName);
            //return db.DBCCFactory.getInstance().buildArmatureNode(armatureName);

            var armatureNode = db.DBCCArmatureNode.create();
            armatureNode.setCascadeOpacityEnabled(true);
            armatureNode.setCascadeColorEnabled(true);
            if (armatureNode)
            {
                armatureNode.advanceTimeBySelf(true);
            }
            cc.loader.loadTxt(cc.path.join(cc.loader.resPath, skeletonFilePath), function(error, data) {
                if (error) {
                    console.error("Can't load file: " + skeletonFilePath);
                    return;
                }
                cc.loader.cache[skeletonFilePath] = data;
                cc.loader.loadTxt(cc.path.join(cc.loader.resPath, textureFilePath), function(error, data) {
                    if (error) {
                        console.log("Can't load file: " + textureFilePath);
                        return;
                    }
                    cc.loader.cache[textureFilePath] = cc.plistParser.parse(data);
                    var imgPath = textureFilePath.replace(".plist", ".png");
                    cc.textureCache.addImageAsync(imgPath,function(texture){
                        if(texture instanceof cc.Texture2D && texture.getContentSize().width > 0 && texture.getContentSize().height > 0)
                        {
                            db.DBCCFactory.getInstance().loadTextureAtlas(textureFilePath, dragonBonesName);
                            db.DBCCFactory.getInstance().loadDragonBonesData(skeletonFilePath, dragonBonesName);
                            var armature = db.DBCCFactory.getInstance().buildArmature(armatureNode,armatureName, null, dragonBonesName,null, null);
                            armatureNode.setArmature(armature);
                            armatureNode.loadingDataCallBack(armature);
                        }
                    },this);
                });
            });
            return armatureNode;

        }
    }
);
db.DBCCHelper.getInstance = function()
{
    if(!_dbccHelper)
    {
        _dbccHelper = new db.DBCCHelper();
    }
    return _dbccHelper;
};
db.DBCCHelper.isSupportCallbackLoadAni = true;