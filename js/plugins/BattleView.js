//=============================================================================
// BattleView.js
//=============================================================================
/*:
 * @plugindesc Switch a single battle to side view from an event, saved with the game.
 *
 * @help
 * Run this Script command right before Battle Processing:
 *
 *   $gameSystem.setSideView(true)
 *
 * That battle is fought in side view. When the battle scene closes (win, lose
 * or escape) it goes back to the database setting, so the next battle is
 * normal again. The setting lives in $gameSystem, so it is saved with the game.
 *
 * Do not set $dataSystem.optSideView from events. That changes the database in
 * memory, is never saved, and sticks for every battle until the game restarts.
 */

(function() {

Game_System.prototype.setSideView = function(sideView) {
    this._sideView = sideView;
};

Game_System.prototype.clearSideView = function() {
    this._sideView = undefined;
};

Game_System.prototype.isSideView = function() {
    if (this._sideView !== undefined) {
        return this._sideView;
    }
    return $dataSystem.optSideView;
};

//Reset once the battle scene is gone, so sprites never flip mid fade-out
var copyOfScene_Battleterminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
    copyOfScene_Battleterminate.call(this);
    $gameSystem.clearSideView();
};

})();
