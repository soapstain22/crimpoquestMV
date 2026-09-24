//=============================================================================
// EnemyBars.js
//=============================================================================
//v1.3
/*:
 * @plugindesc Overhead enemy hp bars in battle, Runescape style.
 * @author Jeremy Cannady
 *
 * @param Show For All Enemies
 * @desc Show the bar on every enemy without needing a note tag. true / false
 * @default true
 *
 * @param Bar Width
 * @desc Width of the bar in pixels. Use 0 to match the battler image width.
 * @default 48
 *
 * @param Bar Height
 * @desc Thickness of the bar in pixels.
 * @default 6
 *
 * @param Head Gap
 * @desc Pixels of clearance between the top of the battler and the bar.
 * @default 10
 *
 * @param Fill Color
 * @desc Color of the remaining hp portion.
 * @default #00c000
 *
 * @param Empty Color
 * @desc Color of the missing hp portion.
 * @default #c00000
 *
 * @param Color By HP
 * @desc Use the four graded colors below instead of the flat fill. true / false
 * @default false
 *
 * @param High HP Color
 * @desc Insert the color code.
 * @default #009900
 *
 * @param Medium HP Color
 * @desc Insert the color code.
 * @default #ffcc00
 *
 * @param Low HP Color
 * @desc Insert the color code.
 * @default #ff6600
 *
 * @param Critical HP Color
 * @desc Insert the color code.
 * @default #ff3300
 *
 * @help
 * Bars float above the head of each enemy and track its current hp.
 *
 * With "Show For All Enemies" set to true every enemy gets a bar and no note
 * tags are needed. Set it to false to control it per enemy with the tags below.
 *
 * Put <hpBar> in the enemy note tag to activate the hp bar for that enemy
 during battle.
 *Put <hpBarSelectionOnly> to actiavte the hp bar only during selection.
 *Put<hpBarTurnASelection> to actiavet he bar during selection and attack.
 *Put <hpBarTurnOnly> to only show the bar during the attack phase.
 *PLEASE PUT ONLY ONE NOTETAG.
 * For the paramters use any html hex color codes.
 * A few color codes are:
 Green: #009900
 Yellow: #ffcc00
 Orange: #ff6600
 Red: #ff3300
 White: #ffffff
 Blue: #33ffff
 Purple: #660099
 *
*/

(function(){
//=============================================================================
// Create some variables and define the colors
//=============================================================================
Game_Enemy.prototype.battlerHeight = null;
Game_Enemy.prototype.battlerWidth = null;
var parameters = PluginManager.parameters('EnemyBars');
var showAll = String(parameters['Show For All Enemies'] || 'true') === 'true';
var barWidth = Number(parameters['Bar Width'] !== undefined ? parameters['Bar Width'] : 48);
var barHeight = Number(parameters['Bar Height'] || 6);
var headGap = Number(parameters['Head Gap'] || 10);
var fillColor = parameters['Fill Color'] || '#00c000';
var emptyColor = parameters['Empty Color'] || '#c00000';
var colorByHp = String(parameters['Color By HP'] || 'false') === 'true';
var high = parameters['High HP Color'] || '#009900';
var medium = parameters['Medium HP Color'] || '#ffcc00';
var low = parameters['Low HP Color'] || '#ff6600';
var critical = parameters['Critical HP Color'] || '#ff3300';
//Fallbacks used until the battler image has finished loading
var defaultWidth = 96;
var defaultHeight = 96;

//=============================================================================
// Create the enemy hp window that displays all the hp bars
//=============================================================================
function Enemy_Bars() {
	this.initialize.apply(this, arguments);
};

Enemy_Bars.prototype = Object.create(Window_Base.prototype);
Enemy_Bars.prototype.constructor = Enemy_Bars;

Enemy_Bars.prototype.initialize = function(x, y, width, height) {
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this.deactivate();
	//Make the window transparent
	this.opacity = 0;
};

//No padding so the bars line up with the battler screen coordinates
Enemy_Bars.prototype.standardPadding = function() {
	return 0;
};

Enemy_Bars.prototype.update = function() {
    Window_Base.prototype.update.call(this);
	//Clear the window and re-draw the hp bars
    this.contents.clear();
    this.drawBar();
};

//FUNCTION: return the color the hp bar should be based on current hp
Enemy_Bars.prototype.guageColor = function(rate) {
	if(!colorByHp){
		return fillColor;
	}else if(rate > 0.75){
		return high;//High hp color
	}else if(rate > 0.50){
		return medium;//Medium hp color
	}else if(rate > 0.25){
		return low;//Low hp color
	}else{
		return critical;//Critical hp color
	};
};

//FUNCTION: draw one bar. Remaining hp on top of the missing hp, outlined black.
Enemy_Bars.prototype.drawEnemyGauge = function(x, y, width, rate, color) {
	var fillW = Math.floor(width * rate);
	//Keep a sliver showing so a barely alive enemy never reads as dead
	if(fillW < 1){ fillW = 1; };
	this.contents.fillRect(x - 1, y - 1, width + 2, barHeight + 2, '#000000');
	this.contents.fillRect(x, y, width, barHeight, emptyColor);
	this.contents.fillRect(x, y, fillW, barHeight, color);
};

//FUNCTION: draw the hp guage
Enemy_Bars.prototype.drawBar = function() {
	if(!$gameTroop){ return; };
	//Go through the enemies and draw the bars
	var enemies = $gameTroop.members();
	for(var i = 0; i < enemies.length; i++){
		var enemy = enemies[i];
		var enemyId = enemy._enemyId;
		var selected = enemy._selected;
		var turn = (BattleManager._phase === "action" || BattleManager._phase === "turn");

		var enabled = false;
		var meta = new Array(4);
		meta[0] = $dataEnemies[enemyId].meta.hpBar
		meta[1] = $dataEnemies[enemyId].meta.hpBarSelectionOnly
		meta[2] = $dataEnemies[enemyId].meta.hpBarTurnASelection
		meta[3] = $dataEnemies[enemyId].meta.hpBarTurnOnly

		if(showAll && !meta[1] && !meta[2] && !meta[3]){
			enabled = true;
		}else if(meta[0]){
			enabled = true;
		}else if(meta[1] && selected){
			enabled = true;
		}else if(meta[2] && (selected || turn)){
			enabled = true;
		}else if(meta[3] && turn){
			enabled = true;
		}else{
			enabled = false;
		}

		//Hidden enemies that have not appeared yet never show a bar
		if(!enemy.isAppeared()){
			enabled = false;
		};

		//Current hp, taken live so states and buffs are accounted for
		var currentHp = enemy.hp;
		var maxHp = enemy.mhp;
		//If the enemy hp is not zero then draw the hp bar
		if(currentHp > 0 && maxHp > 0 && enabled){
			//Rate is the currnet hp compared to the max hp
			var rate = currentHp/maxHp;
			//Size of the battler image, used to find the top of the head
			var spriteWidth = $dataEnemies[enemyId].battlerWidth || defaultWidth;
			var spriteHeight = $dataEnemies[enemyId].battlerHeight || defaultHeight;
			//Width of the bar
			var width = barWidth || spriteWidth;
			var x = enemy._screenX - width / 2;
			//The sprite is anchored at the feet, so the head is one height up
			var y = enemy._screenY - spriteHeight - headGap;
			//Never let the bar slide off the top of the screen
			if(y < 1){ y = 1; };
			//Draw the guage
			this.drawEnemyGauge(x, y, width, rate, this.guageColor(rate));
		};
	};
 };

//=============================================================================
// Alias the Scene_Battle createAllWindows to add the hp window
//=============================================================================
var battleWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
	battleWindows.call(this)
	//Add the hp window to the battle scene
	this.Bar = new Enemy_Bars(0, 0, Graphics.width, Graphics.height);
	this.addChild(this.Bar);
};

//=============================================================================
// Alias the Sprite_Enemy.updateFrame to return information back to the hp window.
//=============================================================================
var copyOfSprite_EnemyupdateFrame = Sprite_Enemy.prototype.updateFrame;
Sprite_Enemy.prototype.updateFrame = function() {
	copyOfSprite_EnemyupdateFrame.call(this);
	//As we are updating the enemy sprites return the bitmaps height and width
	if(this._enemy && this.bitmap && this.bitmap.width > 0){
		$dataEnemies[this._enemy._enemyId].battlerHeight = this.bitmap.height;
		$dataEnemies[this._enemy._enemyId].battlerWidth = this.bitmap.width;
	};
};
})();
