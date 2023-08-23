package battle.model.shootableMonster.config;

import java.util.ArrayList;

public class TurnMonsterConfig {
    public static int[][] TYPE = {
        {
            3 // BAT
        },
        {
            0, // SWORDSMAN
            1, // ASSASSIN
            2, // GIANT
            4 // NINJA
        },
        {
            5, // DARK_GIANT
            6 // SATYR
        },
        {
            0 // SWORDSMAN
        }
    };

    public static int BOSS_TYPE = 2;

    public static MonsterType[] CAST_TO_MONSTER_TYPE = {
        MonsterType.SWORDSMAN,
        MonsterType.ASSASSIN,
        MonsterType.GIANT,
        MonsterType.BAT,
        MonsterType.NINJA,
        MonsterType.DARK_GIANT,
        MonsterType.SATYR
    };

    public static int[] AMOUNT_OF_TYPE = {
        3, // SWORDSMAN
        3, // ASSASSIN
        1, // GIANT
        3, // BAT
        3, // NINJA
        1, // DARK_GIANT
        1 // SATYR
    };

    public static RatioMonsterTurn[] RATIO = {
        new RatioMonsterTurn(1,1), // Tong cap tru = 0
        new RatioMonsterTurn(1,1), // 1
        new RatioMonsterTurn(1,1), // 2
        new RatioMonsterTurn(1,1), // 3
        new RatioMonsterTurn(1,1), // 4

        new RatioMonsterTurn(2,5), // 5
        new RatioMonsterTurn(2,5), // 6
        new RatioMonsterTurn(2,5), // 7
        new RatioMonsterTurn(2,5), // 8
        new RatioMonsterTurn(2,5), // 9

        new RatioMonsterTurn(3,10), // 10
        new RatioMonsterTurn(3,10), // 11
        new RatioMonsterTurn(3,10), // 12
        new RatioMonsterTurn(3,10), // 13
        new RatioMonsterTurn(3,10), // 14

        new RatioMonsterTurn(4,10), // 15
        new RatioMonsterTurn(4,10), // 16
        new RatioMonsterTurn(4,10), // 17
        new RatioMonsterTurn(4,10), // 18
        new RatioMonsterTurn(4,10), // 19

        new RatioMonsterTurn(5,20), // 20
        new RatioMonsterTurn(5,20), // 21
        new RatioMonsterTurn(5,20), // 22
        new RatioMonsterTurn(5,20), // 23
        new RatioMonsterTurn(5,20), // 24

        new RatioMonsterTurn(6,20), // 25
        new RatioMonsterTurn(6,20), // 26
        new RatioMonsterTurn(6,20), // 27
        new RatioMonsterTurn(6,20), // 28
        new RatioMonsterTurn(6,20), // 29

        new RatioMonsterTurn(7,30), // 30
    };

    public static ArrayList<ArrayList<MonsterTurn>> TURN = new ArrayList<ArrayList<MonsterTurn>>() {{
        //Turn 0
        add(new ArrayList<MonsterTurn>());

        //Turn 1
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(3, 1));
        }});

        // Turn 2
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 1));
        }});

        // Turn 3
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 1));
        }});

        // Turn 4
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 0.2));
            add(new MonsterTurn(1, 0.8));
        }});

        // Turn 5
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(2, 1));
        }});

        // Turn 6
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 0.5));
            add(new MonsterTurn(1, 0.5));
        }});

        // Turn 7
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(0, 1));
        }});

        // Turn 8
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(0, 0.5));
            add(new MonsterTurn(1, 0.75));
        }});

        // Turn 9
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(0, 0.8));
            add(new MonsterTurn(1, 0.4));
        }});

        // Turn 10
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(2, 1));
        }});

        // Turn 11
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 0.5));
            add(new MonsterTurn(1, 0.5));
            add(new MonsterTurn(1, 0.5));
        }});

        // Turn 12
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 0.75));
            add(new MonsterTurn(1, 0.5));
            add(new MonsterTurn(1, 0.5));
        }});

        // Turn 13
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 0.75));
            add(new MonsterTurn(1, 0.5));
            add(new MonsterTurn(0, 0.2));
        }});

        // Turn 14
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 0.75));
            add(new MonsterTurn(1, 0.5));
            add(new MonsterTurn(0, 0.5));
        }});

        // Turn 15
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(2, 1));
            add(new MonsterTurn(1, 1));
        }});

        // Turn 16
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 1));
            add(new MonsterTurn(1, 1));
        }});

        // Turn 17
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 1));
            add(new MonsterTurn(0, 1));
        }});

        // Turn 18
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 1));
            add(new MonsterTurn(1, 1));
            add(new MonsterTurn(1, 0.5));
        }});

        // Turn 19
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(1, 1));
            add(new MonsterTurn(1, 1));
            add(new MonsterTurn(0, 1));
        }});

        // Turn 20
        add(new ArrayList<MonsterTurn>() {{
            add(new MonsterTurn(2, 1));
            add(new MonsterTurn(1, 1));
            add(new MonsterTurn(0, 1));
        }});
    }};

}