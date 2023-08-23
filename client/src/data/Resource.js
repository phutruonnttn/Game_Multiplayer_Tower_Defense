/**
 * Created by Team 2 - LongLH - GDF 17 on 31/10/2022.
 */

var res = res || {};

var res_monster_sprite_frame = [
    "res/monster/frame/assassin/assassin.plist",
    "res/monster/frame/bat/bat.plist",
    "res/monster/frame/dark_giant/dark_giant.plist",
    "res/monster/frame/demon_tree/demon_tree.plist",
    "res/monster/frame/demon_tree_minion/demon_tree_minion.plist",
    "res/monster/frame/desert_king/desert_king.plist",
    "res/monster/frame/dragon/dragon.plist",
    "res/monster/frame/giant/giant.plist",
    "res/monster/frame/golem/golem.plist",
    "res/monster/frame/golem_minion/golem_minion.plist",
    "res/monster/frame/iceman/iceman.plist",
    "res/monster/frame/ninja/ninja.plist",
    "res/monster/frame/satyr/satyr.plist",
    "res/monster/frame/swordsman/swordsman.plist",
];

var res_tower_sprite_frame = [
    "res/tower/sprite_sheet/tower_attack_speed_1_2.plist",
    "res/tower/sprite_sheet/tower_attack_speed_3.plist",
    "res/tower/sprite_sheet/tower_boomerang_1_2.plist",
    "res/tower/sprite_sheet/tower_boomerang_3.plist",
    "res/tower/sprite_sheet/tower_cannon_1_2.plist",
    "res/tower/sprite_sheet/tower_cannon_3.plist",
    "res/tower/sprite_sheet/tower_damage_1_2.plist",
    "res/tower/sprite_sheet/tower_damage_3.plist",
    "res/tower/sprite_sheet/tower_ice_gun_1.plist",
    "res/tower/sprite_sheet/tower_ice_gun_2_3.plist",
    "res/tower/sprite_sheet/tower_oil_gun_1_2.plist",
    "res/tower/sprite_sheet/tower_oil_gun_3.plist",
    "res/tower/sprite_sheet/tower_wizard_1_2.plist",
    "res/tower/sprite_sheet/tower_wizard_3.plist",
];

var res_tower_pedestal = {
    1: "res/battle/battle_tower_pedestal_wood.png",
    2: "res/battle/battle_tower_pedestal_rock.png",
    3: "res/battle/battle_tower_pedestal_steel.png",
};

res.card_ui = "ui/CardUI.json";
res.lobby_scene = "ui/sceneLobby.json";
res.lobby_chest_list_ui = "ui/LobbyChestListUI.json";
res.lobby_chest_popup_ui = "ui/LobbyChestPopupUI.json";
res.lobby_card_popup_ui = "ui/LobbyCardPopupUI.json";
res.card_popup_ui = "ui/CardPopupUI.json";
res.card_skill_popup_ui = "ui/CardSkillPopupUI.json";
res.card_upgrade = "ui/CardUpgrade.json";
res.open_chest_ui = "ui/OpenChest.json";
res.battle_card = "ui/BattleCard.json"
res.house_attacked = "ui/HouseAttacked.json"
res.battle_result = "ui/BattleResult.json"
res.battle_scene = "ui/BattleScene.json"
res.control_panel = "ui/ControlPanel.json"
res.lobby_shop_card_popup_ui = "ui/LobbyShopCardPopup.json"
res.lobby_buy_gold_popup_ui = "ui/PopUpBuyGold.json"
res.lobby_shop_item_daily = "ui/ItemDailyShop.json"
res.battle_tower_option = "ui/BattleTowerOption.json"

res.map_ui_sprite_frames = "res/plist/inMapUI.plist"
res.monster_die_fx_sprite_frames = "res/battle/monster_die_fx.plist"

res.font = {
    SVN_Supercell_Magic: "res/font/SVN-Supercell Magic.ttf"
}

res.base = {};
res.base.img_btn_disable =  "Default/Button_Disable.png";
res.base.img_btn_press = "Default/Button_Disable.png";
res.base.img_btn_normal = "Default/Button_Normal.png";

res.naviagtion_bar = {
    img_btn_normal: [
        "lobby/lobby_page_btn_0.png",
        "lobby/lobby_page_btn_1.png",
    ],
    img_btn_selecting: "lobby/lobby_page_btn_selecting.png",
};

res.chest_image = {
    0: "common/common_treasure.png"
}

res.card = {};
res.card.image = {
    // Monster
    0: "card/card_monster_swordsman.png",
    1: "card/card_monster_assassin.png",
    2: "card/card_monster_giant.png",
    3: "card/card_monster_bat.png",
    4: "card/card_monster_ninja.png",

    // Spell
    5: "card/card_potion_fireball.png",
    6: "card/card_potion_frozen.png",
    7: "card/card_potion_heal.png",
    8: "card/card_potion_speed_up.png",
    9: "card/card_potion_trap.png",
    10: "card/card_potion_power.png",

    // Tower
    11: "card/card_tower_cannon.png",
    12: "card/card_tower_wizard.png",
    13: "card/card_tower_boomerang.png",
    14: "card/card_tower_oil_gun.png",
    15: "card/card_tower_ice_gun.png",
    16: "card/card_tower_damage.png",
    17: "card/card_tower_attack_speed.png",
};


res.card.background = {
    1: {
        background: "card/card_background_1.png",
        border: "card/card_border_1.png",
        glow: "lobby/lobby_card_panel_miniature_glow_common.png",
        miniature_particle: "lobby/fx/miniature_rarity_particle_1.plist",
    },
    2: {
        background: "card/card_background_2.png",
        border: "card/card_border_2.png",
        glow: "lobby/lobby_card_panel_miniature_glow_rare.png",
        miniature_particle: "lobby/fx/miniature_rarity_particle_2.plist",
    },
    3: {
        background: "card/card_background_3.png",
        border: "card/card_border_3.png",
        glow: "lobby/lobby_card_panel_miniature_glow_epic.png",
        miniature_particle: "lobby/fx/miniature_rarity_particle_3.plist",
    },
    4: {
        background: "card/card_background_4.png",
        border: "card/card_border_4.png",
        glow: "lobby/lobby_card_panel_miniature_glow_legend.png",
        miniature_particle: "lobby/fx/miniature_rarity_particle_4.plist",
    },
};
res.card.process = {
    default: "lobby/lobby_card_progress.png",
    max: "lobby/lobby_card_progress_max.png",
};
res.card.miniature = {
    // Monster
    0: ["card/miniature_monster_swordsman.png"],
    1: ["card/miniature_monster_assassin.png"],
    2: ["card/miniature_monster_giant.png"],
    3: ["card/miniature_monster_bat.png"],
    4: ["card/miniature_monster_ninja.png"],

    // Spell
    5: ["card/card_potion_fireball.png"],
    6: ["card/card_potion_frozen.png"],
    7: ["card/card_potion_heal.png"],
    8: ["card/card_potion_speed_up.png"],
    9: ["card/card_potion_trap.png"],
    10: ["card/card_potion_power.png"],

    // Tower
    11: [
        "card/miniature_tower_cannon_1.png",
        "card/miniature_tower_cannon_2.png",
        "card/miniature_tower_cannon_3.png",
    ],
    12: [
        "card/miniature_tower_wizard_1.png",
        "card/miniature_tower_wizard_2.png",
        "card/miniature_tower_wizard_3.png",
    ],
    13: [
        "card/miniature_tower_boomerang_1.png",
        "card/miniature_tower_boomerang_2.png",
        "card/miniature_tower_boomerang_3.png",
    ],
    14: [
        "card/miniature_tower_oil_gun_1.png",
        "card/miniature_tower_oil_gun_2.png",
        "card/miniature_tower_oil_gun_3.png",
    ],
    15: [
        "card/miniature_tower_ice_gun_1.png",
        "card/miniature_tower_ice_gun_2.png",
        "card/miniature_tower_ice_gun_3.png",
    ],
    16: [
        "card/miniature_tower_damage_1.png",
        "card/miniature_tower_damage_2.png",
        "card/miniature_tower_damage_3.png",
    ],
    17: [
        "card/miniature_tower_attack_speed_1.png",
        "card/miniature_tower_attack_speed_2.png",
        "card/miniature_tower_attack_speed_3.png",
    ],
};
res.card.skill = {
    stun: "skill/skill_icon_stun.png",
    resonance: "skill/icon_skill_05.png",
    bonus_damage: "skill/icon_skill_02.png",
    poison: "skill/skill_icon_poison.png",
    armor_break: "skill/skill_icon_armor_break.png",
    burn: "skill/skill_icon_burn.png",
    slow: "skill/skill_icon_slow.png",
}
res.card.stat = {
    attack_speed: {
        text: "Tốc đánh:",
        icon: "card/stat_icon/stat_icon_attack_speed.png",
    },
    attack_speed_up: {
        text: "Tăng tốc đánh:",
        icon: "card/stat_icon/stat_icon_attack_speed_up.png",
    },
    bullet_radius: {
        text: "Kích thước đạn:",
        icon: "card/stat_icon/stat_icon_bullet_radius.png"
    },
    damage: {
        text: "Sát thương:",
        icon: "card/stat_icon/stat_icon_damage.png",
    },
    damage_up: {
        text: "Sát thương tăng:",
        icon: "card/stat_icon/stat_icon_damage_up.png"
    },
    energy_gain: {
        text: "Năng lượng:",
        icon: "card/stat_icon/stat_icon_energy_gain.png"
    },
    evasion: {
        text: "Loại bắn:",
        icon: "card/stat_icon/stat_icon_evasion.png"
    },
    heal: {
        text: "Máu:",
        icon: "card/stat_icon/stat_icon_heal.png"
    },
    health_up: {
        text: "Máu hồi:",
        icon: "card/stat_icon/stat_icon_health_up.png"
    },
    hp: {
        text: "Máu:",
        icon: "card/stat_icon/stat_icon_hp.png"
    },
    immobilize:{
        text: "Làm chậm:",
        icon: "card/stat_icon/stat_icon_immobilize.png",
    },
    number_monsters: {
        text: "Số lượng:",
        icon: "card/stat_icon/stat_icon_number_monsters.png"
    },
    potion_range: {
        text: "Tầm:",
        icon: "card/stat_icon/stat_icon_potion_range.png"
    },
    range: {
        text: "Tầm bắn:",
        icon: "card/stat_icon/stat_icon_range.png"
    },
    range_up: {
        text: "Tầm tăng:",
        icon: "card/stat_icon/stat_icon_range_up.png"
    },
    special: {
        text: "",
        icon: "card/stat_icon/stat_icon_special.png"
    },
    speed: {
        text: "Tốc độ:",
        icon: "card/stat_icon/stat_icon_speed.png"
    },
    time: {
        text: "Hiệu lực:",
        icon: "card/stat_icon/stat_icon_time.png"
    },
};

res.button = {
    upgrade: "common/common_btn_green.png",
    disable: "common/common_btn_gray.png",
};

res.shop = {
    particle_shop_gold_plist: "res/lobby/fx/fx_particle_shop_gold.plist",
}

res.battle = {
    shadow_red_png: "res/battle/shadow_red.png",
    shadow_blue_png: "res/battle/shadow_blue.png",
    shadow_png: "res/battle/shadow.png",
    common_notification_bar_png: "res/common/common_notification_bar.png",
    greenCloud_png: "res/battle/greenCloud.png",
    battle_target_hp_png: "res/battle/battle_target_hp.png",
    battle_target_hp_background_png: "res/battle/battle_target_hp_background.png",
    common_btn_gray_png: "res/common/common_btn_gray.png",
    arena_particle_plist: "res/common/fx/arena_particle.plist",
    common_btn_red_png: "res/common/common_btn_red.png",
    lobby_home_arena_glow_png: "res/lobby/lobby_home_arena_glow.png",
    map_icon_forest_atlas: "res/map/fx/map_icon_forest.atlas",
    map_icon_forest_json: "res/map/fx/map_icon_forest.json",
    common_icon_glass_png: "res/common/common_icon_glass.png",
    absolute_transparent_png: "res/battle/transparent.png",
    lobby_background_png: "res/lobby/lobby_background.png",
    progress_bar_png: "res/battle/progressBar.png",
    fx_result: "res/battle_result/fx/fx_result_",
    battle_timer_border_png: "battle_timer_border.png",
    battle_timer_png: "battle_timer.png",
    battle_timer_background_png: "battle_timer_background.png",
    as_duoi_json: "res/map/fx/as_duoi.json",
    as_duoi_atlas: "res/map/fx/as_duoi.atlas",
    as_tren_json: "res/map/fx/as_tren.json",
    as_tren_atlas: "res/map/fx/as_tren.atlas",
    icon_arrow_png: "ui_icon_arrow.png",
    battle_item: "battle_item_",
    caution_png: "caution.png",
    map_forest_obstacle_prefix: "res/map/map_forest_obstacle_",
    transparent_square_png: "ui_transparent_square.png",
    explosion_start_png: "res/battle/explosion_start.png",
    battle_tower_range_player_png: "res/battle/battle_tower_range_player.png",
    battle_potion_range_png: "res/battle/battle_potion_range.png"
};

var g_resources = [

];

var loadRes = function (res) {
    if (typeof(res) == "string") {
        g_resources.push(res);
        return;
    }
    for (let key in res)
        loadRes(res[key]);
}

loadRes(res);
