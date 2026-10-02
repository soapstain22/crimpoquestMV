//=============================================================================
// NoClickMarker.js
//=============================================================================

/*:
 * @plugindesc Hides the flashing white destination box when clicking on the map.
 *
 * @help Click-to-move still works, the marker just never shows.
 */

(function() {

    Sprite_Destination.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.visible = false;
    };

})();
