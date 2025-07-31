function a() {
    spriteset._back1Sprite.bitmap = spriteset.battleback1Bitmap();
    SceneManager._scene._spriteset._back1Sprite.bitmap = ImageManager.loadBattleback1("b");
} 
function b() {
    spriteset._back1Sprite.bitmap = spriteset.battleback1Bitmap();
    SceneManager._scene._spriteset._back1Sprite.bitmap = ImageManager.loadBattleback1("a");
} 
async function c() {
    var s = $gameVariables.value(74);
    if (s) {
        x = new Promise(b => setTimeout(b, 100));
        y = new Promise(a => setTimeout(a, 100));
    }
} 

await c()
