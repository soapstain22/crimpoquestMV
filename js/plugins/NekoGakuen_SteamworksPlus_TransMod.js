//=============================================================================
// NekoGakuen_SteamworksPlus.js
// Version: 1.1.2
//=============================================================================
/*:
 * @target MV MZ
 * @plugindesc Steamworks API+ (Ver 1.1.2)
 * @author (Translator Name)
 * @url (Translator Website)
 * @help
 * ================================
 * 作者：貓咪學園 NekoGakuen
 * 版本：1.1.2
 * 聯絡推特(X)：https://twitter.com/NekoGakuen
 * ================================
 *
 * ─ 插件簡介 ─
 * 在 RPG Maker MV/MZ 中也能使用來自 Steam 遊戲平台的 API 功能。
 *
 *
 * ─ 更新履歷 ─
 * V1.1.2 修正無法初始化Steam API的問題。
 * V1.1.1 新增排行榜的API功能。
 * V1.1.0 新增NWjs版本，並移除Steam Deck選單暫停功能。
 * V1.0.0 初次版本的插件發佈。
 *
 *
 * ─ 使用說明 ─
 * 1.需先完成一些前置步驟，請參閱放在Manual資料夾內的使用手冊連結。
 * 2.在 RPG Maker MV/MZ 的「插件管理器」之中載入本插件，
 *   並在本插件的「參數」區塊設定即可。
 * 3.在事件頁中高級區塊選擇「插件命令/腳本...」，
 *   並輸入以下要執行的插件命令/腳本及參數即可。
 *
 *
 * ─ 插件命令/腳本 ─
 * 
 * -------------------------
 *  ■ SteamApps 功能
 * -------------------------
 * 【檢查應用程式是否已安裝】
 * --說明：在遊戲中檢查指定的應用程式是否已安裝到主機上。
 * >>參數01：應用程式 ID，指定應用程式 ID，輸入 this 為指定目前的應用程式。
 * >>參數02：開關 ID，將回傳結果顯示在指定的開關 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamApps_AppInstalled <參數01> <參數02>
 * --腳本 SteamworksPlusManager.steamApps_AppInstalled('<參數01>', <參數02>);
 * --條件分歧 SteamworksPlusManager.steamApps_AppInstalled('<參數01>') == <條件參數>;
 * >>條件參數：輸入「true」或「false」。
 * 
 * 【檢查追加下載內容是否已安裝】
 * --說明：在遊戲中檢查指定的追加下載內容是否已安裝到主機上。
 * >>參數01：追加下載內容 ID，指定目前的追加下載內容 ID。
 * >>參數02：開關 ID，將回傳結果顯示在指定的開關 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamApps_DlcInstalled <參數01> <參數02>
 * --腳本 SteamworksPlusManager.steamApps_DlcInstalled('<參數01>', <參數02>);
 * --條件分歧 SteamworksPlusManager.steamApps_DlcInstalled('<參數01>') == <條件參數>;
 * >>條件參數：輸入「true」或「false」。
 * 
 * 【檢查是否包含輕度暴力】
 * --說明：在遊戲中檢查應用程式是否包含輕度暴力的內容。
 * >>參數：開關 ID，將回傳結果顯示在指定的開關 ID。
 * --插件命令 NekoCommands SteamApps_LowViolence <參數>
 * --腳本 SteamworksPlusManager.steamApps_LowViolence(<參數>);
 * --條件分歧 SteamworksPlusManager.steamApps_LowViolence(<參數>) == <條件參數>;
 * >>條件參數：輸入「true」或「false」。
 * 
 * 【檢查是否擁有應用程式】
 * --說明：在遊戲中檢查是否已擁有指定的應用程式。
 * >>參數01：應用程式 ID，指定應用程式 ID，輸入 this 為指定目前的應用程式。
 * >>參數02：開關 ID，將回傳結果顯示在指定的開關 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamApps_SubscribedApp <參數01> <參數02>
 * --腳本 SteamworksPlusManager.steamApps_SubscribedApp('<參數01>', <參數02>);
 * --條件分歧 SteamworksPlusManager.steamApps_SubscribedApp('<參數01>') == <條件參數>;
 * >>條件參數：輸入「true」或「false」。
 * 
 * 【檢查擁有應用程式為親友共享】
 * --說明：在遊戲中檢查擁有應用程式是否透過親友共享的方式授權。
 * >>參數：開關 ID，將回傳結果顯示在指定的開關 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamApps_SubscribedFromFamilySharing <參數>
 * --腳本 SteamworksPlusManager.steamApps_SubscribedFromFamilySharing(<參數>);
 * --條件分歧 SteamworksPlusManager.steamApps_SubscribedFromFamilySharing(<參數>) == <條件參數>;
 * >>條件參數：輸入「true」或「false」。
 * 
 * 【檢查擁有應用程式為免費週末】
 * --說明：在遊戲中檢查擁有應用程式是否透過免費週末的方式授權。
 * >>參數：開關 ID，將回傳結果顯示在指定的開關 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamApps_SubscribedFromFreeWeekend <參數>
 * --腳本 SteamworksPlusManager.steamApps_SubscribedFromFreeWeekend(<參數>);
 * --條件分歧 SteamworksPlusManager.steamApps_SubscribedFromFreeWeekend(<參數>) == <條件參數>;
 * >>條件參數：輸入「true」或「false」。
 * 
 * 【檢查玩家是否受到 VAC 封鎖】
 * --說明：在遊戲中檢查玩家是否有受到 VAC 封鎖狀態。
 * >>參數：開關 ID，將回傳結果顯示在指定的開關 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamApps_VACBanned <參數>
 * --腳本 SteamworksPlusManager.steamApps_VACBanned(<參數>);
 * --條件分歧 SteamworksPlusManager.steamApps_VACBanned(<參數>) == <條件參數>;
 * >>條件參數：輸入「true」或「false」。
 * 
 * 【取得應用程式的安裝資料夾】
 * --說明：在遊戲中取得應用程式的安裝資料夾路徑。
 * >>參數01：應用程式 ID，指定應用程式 ID，輸入 this 為指定目前的應用程式。
 * >>參數02：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamApps_GetAppInstallDir <參數01> <參數02>
 * --腳本 SteamworksPlusManager.steamApps_GetAppInstallDir('<參數01>', <參數02>);
 * 
 * 【取得擁有者 Steam ID】
 * --說明：在遊戲中取得目前應用程式擁有者的 Steam ID。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamApps_GetAppOwner <參數>
 * --腳本 SteamworksPlusManager.steamApps_GetAppOwner(<參數>);
 * 
 * 【取得應用程式支援的語言】
 * --說明：在遊戲中取得目前應用程式支援的語言。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamApps_GetAvailableGameLanguages <參數>
 * --腳本 SteamworksPlusManager.steamApps_GetAvailableGameLanguages(<參數>);
 * 
 * 【取得玩家設定的語言】
 * --說明：遊戲中取得目前玩家所設定的遊戲語言。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamApps_GetCurrentGameLanguage <參數>
 * --腳本 SteamworksPlusManager.steamApps_GetCurrentGameLanguage(<參數>);
 * 
 * 【取得應用程式的購買時間】
 * --說明：在遊戲中取得指定應用程式的購買時間，可用在像早鳥購買獲得獎勵的方式。
 * >>參數01：應用程式 ID，指定應用程式 ID，輸入 this 為指定目前的應用程式。
 * >>參數02：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamApps_GetEarliestPurchaseUnixTime <參數01> <參數02>
 * --腳本 SteamworksPlusManager.steamApps_GetEarliestPurchaseUnixTime('<參數01>', <參數02>);
 * 
 * 【安裝指定的追加下載內容】
 * --說明：在遊戲中安裝指定的追加下載內容到主機上。
 * >>參數：追加下載內容 ID，指定目前的追加下載內容 ID。
 * --插件命令 NekoCommands SteamApps_InstallDLC <參數>
 * --腳本 SteamworksPlusManager.steamApps_InstallDLC('<參數>');
 * 
 * 【解除安裝指定的追加下載內容】
 * --說明：在遊戲中解除安裝在主機上指定的追加下載內容。
 * >>參數：追加下載內容 ID，指定目前的追加下載內容 ID。
 * --插件命令 NekoCommands SteamApps_UninstallDLC <參數>
 * --腳本 SteamworksPlusManager.steamApps_UninstallDLC('<參數>');
 * 
 * -------------------------
 *  ■ SteamFriends 功能
 * -------------------------
 * 【呼叫 Steam 內嵌介面】
 * --說明：在遊戲中呼叫 Steam 平台的內嵌介面。
 * >>參數：呼叫選項，顯示的 Steam 內嵌介面選項。
 *   可以使用的參數選項如下：
 *   ● friends
 *   ● community
 *   ● players
 *   ● settings
 *   ● officialgamegroup
 *   ● stats
 *   ● achievements
 * --插件命令 NekoCommands SteamFriends_ActivateGameOverlay <參數>
 * --腳本 SteamworksPlusManager.steamFriends_ActivateGameOverlay('<參數>');
 * 
 * 【呼叫 Steam 內嵌介面的商店頁面】
 * --說明：在遊戲中呼叫 Steam 內嵌介面，並開啟所提供的應用程式的 Steam 商店頁面。
 * >>參數01：應用程式 ID，指定應用程式 ID，輸入 this 為指定目前的應用程式。
 * >>參數02：參數選項，指定顯示商店的動作，輸入0為顯示商店頁面，輸入2為加入至購物車。
 * --插件命令 NekoCommands SteamFriends_ActivateGameOverlayToStore <參數01> <參數02>
 * --腳本 SteamworksPlusManager.steamFriends_ActivateGameOverlayToStore('<參數01>', <參數02>);
 * 
 * 【呼叫遊戲內嵌網頁】
 * --說明：在遊戲中以 Steam 內嵌介面的方式呼叫指定網頁連結。
 * >>參數：超連結網址，指定前往的超連結網址。
 * --插件命令 NekoCommands SteamFriends_ActivateGameOverlayToWebPage <參數>
 * --腳本 SteamworksPlusManager.steamFriends_ActivateGameOverlayToWebPage('<參數>');
 * 
 * 【取得遊戲控制器類型】
 * --說明：在遊戲中取得遊戲控制器的裝置類型。
 * >>參數01：遊戲控制器索引，指定目前遊戲控制器索引，索引值從 0 ~ 3 之間，如為單人遊戲用預設的 0 就好。
 * >>參數02：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamInput_GetInputTypeForHandle <參數01> <參數02>
 * --腳本 SteamworksPlusManager.steamInput_GetInputTypeForHandle(<參數01>, <參數02>);
 * 
 * 【呼叫 Steam 內嵌介面的遊戲控制器】
 * --說明：遊戲中呼叫 Steam 內嵌介面並顯示遊戲控制器的按鍵設定。
 * >>參數：遊戲控制器索引，指定目前遊戲控制器索引，索引值從 0 ~ 3 之間，如為單人遊戲用預設的 0 就好。
 * --插件命令 NekoCommands SteamInput_ShowBindingPanel <參數>
 * --腳本 SteamworksPlusManager.steamInput_ShowBindingPanel(<參數>);
 * 
 * -------------------------
 *  ■ SteamMusic 功能
 * -------------------------
 * 【檢查 Steam 音樂是否已啟用】
 * --說明：在遊戲中檢查 Steam 音樂是否已啟用。
 * >>參數：開關 ID，將回傳結果顯示在指定的開關 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamMusic_IsEnabled <參數>
 * --腳本 SteamworksPlusManager.steamMusic_IsEnabled(<參數>);
 * --條件分歧 SteamworksPlusManager.steamMusic_IsEnabled(<參數>) == <條件參數>;
 * >>條件參數：輸入「true」或「false」。
 * 
 * 【檢查 Steam 音樂是否正在播放】
 * --說明：在遊戲中檢查 Steam 音樂是否正在播放。
 * >>參數：開關 ID，將回傳結果顯示在指定的開關 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamMusic_IsPlaying <參數>
 * --腳本 SteamworksPlusManager.steamMusic_IsPlaying(<參數>);
 * --條件分歧 SteamworksPlusManager.steamMusic_IsPlaying(<參數>) == <條件參數>;
 * >>條件參數：輸入「true」或「false」。
 * 
 * 【檢查 Steam 音樂的播放狀態】
 * --說明：在遊戲中檢查 Steam 音樂的播放狀態。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamMusic_GetPlaybackStatus <參數>
 * --腳本 SteamworksPlusManager.steamMusic_GetPlaybackStatus(<參數>);
 * 
 * 【取得 Steam 音樂的音量】
 * --說明：在遊戲中取得 Steam 音樂的播放音量。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamMusic_GetVolume <參數>
 * --腳本 SteamworksPlusManager.steamMusic_GetVolume(<參數>);
 * 
 * 【暫停 Steam 音樂】
 * --說明：在遊戲中暫停 Steam 音樂的歌曲。
 * --插件命令 NekoCommands SteamMusic_Pause
 * --腳本 SteamworksPlusManager.steamMusic_Pause();
 * 
 * 【播放 Steam 音樂】
 * --說明：在遊戲中播放 Steam 音樂的歌曲。
 * --插件命令 NekoCommands SteamMusic_Play
 * --腳本 SteamworksPlusManager.steamMusic_Play();
 * 
 * 【播放下一首 Steam 音樂】
 * --說明：在遊戲中播放下一首 Steam 音樂的歌曲。
 * --插件命令 NekoCommands SteamMusic_PlayNext
 * --腳本 SteamworksPlusManager.steamMusic_PlayNext();
 * 
 * 【播放上一首 Steam 音樂】
 * --說明：在遊戲中播放上一首 Steam 音樂的歌曲。
 * --插件命令 NekoCommands SteamMusic_PlayPrevious
 * --腳本 SteamworksPlusManager.steamMusic_PlayPrevious();
 * 
 * 【指定 Steam 音樂的音量】
 * --說明：在遊戲中指定 Steam 音樂的音量。
 * >>參數：Steam 音樂的音量，指定 Steam 音樂的音量，數值介於 0.0 ~ 1.0 之間。
 * --插件命令 NekoCommands SteamMusic_SetVolume <參數>
 * --腳本 SteamworksPlusManager.steamMusic_SetVolume('<參數>');
 * 
 * -------------------------
 *  ■ SteamUserStats 功能
 * -------------------------
 * 【清除指定成就】
 * --說明：在遊戲中清除指定的遊戲成就。
 * >>參數：成就名稱，指定的成就名稱。
 * --插件命令 NekoCommands SteamUserStats_ClearAchievement <參數>
 * --腳本 SteamworksPlusManager.steamUserStats_ClearAchievement('<參數>');
 * 
 * 【取得成就和解鎖時間】
 * --說明：在遊戲中取得成就狀態和成就解鎖時間。
 * >>參數01：成就名稱，指定的成就名稱。
 * >>參數02：開關 ID，將回傳結果顯示在指定的開關 ID。
 * >>參數03：變數 ID，將回傳結果顯示在指定的變數 ID。
 * --插件命令 NekoCommands SteamUserStats_GetAchievementAndUnlockTime <參數01> <參數02> <參數03>
 * --腳本 SteamworksPlusManager.steamUserStats_GetAchievementAndUnlockTime('<參數01>', <參數02>, <參數03>);
 * 
 * 【取得排行榜名次】
 * --說明：在遊戲中取得指定排行榜的單一名次。
 * >>參數01：排行榜 ID，指定的排行榜 ID。
 * >>參數02：名次索引，數字0開始為第一名，以此類推。
 * >>參數03：回傳類型，指定回傳結果的資料類型，可以使用的參數「PlayerName」、「PlayerScore」。
 * >>參數04：變數 ID，將回傳結果顯示在指定的變數 ID。
 * --插件命令 NekoCommands SteamUserStats_GetDownloadedLeaderboardEntry <參數01> <參數02> <參數03> <參數04>
 * --腳本 SteamworksPlusManager.steamUserStats_GetDownloadedLeaderboardEntry(<參數01>, <參數02>, '<參數03>', <參數04>);
 * 
 * 【取得排行榜名稱】
 * --說明：在遊戲中取得指定排行榜的名稱。
 * >>參數01：排行榜 ID，指定的排行榜 ID。
 * >>參數02：變數 ID，將回傳結果顯示在指定的變數 ID。
 * --插件命令 NekoCommands SteamUserStats_GetLeaderboardName <參數01> <參數02>
 * --腳本 SteamworksPlusManager.steamUserStats_GetLeaderboardName('<參數01>', <參數02>);
 * 
 * 【取得成就的總數量】
 * --說明：在遊戲中取得所有成就的總數量。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamUserStats_GetNumAchievements <參數>
 * --腳本 SteamworksPlusManager.steamUserStats_GetNumAchievements(<參數>);
 * 
 * 【取得目前玩家數量】
 * --說明：在遊戲中取得目前玩家的數量。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamUserStats_GetNumberOfCurrentPlayers <參數>
 * --腳本 SteamworksPlusManager.steamUserStats_GetNumberOfCurrentPlayers(<參數>);
 * 
 * 【解鎖指定成就】
 * --說明：在遊戲中解鎖指定的遊戲成就。
 * >>參數：成就名稱，指定的成就名稱。
 * --插件命令 NekoCommands SteamUserStats_SetAchievement <參數>
 * --腳本 SteamworksPlusManager.steamUserStats_SetAchievement('<參數>');
 * 
 * 【上傳排行榜分數】
 * --說明：在遊戲中取得上傳指定排行榜的分數。
 * >>參數01：排行榜名稱，指定的排行榜名稱。
 * >>參數02：排行榜 ID，指定的排行榜 ID。
 * >>參數03：分數，指定的分數。
 * --插件命令 NekoCommands SteamUserStats_UploadLeaderboardScore <參數01> <參數02> <參數03>
 * --腳本 SteamworksPlusManager.steamUserStats_UploadLeaderboardScore('<參數01>', <參數02>, <參數03>);
 * 
 * -------------------------
 *  ■ SteamUtils 功能
 * -------------------------
 * 【取得目前應用程式 ID】
 * --說明：在遊戲中取得目前的應用程式 ID。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamUtils_GetAppID <參數>
 * --腳本 SteamworksPlusManager.steamUtils_GetAppID(<參數>);
 * 
 * 【取得主機電池電量】
 * --說明：在遊戲中取得主機上的電池電量，如果主機為連接電源時回傳255。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamUtils_GetCurrentBatteryPower <參數>
 * --腳本 SteamworksPlusManager.steamUtils_GetCurrentBatteryPower(<參數>);
 * 
 * 【取得所在國家】
 * --說明：在遊戲中取得玩家所在的國家。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamUtils_GetIPCountry <參數>
 * --腳本 SteamworksPlusManager.steamUtils_GetIPCountry(<參數>);
 * 
 * 【取得伺服器的時間】
 * --說明：在遊戲中取得伺服器的現實時間。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamUtils_GetServerRealTime <參數>
 * --腳本 SteamworksPlusManager.steamUtils_GetServerRealTime(<參數>);
 * 
 * 【取得 Steam 客戶端語言】
 * --說明：在遊戲中取得 Steam 客戶端所設定的語言。
 * >>參數：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamUtils_GetSteamUILanguage <參數>
 * --腳本 SteamworksPlusManager.steamUtils_GetSteamUILanguage(<參數>);
 * 
 * 【檢查 Steam 內嵌介面】
 * --說明：在遊戲中檢查 Steam 內嵌介面是否正在執行中。
 * >>參數：開關 ID，將回傳結果顯示在指定的開關 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamUtils_IsOverlayEnabled <參數>
 * --腳本 SteamworksPlusManager.steamUtils_IsOverlayEnabled(<參數>);
 * --條件分歧 SteamworksPlusManager.steamUtils_IsOverlayEnabled(<參數>) == <條件參數>;
 * >>條件參數：輸入「true」或「false」。
 * 
 * 【指定 Steam 內嵌介面通知位置】
 * --說明：在遊戲中指定的邊角的距離，來設定 Steam 內嵌介面通知的位置。
 * >>參數01：水平像素距離，在遊戲中指定邊角的水平像素距離。
 * >>參數02：垂直像素距離，在遊戲中指定邊角的垂直像素距離。
 * --插件命令 NekoCommands SteamUtils_SetOverlayNotificationInset <參數01> <參數02>
 * --腳本 SteamworksPlusManager.steamUtils_SetOverlayNotificationInset(<參數01>, <參數02>);
 * 
 * 【指定 Steam 內嵌介面邊角位置】
 * --說明：在遊戲中指定 Steam 內嵌介面通知該從哪個邊角彈出顯示。
 * >>參數：邊角位置，在遊戲中顯示 Steam 內嵌介面邊角位置，輸入0為左上角，輸入1為右上角，輸入2為左下角，輸入3為右下角。
 * --插件命令 NekoCommands SteamUtils_SetOverlayNotificationPosition <參數>
 * --腳本 SteamworksPlusManager.steamUtils_SetOverlayNotificationPosition(<參數>);
 * 
 * 【呼叫 Big Picture 文字輸入】
 * --說明：在遊戲中呼叫 Big Picture 文字輸入對話視窗，僅支援遊戲手把輸入。
 * >>參數01：文字輸入，在遊戲中指定的文字輸入，輸入0為一般文字，輸入1為密碼文字。
 * >>參數02：文字行數，在遊戲中指定的文字行數，輸入0為單行，輸入1為多行。
 * >>參數03：指定文字輸入說明，在遊戲中指定文字輸入的說明。
 * >>參數04：指定文字最大字數，在遊戲中指定文字輸入的最大字數。
 * >>參數05：指定文字輸入預設值，在遊戲中指定文字輸入的預設值。
 * >>參數06：變數 ID，將回傳結果顯示在指定的變數 ID，若為0不設定時則直接回傳。
 * --插件命令 NekoCommands SteamUtils_ShowGamepadTextInput <參數01> <參數02> <參數03> <參數04> <參數05> <參數06>
 * --腳本 SteamworksPlusManager.steamUtils_ShowGamepadTextInput(<參數01>, <參數02>, '<參數03>', <參數04>, '<參數05>', <參數06>);
 * 
 * 【呼叫浮動式鍵盤】
 * --說明：在遊戲中呼叫浮動式鍵盤，僅支援遊戲手把輸入。
 * >>參數01：浮動式鍵盤的模式，在遊戲中指定浮動式鍵盤的模式，輸入0為單行，輸入1為多行，輸入2為電子郵件，輸入3為數字。
 * >>參數02：X 座標，在遊戲中指定 X 座標，建議用預設值就好。
 * >>參數03：Y 座標，在遊戲中指定 Y 座標，建議用預設值就好。
 * >>參數04：寬度，在遊戲中指定寬度，建議用預設值就好。
 * >>參數05：高度，在遊戲中指定高度，建議用預設值就好。
 * --插件命令 NekoCommands SteamUtils_ShowFloatingGamepadTextInput <參數01> <參數02> <參數03> <參數04> <參數05>
 * --腳本 SteamworksPlusManager.steamUtils_ShowFloatingGamepadTextInput(<參數01>, <參數02>, <參數03>, <參數04>, <參數05>);
 * 
 * 
 * ─ 支援平台 ─
 * - NWjs：
 *  【× 不支援】
 * - Electron：
 *  【√ 支援(Windows、macOS)】
 * - Google Chrome：
 *  【× 不支援】
 * - Mozilla Firefox：
 *  【× 不支援】
 * - Microsoft Edge：
 *  【× 不支援】
 * - Apple Safari：
 *  【× 不支援】
 * - Android：
 *  【× 不支援】
 * - iOS：
 *  【× 不支援】
 *
 *
 *
 * ─ 著作聲明 ─
 * 修改或翻譯本插件無需事前告知，如果插件有BUG可以回報。
 * 本插件著作權為貓咪學園(NekoGakuen)所有。
 * 並且保留對插件使用規則的修改與更動之權利。
 * 
 * --------------------
 * -來源標示：【△ 不需要，但有的話會很感謝。 (註1)】
 * -商業營利：【√ 允許】
 * -成人用途：【√ 允許】
 * 
 * ※註1：但如有註明的話，可以註明「NekoGakuen」即可。
 * --------------------
 * 
 * 
 * @command NekoCommands SteamApps_AppInstalled
 * @text 檢查應用程式是否已安裝
 * @desc 在遊戲中檢查指定的應用程式是否已安裝到主機上。
 * 
 * @arg steamapp_id
 * @text 應用程式 ID
 * @desc 指定應用程式 ID，輸入 this 為指定目前的應用程式。
 * @type string
 * @default this
 * 
 * @arg sld
 * @text 開關 ID
 * @desc 將回傳結果顯示在指定的開關 ID。
 * @type switch
 * @default 0
 * 
 * @command NekoCommands SteamApps_DlcInstalled
 * @text 檢查追加下載內容是否已安裝
 * @desc 在遊戲中檢查指定的追加下載內容是否已安裝到主機上。
 * 
 * @arg dlc_id
 * @text 追加下載內容 ID
 * @desc 指定目前的追加下載內容 ID。
 * @type string
 * @default 0
 * 
 * @arg sld
 * @text 開關 ID
 * @desc 將回傳結果顯示在指定的開關 ID。
 * @type switch
 * @default 0
 * 
 * @command NekoCommands SteamApps_LowViolence
 * @text 檢查是否包含輕度暴力
 * @desc 在遊戲中檢查應用程式是否包含輕度暴力的內容。
 * 
 * @arg sld
 * @text 開關 ID
 * @desc 將回傳結果顯示在指定的開關 ID。
 * @type switch
 * @default 0
 * 
 * @command NekoCommands SteamApps_SubscribedApp
 * @text 檢查是否擁有應用程式
 * @desc 在遊戲中檢查是否已擁有指定的應用程式。
 * 
 * @arg steamapp_id
 * @text 應用程式 ID
 * @desc 指定應用程式 ID，輸入 this 為指定目前的應用程式。
 * @type string
 * @default this
 * 
 * @arg sld
 * @text 開關 ID
 * @desc 將回傳結果顯示在指定的開關 ID。
 * @type switch
 * @default 0
 * 
 * @command NekoCommands SteamApps_SubscribedFromFamilySharing
 * @text 檢查擁有應用程式為親友共享
 * @desc 在遊戲中檢查擁有應用程式是否透過親友共享的方式授權。
 * 
 * @arg sld
 * @text 開關 ID
 * @desc 將回傳結果顯示在指定的開關 ID。
 * @type switch
 * @default 0
 * 
 * @command NekoCommands SteamApps_SubscribedFromFreeWeekend
 * @text 檢查擁有應用程式為免費週末
 * @desc 在遊戲中檢查擁有應用程式是否透過免費週末的方式授權。
 * 
 * @arg sld
 * @text 開關 ID
 * @desc 將回傳結果顯示在指定的開關 ID。
 * @type switch
 * @default 0
 * 
 * @command NekoCommands SteamApps_VACBanned
 * @text 檢查玩家是否受到 VAC 封鎖
 * @desc 在遊戲中檢查玩家是否有受到 VAC 封鎖狀態。
 * 
 * @arg sld
 * @text 開關 ID
 * @desc 將回傳結果顯示在指定的開關 ID。
 * @type switch
 * @default 0
 * 
 * @command NekoCommands SteamApps_GetAppInstallDir
 * @text 取得應用程式的安裝資料夾
 * @desc 在遊戲中取得應用程式的安裝資料夾路徑。
 * 
 * @arg steamapp_id
 * @text 應用程式 ID
 * @desc 指定應用程式 ID，輸入 this 為指定目前的應用程式。
 * @type string
 * @default this
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamApps_GetAppOwner
 * @text 取得擁有者 Steam ID
 * @desc 在遊戲中取得目前應用程式擁有者的 Steam ID。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamApps_GetAvailableGameLanguages
 * @text 取得應用程式支援的語言
 * @desc 在遊戲中取得目前應用程式支援的語言。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamApps_GetCurrentGameLanguage
 * @text 取得玩家設定的語言
 * @desc 在遊戲中取得目前玩家所設定的遊戲語言。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamApps_GetEarliestPurchaseUnixTime
 * @text 取得應用程式的購買時間
 * @desc 在遊戲中取得指定應用程式的購買時間，可用在像早鳥購買獲得獎勵的方式。
 * 
 * @arg steamapp_id
 * @text 應用程式 ID
 * @desc 指定應用程式 ID，輸入 this 為指定目前的應用程式。
 * @type string
 * @default this
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamApps_InstallDLC
 * @text 安裝指定的追加下載內容
 * @desc 在遊戲中安裝指定的追加下載內容到主機上。
 * 
 * @arg dlc_id
 * @text 追加下載內容 ID
 * @desc 指定目前的追加下載內容 ID。
 * @type string
 * @default 0
 * 
 * @command NekoCommands SteamApps_UninstallDLC
 * @text 解除安裝指定的追加下載內容
 * @desc 在遊戲中解除安裝在主機上指定的追加下載內容。
 * 
 * @arg dlc_id
 * @text 追加下載內容 ID
 * @desc 指定目前的追加下載內容 ID。
 * @type string
 * @default 0
 * 
 * @command NekoCommands SteamFriends_ActivateGameOverlay
 * @text 呼叫 Steam 內嵌介面
 * @desc 在遊戲中呼叫 Steam 平台的內嵌介面。
 * 
 * @arg pchDialog
 * @text 呼叫選項
 * @desc 顯示的 Steam 內嵌介面選項。
 * @type select
 * @default friends
 * @option 好友
 * @value friends
 * @option 社群
 * @value community
 * @option 玩家
 * @value players
 * @option 設定
 * @value settings
 * @option 官方群組
 * @value officialgamegroup
 * @option 統計
 * @value stats
 * @option 成就
 * @value achievements
 * 
 * @command NekoCommands SteamFriends_ActivateGameOverlayToStore
 * @text 呼叫 Steam 內嵌介面的商店頁面
 * @desc 在遊戲中呼叫 Steam 內嵌介面，並開啟所提供的應用程式的 Steam 商店頁面。
 * 
 * @arg steamapp_id
 * @text 應用程式 ID
 * @desc 指定應用程式 ID，輸入 this 為指定目前的應用程式。
 * @type string
 * @default this
 * 
 * @arg eFlag
 * @text 參數選項
 * @desc 指定顯示商店的動作。
 * @type select
 * @default 0
 * @option 顯示商店頁面
 * @value 0
 * @option 加入至購物車
 * @value 2
 * 
 * @command NekoCommands SteamFriends_ActivateGameOverlayToWebPage
 * @text 呼叫遊戲內嵌網頁
 * @desc 在遊戲中以 Steam 內嵌介面的方式呼叫指定網頁連結。
 * 
 * @arg pchURL
 * @text 超連結網址
 * @desc 指定前往的超連結網址。
 * @type string
 * @default https://
 * 
 * @command NekoCommands SteamInput_GetInputTypeForHandle
 * @text 取得遊戲控制器類型
 * @desc 在遊戲中取得遊戲控制器的裝置類型。
 * 
 * @arg nIndex
 * @text 遊戲控制器索引
 * @desc 指定目前遊戲控制器索引，索引值從 0 ~ 3 之間，如為單人遊戲用預設的 0 就好。
 * @type number
 * @min 0
 * @max 3
 * @default 0
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamInput_ShowBindingPanel
 * @text 呼叫 Steam 內嵌介面的遊戲控制器
 * @desc 在遊戲中呼叫 Steam 內嵌介面並顯示遊戲控制器的按鍵設定。
 * 
 * @arg nIndex
 * @text 遊戲控制器索引
 * @desc 指定目前遊戲控制器索引，索引值從 0~3 之間，如為單人遊戲用預設的 0 就好。
 * @type number
 * @min 0
 * @max 3
 * @default 0
 * 
 * @command NekoCommands SteamMusic_IsEnabled
 * @text 檢查 Steam 音樂是否已啟用
 * @desc 在遊戲中檢查 Steam 音樂是否已啟用。
 * 
 * @arg sld
 * @text 開關 ID
 * @desc 將回傳結果顯示在指定的開關 ID。
 * @type switch
 * @default 0
 * 
 * @command NekoCommands SteamMusic_IsPlaying
 * @text 檢查 Steam 音樂是否正在播放
 * @desc 在遊戲中檢查 Steam 音樂是否正在播放。
 * 
 * @arg sld
 * @text 開關 ID
 * @desc 將回傳結果顯示在指定的開關 ID。
 * @type switch
 * @default 0
 * 
 * @command NekoCommands SteamMusic_GetPlaybackStatus
 * @text 檢查 Steam 音樂的播放狀態
 * @desc 在遊戲中檢查 Steam 音樂的播放狀態。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamMusic_GetVolume
 * @text 取得 Steam 音樂的音量
 * @desc 在遊戲中取得 Steam 音樂的播放音量。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamMusic_Pause
 * @text 暫停 Steam 音樂
 * @desc 在遊戲中暫停 Steam 音樂的歌曲。
 * 
 * @command NekoCommands SteamMusic_Play
 * @text 播放 Steam 音樂
 * @desc 在遊戲中播放 Steam 音樂的歌曲。
 * 
 * @command NekoCommands SteamMusic_PlayNext
 * @text 播放下一首 Steam 音樂
 * @desc 在遊戲中播放下一首 Steam 音樂的歌曲。
 * 
 * @command NekoCommands SteamMusic_PlayPrevious
 * @text 播放上一首 Steam 音樂
 * @desc 在遊戲中播放上一首 Steam 音樂的歌曲。
 * 
 * @command NekoCommands SteamMusic_SetVolume
 * @text 指定 Steam 音樂的音量
 * @desc 在遊戲中指定 Steam 音樂的音量。
 * 
 * @arg flVolume
 * @text Steam 音樂的音量
 * @desc 指定 Steam 音樂的音量，數值介於 0.0 ~ 1.0 之間。
 * @type number
 * @min 0
 * @max 1
 * @decimals 1
 * @default 1.0
 * 
 * @command NekoCommands SteamUserStats_ClearAchievement
 * @text 清除指定成就
 * @desc 在遊戲中清除指定的遊戲成就。
 * 
 * @arg pchName
 * @text 成就名稱
 * @desc 指定的成就名稱。
 * @type string
 * 
 * @command NekoCommands SteamUserStats_GetAchievementAndUnlockTime
 * @text 取得成就和解鎖時間
 * @desc 在遊戲中取得成就狀態和成就解鎖時間。
 * 
 * @arg pchName
 * @text 成就名稱
 * @desc 指定的成就名稱。
 * @type string
 * 
 * @arg sld
 * @text 開關 ID
 * @desc 將回傳結果顯示在指定的開關 ID。
 * @type switch
 * @default 0
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamUserStats_GetDownloadedLeaderboardEntry
 * @text 取得排行榜名次
 * @desc 在遊戲中取得指定排行榜的單一名次。
 * 
 * @arg leaderboardld
 * @text 排行榜 ID
 * @desc 指定的排行榜 ID。
 * @min 0
 * @type number
 * 
 * @arg lndex
 * @text 名次索引
 * @desc 數字0開始為第一名，以此類推。
 * @type number
 * @min 0
 * @default 0
 * 
 * @arg type
 * @text 回傳類型
 * @desc 指定回傳結果的資料類型。
 * @type select
 * @default PlayerName
 * @option 玩家名稱
 * @value PlayerName
 * @option 玩家分數
 * @value PlayerScore
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamUserStats_GetLeaderboardName
 * @text 取得排行榜標題
 * @desc 在遊戲中取得指定排行榜的標題。
 * 
 * @arg leaderboardld
 * @text 排行榜 ID
 * @desc 指定的排行榜 ID。
 * @min 0
 * @type number
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamUserStats_GetNumAchievements
 * @text 取得成就的總數量
 * @desc 在遊戲中取得所有成就的總數量。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamUserStats_GetNumberOfCurrentPlayers
 * @text 取得目前玩家數量
 * @desc 在遊戲中取得目前玩家的數量。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamUserStats_SetAchievement
 * @text 解鎖指定成就
 * @desc 在遊戲中解鎖指定的遊戲成就。
 * 
 * @arg pchName
 * @text 成就名稱
 * @desc 指定的成就名稱。
 * @type string
 * 
 * @command NekoCommands SteamUtils_GetAppID
 * @text 取得目前應用程式 ID
 * @desc 在遊戲中取得目前的應用程式 ID。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamUserStats_UploadLeaderboardScore
 * @text 上傳排行榜分數
 * @desc 遊戲中取得上傳指定排行榜的分數。
 * 
 * @arg leaderboardName
 * @text 排行榜名稱
 * @desc 指定的排行榜名稱。
 * @type string
 * 
 * @arg leaderboardld
 * @text 排行榜 ID
 * @desc 指定的排行榜 ID。
 * @min 0
 * @type number
 * 
 * @arg score
 * @text 分數
 * @desc 指定的分數。
 * @type number
 * @default 0
 * 
 * @command NekoCommands SteamUtils_GetCurrentBatteryPower
 * @text 取得主機電池電量
 * @desc 在遊戲中取得主機上的電池電量，如果主機為連接電源時回傳255。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamUtils_GetIPCountry
 * @text 取得所在國家
 * @desc 在遊戲中取得玩家所在的國家。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamUtils_GetServerRealTime
 * @text 取得伺服器的時間
 * @desc 在遊戲中取得伺服器的現實時間。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamUtils_GetSteamUILanguage
 * @text 取得 Steam 客戶端語言
 * @desc 在遊戲中取得 Steam 客戶端所設定的語言。
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamUtils_IsOverlayEnabled
 * @text 檢查 Steam 內嵌介面
 * @desc 在遊戲中檢查 Steam 內嵌介面是否正在執行中。
 * 
 * @arg sld
 * @text 開關 ID
 * @desc 將回傳結果顯示在指定的開關 ID。
 * @type switch
 * @default 0
 * 
 * @command NekoCommands SteamUtils_SetOverlayNotificationInset
 * @text 指定 Steam 內嵌介面通知位置
 * @desc 在遊戲中指定的邊角的距離，來設定 Steam 內嵌介面通知的位置。
 * 
 * @arg nHorizontalInset
 * @text 水平像素距離
 * @desc 在遊戲中指定邊角的水平像素距離。
 * @type number
 * @default 0
 * 
 * @arg nVerticalInset
 * @text 垂直像素距離
 * @desc 在遊戲中指定邊角的垂直像素距離。
 * @type number
 * @default 0
 * 
 * @command NekoCommands SteamUtils_SetOverlayNotificationPosition
 * @text 指定 Steam 內嵌介面邊角位置
 * @desc 在遊戲中指定 Steam 內嵌介面通知該從哪個邊角彈出顯示。
 * 
 * @arg eNotificationPosition
 * @text 邊角位置
 * @desc 在遊戲中顯示 Steam 內嵌介面邊角位置。
 * @type select
 * @default 3
 * @option 左上角
 * @value 0
 * @option 右上角
 * @value 1
 * @option 左下角
 * @value 2
 * @option 右下角
 * @value 3
 * 
 * @command NekoCommands SteamUtils_ShowGamepadTextInput
 * @text 呼叫 Big Picture 文字輸入
 * @desc 在遊戲中呼叫 Big Picture 文字輸入對話視窗，僅支援遊戲手把輸入。
 * 
 * @arg eInputMode
 * @text 文字輸入
 * @desc 在遊戲中指定的文字輸入。
 * @type select
 * @default 0
 * @option 一般文字
 * @value 0
 * @option 密碼文字
 * @value 1
 * 
 * @arg eLineInputMode
 * @text 文字行數
 * @desc 在遊戲中指定的文字行數。
 * @type select
 * @default 0
 * @option 單行
 * @value 0
 * @option 多行
 * @value 1
 * 
 * @arg pchDescription
 * @text 指定文字輸入說明
 * @desc 在遊戲中指定文字輸入的說明。
 * @type string
 * @default 你的名字？
 * 
 * @arg unCharMax
 * @text 指定文字最大字數
 * @desc 在遊戲中指定文字輸入的最大字數。
 * @type number
 * @min 1
 * @default 5
 * 
 * @arg pchDescription
 * @text 指定文字輸入預設值
 * @desc 在遊戲中指定文字輸入的預設值。
 * @type string
 * @default 
 * 
 * @arg vld
 * @text 變數 ID
 * @desc 將回傳結果顯示在指定的變數 ID。
 * @type variable
 * @default 0
 * 
 * @command NekoCommands SteamUtils_ShowFloatingGamepadTextInput
 * @text 呼叫浮動式鍵盤
 * @desc 在遊戲中呼叫浮動式鍵盤，僅支援遊戲手把輸入。
 * 
 * @arg eKeyboardMode
 * @text 浮動式鍵盤的模式
 * @desc 在遊戲中指定浮動式鍵盤的模式。
 * @type select
 * @default 0
 * @option 單行
 * @value 0
 * @option 多行
 * @value 1
 * @option 電子郵件
 * @value 2
 * @option 數字
 * @value 3
 * 
 * @arg nTextFieldXPosition
 * @text X 座標
 * @desc 在遊戲中指定 X 座標，建議用預設值就好。
 * @type number
 * @default 0
 * 
 * @arg nTextFieldYPosition
 * @text Y 座標
 * @desc 在遊戲中指定 Y 座標，建議用預設值就好。
 * @type number
 * @default 0
 * 
 * @arg nTextFieldWidth
 * @text 寬度
 * @desc 在遊戲中指定寬度，建議用預設值就好。
 * @type number
 * @default 0
 * 
 * @arg nTextFieldHeight
 * @text 高度
 * @desc 在遊戲中指定高度，建議用預設值就好。
 * @type number
 * @default 0
 * 
 * 
 *
 * @param Steamworks Class
 * @text ◆ Steamworks 核心參數
 * 
 * @param Steam AppID
 * @text 遊戲應用程式 ID
 * @desc 指定在 Steam 上的遊戲應用程式 ID。
 * @type string
 * @parent Steamworks Class
 * @default 480
 * 
 * @param Check BuyGame Boolean
 * @text 開啟 Steam 購買驗證功能
 * @desc 是否開啟 Steam 購買驗證功能。
 * @default false
 * @type boolean
 * @parent Steamworks Class
 * @on 開啟
 * @off 關閉
 * 
 * @param Check FullScreen
 * @text 開啟 Steam Deck UI 全螢幕
 * @desc 是否在 Steam Deck UI 上開啟全螢幕顯示。
 * @default true
 * @type boolean
 * @parent Steamworks Class
 * @on 開啟
 * @off 關閉
 * 
 * @param Check Music Pause
 * @text 開啟遊戲執行時暫停音樂播放
 * @desc 是否在遊戲執行時暫停遊戲原聲帶的音樂播放。
 * @default false
 * @type boolean
 * @parent Steamworks Class
 * @on 開啟
 * @off 關閉
 * 
 * @param Error Log Class
 * @text ◆ 錯誤訊息參數
 * 
 * @param Error BuyGame Title
 * @text 錯誤標題(未購買遊戲)
 * @desc 當未購買此遊戲時，指定要顯示的錯誤標題。
 * @type string
 * @parent Error Log Class
 * @default 未購買此遊戲
 * 
 * @param Error BuyGame Message
 * @text 錯誤訊息(未購買遊戲)
 * @desc 當未購買此遊戲時，指定要顯示的錯誤訊息。
 * @type string
 * @parent Error Log Class
 * @default 您尚未在 Steam 上購買本遊戲。
 * 
 * @param Error BuyGame Button
 * @text 連結按鈕
 * @desc 指定要前往購買的按鈕名稱。
 * @type string
 * @parent Error Log Class
 * @default 前往購買
 * 
 */
//=============================================================================