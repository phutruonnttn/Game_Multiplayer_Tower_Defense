/**
 * Created by KienVN on 7/14/2016.
 */
db.DBCCArmatureNode = cc.Node.extend(
    {
        ctor:function(worldClock)
        {
            this._super();
            this.setCascadeOpacityEnabled(true);
            this.setCascadeColorEnabled(true);
            this._clock = worldClock;
            if (worldClock)
            {
                worldClock.add(this);
            }
           // this.addChild(new cc.LabelTTF("o"));
        },
        onEnter:function()
        {
            this._super();
            if (!this._clock)
            {
                this.scheduleUpdate();
            }
        },
        onExit:function()
        {
            this._super();
            if (!this._clock)
            {
                this.unscheduleUpdate();
            }
        },
        update:function(dt)
        {
            this.advanceTime(dt);
        },

        advanceTime:function(dt)
        {
            if (this.isVisible())
            {
                if (this._armature)
                    this._armature.advanceTime(dt);
            }
        },
        advanceTimeBySelf:function(on)
        {
            if (on)
            {
                this.scheduleUpdate();
            }
            else
            {
                this.unscheduleUpdate();
            }
        },
        getAnimation:function()
        {
            return this._armature.animation;
        },
        setBaseColor:function(r,g,b){
            this._needSetBaseColor = true;
            this._r = r;
            this._b = b;
            this._g = g;
            if (this._armature)
            {
                this.updateBaseColor();
            }
        },
        updateBaseColor:function()
        {
            this._needSetBaseColor = false;
            var listBones = this._armature.getBones();
            for (var i = 0; i < listBones.length; i++)
            {
                var bone = listBones[i];
                var name = bone.name;
                if (name.indexOf("color_", 0) == 0)
                {
                    var listSlots = bone.getSlots();
                    for (var j = 0; j < listSlots.length; j++)
                    {
                        var slot = listSlots[j];
                        var displayList = slot.getDisplayList();
                        for (var k = 0; k < displayList.length; k++)
                        {
                            var display = displayList[k];
                            if (display.setColorByShader){
                                display.setColorByShader(this._r, this._g, this._b);
                            }
                        }
                    }
                }
            }
        },
        gotoAndPlay:function(animationName, fadeInTime, duration, playTimes)
        {
            this._animationName = animationName;
            this._fadeInTime = fadeInTime === undefined? -1.0:fadeInTime;
            this._duration = duration === undefined?-1.0:duration;
            this._playTimes = playTimes === undefined?NaN:playTimes;

            if (this._armature)
            {
                this._needPlayAnimation = false;
                this._armature.animation.gotoAndPlay(animationName, this._fadeInTime , this._duration, this._playTimes);
            }else
            {
                this._needPlayAnimation = true;
            }
        },
        play:function()
        {
            this._animationName = "";
            if (this._armature)
            {
                this._needPlayAnimation = false;
                this._armature.animation.play();
            }
            else
            {
                this._needPlayAnimation = true;
            }
        },
        stop:function()
        {
            if (this._armature)
            {
                this._needStop = false;
                this._armature.animation.stop();
            }
            else
            {
                this._needStop = true;
            }
        },
        hasEvent:function(type)
        {
            return false;
        },
        setArmature:function(armature)
        {
            this._armature = armature;
            this._armature.addEventListener(dragonBones.events.AnimationEvent.COMPLETE, this.onComplete.bind(this));
        },
        getArmature:function()
        {
            return this._armature;
        },
        setCompleteListener:function(listener)
        {
            this._listener = listener;
        },
        onComplete:function() {
            if (this._listener)
            {
                this._listener(this);
            }
        },
        loadingDataCallBack:function(armature)
        {
            this.setArmature(armature);

            if (this._needPlayAnimation)
            {
                this._needPlayAnimation = false;
                if (!this._animationName){
                    this._armature.animation.play();
                }
                else
                {
                    this._armature.animation.gotoAndPlay(this._animationName, this._fadeInTime, this._duration, this._playTimes);
                }
            }
            if (this._needStop)
            {
                this.stop();
            }
            if (this._needSetBaseColor)
            {
                this.updateBaseColor();
            }
            if(this._loadAnimationListener)
            {
                this._loadAnimationListener(this);
            }
        },
        setFinishLoadAnimation:function(listener)
        {
            this._loadAnimationListener = listener;
        }
    }
);

db.DBCCArmatureNode.create = function()
{
    var displayContainer = new db.DBCCArmatureNode();
    return displayContainer;
};
db.DBCCArmatureNode.createWithWorldClock = function(worldClock)
{

};