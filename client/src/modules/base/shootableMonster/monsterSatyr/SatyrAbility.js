let SatyrAbility = Ability.extend({

    ctor: function (owner){
        this._super(owner);
        this.clock = 0;
        this.delay = SatyrAbilityConfig.activate.delay;
        this.getMonstersRadius = SatyrAbilityConfig.adjust.getMonstersRadius;
        this.healHpByHpPercentage = SatyrAbilityConfig.adjust.healHpByHpPercentage;
    },

    canActive: function (){
        if(this.clock == 0){
            this.clock = this.delay;
            return true;
        }
        this.clock--;
        return false;
    },
    inRange: function (monster){
        let dx = monster.position.x - this.owner.position.x;
        let dy = monster.position.y - this.owner.position.y;
        let radius = Utils.round(this.getMonstersRadius * BATTLE.SQUARE_SIZE)

        if(
            Utils.round(dx * dx )
            + Utils.round(dy * dy )
            <= Utils.round(radius * radius))
        {
            return true;
        }
        return false;
    },
    active: function (){
        let listMonster = this.owner.gameMgr.getListMonsterInCellNeighbor(this.owner.currentPoint.x,
            this.owner.currentPoint.y,
            this.getMonstersRadius);
        let self = this;
        listMonster.forEach(function (monster){
            if(monster != self.owner && monster.canTarget() && self.inRange(monster)){
                monster.buffHpUp(1, 1, monster.baseHp*self.healHpByHpPercentage);
            }
        })
    }
})


