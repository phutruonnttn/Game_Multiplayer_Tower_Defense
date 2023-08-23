/**
 * Created by KienVN on 7/15/2016.
 */
var db;
dragonBones.Armature.prototype.getCCSlot = dragonBones.Armature.prototype.getSlot;
(function (db) {
    var DBCCFactory = (function (_super) {
        __extends(DBCCFactory, _super);
        function DBCCFactory() {
            _super.call(this);
        }
        DBCCFactory.prototype._generateArmature = function (display) {
            if(!display)
            {
                display = db.DBCCArmatureNode.create();
                display.setCascadeOpacityEnabled(true);
                display.setCascadeColorEnabled(true);

            }
            var armature = new dragonBones.Armature(display);
            display.setArmature(armature);
            return armature;
        };
        DBCCFactory.prototype._generateSlot = function (dataPackage, slotDisplayDataSet) {
            var slot =new db.DBCCSlot();
            return slot;
        };
        DBCCFactory.prototype._generateDisplay = function (textureAtlas, fullName, pivotX, pivotY) {
            
            var spriteFrame = textureAtlas.getRegion(fullName);//getRect
            var sprite = db.DBCCSprite.create(spriteFrame);
            //
            var rect = spriteFrame.getRect();
            var originalSize = spriteFrame.getOriginalSize();
            DBCCFactory._helpMatrix.a = 1;
            DBCCFactory._helpMatrix.b = 0;
            DBCCFactory._helpMatrix.c = 0;
            DBCCFactory._helpMatrix.d = 1;

            //matrix scale!
            var scale = 1 / textureAtlas.scale;
            DBCCFactory._helpMatrix = cc.affineTransformScale(DBCCFactory._helpMatrix,scale,scale);
            var anchorX = (pivotX / originalSize.width);// * -1;
            var anchorY = 1 - (pivotY / originalSize.height);// * -1;
            DBCCFactory._helpMatrix.tx = -anchorX - rect.x;
            DBCCFactory._helpMatrix.ty = -anchorY - rect.y;

            sprite.setAnchorPoint(cc.p(anchorX,anchorY));

            return sprite;
        };

        DBCCFactory.prototype.loadDragonBonesData = function (filePath, dragonBonesName) {
            if (dragonBonesName && dragonBonesName != "")
            {
                var existData = this.getSkeletonData(dragonBonesName);
                if (existData)
                {
                    return existData;
                }
            }
            var ext = cc.path.extname(filePath).toLowerCase();
            var data = null;
            if(ext == ".json") {
                data = cc.loader.getRes(filePath);
            }else {
                var xmlData = cc.loader.getRes(filePath);
                var parser = new XMLDragonBoneParser();
                data = parser.parse(xmlData);
            }
            var skeleton = dragonBones.objects.DataParser.parseSkeletonData(data);
            return this.addSkeletonData(skeleton, dragonBonesName);
        };
        DBCCFactory.prototype.loadTextureAtlas = function (filePath, dragonBonesName) {
            var existTextureAtlas = this.getTextureAtlas(dragonBonesName);
            if(existTextureAtlas)
            {
                return existTextureAtlas;
            }
            var ext = cc.path.extname(filePath).toLowerCase();
            var texture = null;
            var imgPath = "";
            var textureAtlasData = null;
            var textureCache = cc.textureCache;
            if(ext == ".json") {
                var textureData = cc.loader.getRes(filePath);
                textureAtlasData = dragonBones.objects.DataParser.parseTextureAtlasData(textureData, 1);

                imgPath = filePath.replace(".json", ".png");
                texture = textureCache.getTextureForKey(imgPath);
                if (!texture) {
                    texture = textureCache.addImage(filePath.replace(".json", ".png"));
                }
            }else if(ext == ".plist"){
                imgPath = filePath.replace(".plist", ".png");
                texture = textureCache.getTextureForKey(imgPath);
                if (!texture) {
                    texture = textureCache.addImage(imgPath);
                }
                textureAtlasData = PlistDataParser.parseTextureAtlasFile(filePath);
            }else {
                console.log("Not support file type yet!");
            }
            var textureAtlasData = new db.DBCCTextureAtlas(texture, textureAtlasData);
            this.addTextureAtlas(textureAtlasData, dragonBonesName);
            return textureAtlasData;
        };
        DBCCFactory.prototype.buildArmatureNode = function (armatureName, dragonBonesName, skinName) {
            console.log("buildArmatureNode: " + armatureName);
            var armatureNode = db.DBCCArmatureNode.create();
            armatureNode.setCascadeOpacityEnabled(true);
            armatureNode.setCascadeColorEnabled(true);
            var armature = this.buildArmature(armatureNode,armatureName, null, dragonBonesName,null, skinName);
            armatureNode.setArmature(armature);
            if (armatureNode)
            {
                armatureNode.advanceTimeBySelf(true);
            }
            return armatureNode;
        };
        DBCCFactory._baseFactory = null;
        DBCCFactory.getInstance = function()
        {
            if(DBCCFactory._baseFactory == null)
            {
                DBCCFactory._baseFactory = new db.DBCCFactory();
            }
            return DBCCFactory._baseFactory;
        };
        DBCCFactory._helpMatrix = cc.affineTransformMake(1, 0, 0, 1, 0, 0);
        return DBCCFactory;
    })(dragonBones.factorys.BaseFactory);
    db.DBCCFactory = DBCCFactory;
})(db || (db = {}));
