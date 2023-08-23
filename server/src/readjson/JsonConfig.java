package readjson;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import config.battle.BattleConfig;
import config.user.CardConfig;
import model.user.card.Card;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;

public class JsonConfig {

    private static JsonConfig instance = null;
    private final ObjectMapper jsonMapper;
    private final Gson gson;
    private HashMap<Integer, StatMonster> statMonster;
    private HashMap<Integer, PotionRadius> potionRadius;
    private HashMap<Integer, StatPotion> statPotion;
    private HashMap<Integer, StatTower> statTower;
    private HashMap<Integer, BuffTarget> buffTarget;
    private HashMap<Integer, BuffTower> buffTower;

    private JsonConfig() {
        this.jsonMapper = new ObjectMapper();
        this.gson = new Gson();
        try {
            this.readMonsterStat();
            this.readPotionStat();
            this.readTowerStat();
            this.readTargetBuffConfig();
            this.readTowerBuffConfig();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static JsonConfig getInstance() {
        if (instance == null)
            instance = new JsonConfig();
        return instance;
    }

    private void readMonsterStat() throws IOException {
        String path = "conf/json_config/Monster.json";
        File f = new File(path);
        String jsonStr = FileUtils.readFileToString(f, "utf-8");
        JsonNode jsonMonster = this.jsonMapper.readTree(jsonStr).get("monster");

        Type typeMonsterStat = new TypeToken<HashMap<Integer, StatMonster>>() {}.getType();
        this.statMonster = this.gson.fromJson(jsonMonster.toString(), typeMonsterStat);
    }

    private void readPotionStat() throws IOException {
        String path = "conf/json_config/Potion.json";
        File f = new File(path);
        String jsonStr = FileUtils.readFileToString(f, "utf-8");
        JsonNode jsonNode = this.jsonMapper.readTree(jsonStr);
        JsonNode jsonPotionRadius = jsonNode.get("radius");
        JsonNode jsonPotion = jsonNode.get("potion");

        Type typePotionRadius = new TypeToken<HashMap<Integer, PotionRadius>>() {}.getType();
        this.potionRadius = this.gson.fromJson(jsonPotionRadius.toString(), typePotionRadius);

        Type typePotionStat = new TypeToken<HashMap<Integer, StatPotion>>() {}.getType();
        this.statPotion = this.gson.fromJson(jsonPotion.toString(), typePotionStat);
    }

    private void readTowerStat() throws IOException {
        String path = "conf/json_config/Tower.json";
        File f = new File(path);
        String jsonStr = FileUtils.readFileToString(f, "utf-8");
        JsonNode jsonNode = this.jsonMapper.readTree(jsonStr);

        BattleConfig.TOWER_BUILDING_TIME = jsonNode.get("buildingTime").asInt();
        JsonNode jsonTower = jsonNode.get("tower");

        Type typeTowerStat = new TypeToken<HashMap<Integer, StatTower>>() {}.getType();
        this.statTower = this.gson.fromJson(jsonTower.toString(), typeTowerStat);
    }

    private void readTargetBuffConfig() throws IOException {
        String path = "conf/json_config/TargetBuff.json";
        File f = new File(path);
        String jsonStr = FileUtils.readFileToString(f, "utf-8");
        JsonNode jsonNode = this.jsonMapper.readTree(jsonStr);
        JsonNode jsonBuffTarget = jsonNode.get("targetBuff");

        Type typeBuffTarget = new TypeToken<HashMap<Integer, BuffTarget>>() {}.getType();
        this.buffTarget = this.gson.fromJson(jsonBuffTarget.toString(), typeBuffTarget);
    }

    private void readTowerBuffConfig() throws IOException {
        String path = "conf/json_config/TowerBuff.json";
        File f = new File(path);
        String jsonStr = FileUtils.readFileToString(f, "utf-8");
        JsonNode jsonBuffTower = this.jsonMapper.readTree(jsonStr).get("towerBuff");

        Type typeBuffTower = new TypeToken<HashMap<Integer, BuffTower>>() {}.getType();
        this.buffTower = this.gson.fromJson(jsonBuffTower.toString(), typeBuffTower);
    }

    public StatCard getStatCard(int cardID) {
        switch (CardConfig.GLOBAL_ID[cardID][CardConfig.KEY_CARD_TYPE]) {
            case CardConfig.MONSTER_TYPE:
                return this.getStatMonster(CardConfig.GLOBAL_ID[cardID][CardConfig.KEY_CARD_ID]);
            case CardConfig.POTION_TYPE:
                return this.getStatPotion(CardConfig.GLOBAL_ID[cardID][CardConfig.KEY_CARD_ID]);
            case CardConfig.TOWER_TYPE:
                return this.getStatTower(CardConfig.GLOBAL_ID[cardID][CardConfig.KEY_CARD_ID]);
            default:
                throw new IllegalStateException("Unexpected value: " + CardConfig.GLOBAL_ID[cardID][CardConfig.KEY_CARD_TYPE]);
        }
    }

    public StatMonster getStatMonster(int monsterID) {
        return this.statMonster.get(monsterID);
    }

    public PotionRadius getPotionRadius(int potionRadiusID) {
        return this.potionRadius.get(potionRadiusID);
    }

    public StatPotion getStatPotion(int potionID) {
        return this.statPotion.get(potionID);
    }

    public StatTower getStatTower(int towerID) {
        return this.statTower.get(towerID);
    }

    public BuffTarget getBuffTarget(int targetBuffID) {
        return this.buffTarget.get(targetBuffID);
    }

    public BuffTower getBuffTower(int towerBuffID) {
        return this.buffTower.get(towerBuffID);
    }

}
