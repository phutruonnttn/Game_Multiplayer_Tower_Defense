let Ability = cc.Class.extend({
    ctor: function (owner){
        this.owner = owner;
    },
    canActive: function (){
        return false;
    },
    active: function (){
        //do something
    }
})