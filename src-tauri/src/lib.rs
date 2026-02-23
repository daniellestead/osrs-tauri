use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct Skill {
    name: String,
    level: u32,
    xp: u64,
}

#[derive(Debug, Serialize, Deserialize)]
struct Item {
    icon: String,
    icon_large: String,
    id: u32,
    r#type: String,
    #[serde(rename = "typeIcon")]
    type_icon: String,
    name: String,
    description: String,
    members: String,
}

#[derive(Debug, Deserialize)]
struct ItemsResponse {
    items: Vec<Item>,
}

#[derive(Debug, Deserialize)]
struct ResponseStats {
    skills: Vec<ResponseSkill>,
}

#[derive(Debug, Deserialize)]
struct ResponseSkill {
    name: String,
    level: u32,
    xp: u64,
}

#[tauri::command]
async fn lookup_player(player_name: String) -> Result<Vec<Skill>, String> {
    let request_url = format!(
        "https://secure.runescape.com/m=hiscore_oldschool/index_lite.json?player={}",
        player_name
    );

    let client = reqwest::Client::new();
    let response = client
        .get(&request_url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch player stats: {}", e))?
        .text()
        .await
        .map_err(|e| format!("Failed to read response: {}", e))?;

    let parsed: ResponseStats =
        serde_json::from_str(&response).map_err(|e| format!("Failed to parse response: {}", e))?;

    let stats = parsed
        .skills
        .iter()
        .map(|s| Skill {
            name: s.name.clone(),
            level: s.level,
            xp: s.xp,
        })
        .collect();

    Ok(stats)
}

#[tauri::command]
async fn search_items(letter: String) -> Result<Vec<Item>, String> {
    let request_url = format!(
        "https://secure.runescape.com/m=itemdb_oldschool/api/catalogue/items.json?category=1&alpha={}&page=1",
        letter.to_lowercase()
    );

    let client = reqwest::Client::new();
    let response = client
        .get(&request_url)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch items: {}", e))?
        .json::<ItemsResponse>()
        .await
        .map_err(|e| format!("Failed to parse items: {}", e))?;

    Ok(response.items)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![lookup_player, search_items])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
