/**
 * Created by KienVN on 7/29/2016.
 */

XMLDragonBoneParser = cc.SAXParser.extend({
        parse: function (xmlTxt) {
            var xmlDoc = this._parseXML(xmlTxt);
            var plist = xmlDoc.documentElement;
            return this._parseDragonbone(plist);
        },
        _parseDragonbone:function(node)
        {
            var data = {};
            data.name = node.getAttribute("name");
            data.frameRate = node.getAttribute("frameRate");
            data.version = node.getAttribute("version");
            data.armature = [];
            for (var i = 0, len = node.childNodes.length; i < len; i++) {
                var child = node.childNodes[i];
                if (child.nodeType !== 1)
                    continue;
                data.armature.push(this._parseArmature(child));
            }
            return data;
        },
        _parseArmature:function(node){
            var armature = {};
            armature.name = node.getAttribute("name");
            armature.bone = [];
            armature.skin =[];
            armature.animation = [];

            for (var i = 0, len = node.childNodes.length; i < len; i++) {
                var child = node.childNodes[i];
                if (child.nodeType !== 1)
                    continue;
                if(child.tagName == "bone")
                {
                    armature.bone.push(this._parseBone(child));
                }
                else if(child.tagName == "skin")
                {
                    armature.skin.push(this._parseSkin(child));
                }
                else if(child.tagName == "animation")
                {
                    armature.animation.push(this._parseAnimation(child));
                }

            }
            return armature;
        },
        _parseBone: function (node) {
            var bone = {};
            bone.name = node.getAttribute("name");
            if(node.hasAttribute("parent"))
                bone.parent = node.getAttribute("parent");
            if(node.hasAttribute("length"))
                bone.parent = node.getAttribute("length");
            if(node.hasAttribute("inheritRotation"))
                bone.inheritRotation = node.getAttribute("inheritRotation");
            if(node.hasAttribute("inheritScale"))
                bone.inheritRotation = node.getAttribute("inheritScale");
            bone.transform =  this._parseTransform(node.getElementsByTagName("transform")[0]);
            return bone;
        },
        _parseSkin: function (node) {
            var skin = {};
            skin.name = node.getAttribute("name");
            skin.slot = [];
            for (var i = 0, len = node.childNodes.length; i < len; i++) {
                var child = node.childNodes[i];
                if (child.nodeType !== 1)
                    continue;
                skin.slot.push(this._parseSlot(child));
            }
            return skin;
        },
        _parseAnimation: function (node) {
            var animation = {};
            animation.name = node.getAttribute("name");
            animation.duration = node.getAttribute("duration");
            animation.tweenEasing = node.getAttribute("tweenEasing");
            animation.autoTween = node.getAttribute("autoTween");
            animation.loop = node.getAttribute("loop");
            animation.scale = node.getAttribute("scale");
            animation.fadeInTime = node.getAttribute("fadeInTime");
            animation.timeline = [];

            for (var i = 0, len = node.childNodes.length; i < len; i++) {
                var child = node.childNodes[i];
                if (child.nodeType !== 1)
                    continue;
                animation.timeline.push(this._parseTimeLine(child));
            }

            return animation;
        },
        _parseTransform:function(node)
        {
            var transform = {};
            transform.x = node.getAttribute("x");
            transform.y = node.getAttribute("y");
            transform.skX = node.getAttribute("skX");
            transform.skY = node.getAttribute("skY");
            transform.scX = node.getAttribute("scX");
            transform.scY = node.getAttribute("scY");
            transform.pX = node.getAttribute("pX");
            transform.pY = node.getAttribute("pY");
            return transform;
        },
    _parseColorTransform:function(node)
    {
        var transform = {};
        transform.aO =  node.getAttribute("aO");
        transform.rO =  node.getAttribute("rO");
        transform.gO =  node.getAttribute("gO");
        transform.bO =  node.getAttribute("bO");
        transform.aM =  node.getAttribute("aM");
        transform.rM =  node.getAttribute("rM");
        transform.gM =  node.getAttribute("gM");
        transform.bM =  node.getAttribute("bM");
        return transform;
    },
        _parseSlot:function(node)
        {
            var slot  = {};
            slot.name = node.getAttribute("name");
            slot.parent = node.getAttribute("parent");
            slot.z = (node.getAttribute("z"));
            if(node.hasAttribute("blendMode"))
                slot.blendMode = node.getAttribute("blendMode");
            slot.display = [];

            for (var i = 0, len = node.childNodes.length; i < len; i++) {
                var child = node.childNodes[i];
                if (child.nodeType !== 1)
                    continue;
                var display = {};
                display.name = child.getAttribute("name");
                display.type = child.getAttribute("type");
                display.transform =  this._parseTransform(child.getElementsByTagName("transform")[0]);
                slot.display.push(display);
            }
            return slot;
        },
        _parseTimeLine:function(node)
        {
            var timeline = {};
            timeline.name = node.getAttribute("name");
            timeline.offset = (node.getAttribute("offset"));
            timeline.scale = (node.getAttribute("scale"));
            timeline.frame = [];
            for (var i = 0, len = node.childNodes.length; i < len; i++) {
                var child = node.childNodes[i];
                if (child.nodeType !== 1)
                    continue;
                timeline.frame.push(this._parseFrame(child));
            }
            return timeline;
        },
        _parseFrame:function(node)
        {
            var frame = {};
            if(node.hasAttribute("duration"))
                frame.duration = node.getAttribute("duration");
            if(node.hasAttribute("z"))
                frame.z = (node.getAttribute("z"));
            if(node.hasAttribute("tweenEasing"))
                frame.tweenEasing = node.getAttribute("tweenEasing");
            if(node.hasAttribute("tweenRotate"))
                frame.tweenRotate = node.getAttribute("tweenRotate");
            if(node.hasAttribute("tweenScale"))
                frame.tweenScale = node.getAttribute("tweenScale");
            if(node.hasAttribute("displayIndex"))
                frame.displayIndex = node.getAttribute("displayIndex");
            var transformNode = node.getElementsByTagName("transform")[0];
            if(transformNode)
                frame.transform = this._parseTransform(transformNode);
            var colorTransformNode = node.getElementsByTagName("colorTransform")[0];
            if(colorTransformNode)
                frame.colorTransform = this._parseColorTransform(colorTransformNode);
            return frame;
        }
    }
);