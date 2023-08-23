package cmd.response.matching;

import bitzero.server.extensions.data.BaseMsg;
import cmd.CmdDefine;
import model.battle.map.MapBattle;

import java.nio.ByteBuffer;

public class ResponseFindMatch extends BaseMsg {
    public String opponentName;
    public int opponentFame;
    public int randomSeed;
    public MapBattle playerMapBattle;
    public MapBattle opponentMapBattle;
    public int[] listPlayerDeskCard;
    public int[] listPlayerDeskCardLevel;
    public int[] listOpponentDeskCard;
    public int[] listOpponentDeskCardLevel;

    public ResponseFindMatch(String opponentName, int opponentFame, int randomSeed,
                             int[] listPlayerDeskCard, int[] listPlayerDeskCardLevel,
                             int[] listOpponentDeskCard, int[] listOpponentDeskCardLevel,
                             MapBattle playerMapBattle, MapBattle opponentMapBattle) {
        super(CmdDefine.MATCHING);
        this.opponentName = opponentName;
        this.opponentFame = opponentFame;
        this.randomSeed = randomSeed;
        this.playerMapBattle = playerMapBattle;
        this.opponentMapBattle = opponentMapBattle;
        this.listPlayerDeskCard = listPlayerDeskCard;
        this.listPlayerDeskCardLevel = listPlayerDeskCardLevel;
        this.listOpponentDeskCard = listOpponentDeskCard;
        this.listOpponentDeskCardLevel = listOpponentDeskCardLevel;
    }

    @Override
    public byte[] createData(){
        ByteBuffer bf = makeBuffer();
        putStr(bf, opponentName);
        bf.putInt(opponentFame);
        bf.putInt(randomSeed);

        loadListDeskCard(listPlayerDeskCard, bf);
        loadListDeskCardLevel(listPlayerDeskCardLevel, bf);

        loadListDeskCard(listOpponentDeskCard, bf);
        loadListDeskCardLevel(listOpponentDeskCardLevel, bf);

        loadInfoMap(playerMapBattle, bf);
        loadInfoMap(opponentMapBattle, bf);

        return packBuffer(bf);
    }

    public void loadListDeskCardLevel(int[] listDeskCardLevel, ByteBuffer bf) {
        for (int i = 0; i < listDeskCardLevel.length; i++) {
            bf.putInt(listDeskCardLevel[i]);
        }
    }

    public void loadListDeskCard(int[] listDeskCard, ByteBuffer bf) {
        for (int i = 0; i < listDeskCard.length; i++) {
            bf.putInt(listDeskCard[i]);
        }
    }

    public void loadInfoMap(MapBattle mapBattle, ByteBuffer bf) {
        for (int i = 0; i < 3; i++) {
            bf.putInt(mapBattle.getListBuff()[i].point.getX());
            bf.putInt(mapBattle.getListBuff()[i].point.getY());
        }

        bf.putInt(mapBattle.getListTree().length);
        for (int i = 0; i < mapBattle.getListTree().length; i++) {
            bf.putInt(mapBattle.getListTree()[i].point.getX());
            bf.putInt(mapBattle.getListTree()[i].point.getY());
        }

        bf.putInt(mapBattle.getListHole()[0].point.getX());
        bf.putInt(mapBattle.getListHole()[0].point.getY());

        bf.putInt(mapBattle.getBaseMap().virtualPath.length);
        for (int i = 0; i < mapBattle.getBaseMap().virtualPath.length; i++) {
            bf.putInt(mapBattle.getBaseMap().virtualPath[i].getX());
            bf.putInt(mapBattle.getBaseMap().virtualPath[i].getY());
        }
    }
}
