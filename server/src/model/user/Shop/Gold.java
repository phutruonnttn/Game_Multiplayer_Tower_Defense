package model.user.Shop;

public class Gold {
    int index;
    int gold;
    int gem;

    public Gold(int index, int gold, int gem) {
        this.index = index;
        this.gold = gold;
        this.gem = gem;
    }

    public int getIndex() {
        return index;
    }

    public int getGold() {
        return gold;
    }

    public int getGem() {
        return gem;
    }
}
