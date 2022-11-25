function Scene_Obtain(){
	this.initialize.apply(this, arguments)
}
Scene_Obtain.prototype = Object.create(Scene_MenuBase.prototype)
Scene_Obtain.prototype.constructor = Scene_Obtain;

Scene_Obtain.prototype.initialize() = function() {
	Scene_MenuBase.prototype.initialize.call(this);
}
Scene_Obtain.prototype.create = function(){
	Scene_Obtain.prototype.create.call
	this.customWindo
}
function Window_Test(){
	this.initialize.apply(this, arguments);
}
Window_Test.prototype = Object.create(Window_Base.prototype);
Window_Test.prototype.constructor = Window_Test;
Window_Test.prototype.initialize = function(x,y,width,height) {
	Window_Base.prototype.initialize.call(this,x,y,width,height);
}
