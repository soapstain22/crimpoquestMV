function s() {
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		if (args[0] = 'money'){
			Game_Party.prototype.gainGold(args)
			SceneManager.push(ItemGetWindow)
			ItemGetWindow(money,20)
		}
	}
	Scene_Base.prototype.ItemGetWindow(item, ammount){
		item = $dataItems.findIndex(args[0])
		
	};
	}
};