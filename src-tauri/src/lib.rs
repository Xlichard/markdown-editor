// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_user_dirs() -> Result<serde_json::Value, String> {
    use std::env;
    
    let home_dir = env::var("USERPROFILE")
        .or_else(|_| env::var("HOME"))
        .unwrap_or_else(|_| "C:\\Users\\User".to_string());
    
    let dirs = serde_json::json!({
        "home": home_dir.clone(),
        "downloads": format!("{}\\Downloads", home_dir),
        "documents": format!("{}\\Documents", home_dir),
        "desktop": format!("{}\\Desktop", home_dir)
    });
    
    Ok(dirs)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![greet, get_user_dirs])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
