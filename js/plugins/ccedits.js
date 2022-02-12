/*:
 * @plugindesc at sideview battle, only display item/skill names.
 * @author Sasuke KANNAZUKI
 *
 * @param displayAttack
 * @desc Whether to display normal attack. 1:yes 0:no
 * @default 0
 *
 * @param position
 * @desc Skill name display position. 0:left, 1:center
 * @default 1
 *
 * @help This plugin does not provide plugin commands.
 *
 * By not displaying the log and only displaying the skill name,
 * the speed of battle will increase slightly. 
 */
(function() {

  var parameters = PluginManager.parameters('SimpleMsgSideView');
  var displayAttack = Number(parameters['displayAttack']) != 0;
  var position = Number(parameters['position'] || 1);
})();
