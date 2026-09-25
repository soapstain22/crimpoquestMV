//=============================================================================
// AnyTarget.js
//=============================================================================
/*:
 * @plugindesc Lets a single-target item or skill hit either side.
 * @author crimpoquest
 *
 * @help
 * Put <AnyTarget> in an item or skill note and give it a single-target
 * scope ("1 Enemy" or "1 Ally").
 *
 * In battle, target selection opens on the side the scope says. Press
 * Q / W (LB / RB on a gamepad) to switch between enemies and the party.
 * Outside battle, it targets the party from the item menu.
 */

(function() {

    function isAnyTarget(item) {
        return !!(item && item.meta && item.meta.AnyTarget);
    }

    // 'friend' or 'opponent' once the player picks a side; unset means use the scope.
    var _isForOpponent = Game_Action.prototype.isForOpponent;
    Game_Action.prototype.isForOpponent = function() {
        if (isAnyTarget(this.item())) {
            if (!$gameParty.inBattle()) return false;
            if (this._anySide) return this._anySide === 'opponent';
        }
        return _isForOpponent.call(this);
    };

    var _isForFriend = Game_Action.prototype.isForFriend;
    Game_Action.prototype.isForFriend = function() {
        if (isAnyTarget(this.item())) {
            if (!$gameParty.inBattle()) return true;
            if (this._anySide) return this._anySide === 'friend';
        }
        return _isForFriend.call(this);
    };

    var _onSelectAction = Scene_Battle.prototype.onSelectAction;
    Scene_Battle.prototype.onSelectAction = function() {
        var action = BattleManager.inputtingAction();
        var any = isAnyTarget(action.item());
        action._anySide = null;
        [this._actorWindow, this._enemyWindow].forEach(function(win) {
            if (any) {
                win.setHandler('pageup', this.onAnySideSwitch.bind(this));
                win.setHandler('pagedown', this.onAnySideSwitch.bind(this));
            } else {
                delete win._handlers['pageup'];
                delete win._handlers['pagedown'];
            }
        }, this);
        _onSelectAction.call(this);
    };

    Scene_Battle.prototype.onAnySideSwitch = function() {
        var action = BattleManager.inputtingAction();
        if (this._enemyWindow.visible) {
            action._anySide = 'friend';
            this._enemyWindow.hide();
            this.selectActorSelection();
            this._actorWindow.select(0);
        } else {
            action._anySide = 'opponent';
            this._actorWindow.hide();
            this.selectEnemySelection();
        }
    };

})();
