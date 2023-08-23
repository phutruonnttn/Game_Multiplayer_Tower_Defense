/**
 * @author huynv6
 */

package model.user.Shop;

public class Item {

    int pieceId;
    int type;
    int amount;
    int isBought;
    int index;

    public Item(int pieceId, int amount, int type, int index){
        this.pieceId = pieceId;
        this.amount = amount;
        this.isBought = 0;
        this.type = type;
        this.index = index;
    }

    public int getPieceId() {
        return pieceId;
    }

    public int getType() {
        return type;
    }

    public int getAmount() {
        return amount;
    }

    public int getIsBought() {
        return isBought;
    }

    public int getIndex() {
        return index;
    }
}
