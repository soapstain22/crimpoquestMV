function givemetheitem(itemid){
	var parameters = PluginManager.parameters('ItemBook');
	var item = $dataItems.at(itemid)
	var commanded = Game_Interpreter.prototype.pluginCommand;

	Game_Interpreter.pluginCommand = function(a, b){
		_Game_Interpreter_pluginCommand.call(this, item, args);
		if (item = 'money'){
			Game_Party.prototype.gainGold(args)
			ItemGetWindow("Money", args, 40)
		}
	}
	
}
function ItemGetWindow(toptext, bottomtext, id){
	Window_Base.prototype.initialize(screen.availWidth/2,screen.availHeight/2,200,80)
	Window_Base.prototype.create.call(this)
	
	
}