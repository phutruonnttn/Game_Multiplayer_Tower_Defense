let DarkGiantAbility = Ability.extend({
    ctor: function (owner){
        this._super(owner);
    },
    canActive: function (){
        return true;
    },
    active: function (listTower){
        var self = this;
        listTower.forEach(function (tower){
           if(tower instanceof TowerLogicAttack && !(tower.getTarget() instanceof DarkGiantLogic) && tower.canShoot(self.owner)){
               tower.setTarget(self.owner);
           }
        })
    }
})