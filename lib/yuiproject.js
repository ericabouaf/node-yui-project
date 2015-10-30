
var fs = require('fs'),
    path = require('path');


var YUImodule = require('./yuimodule.js');


var YUIproject = function(root_path) {
	this.root_path = root_path;
};

YUIproject.prototype = {

	modules: function() {
		var src_path = path.join(this.root_path, 'src');
		var modules_folders = fs.readdirSync(src_path);

		var yui_project = this;
		var modules = modules_folders.map(function(module_folder) {
			return new YUImodule(module_folder, yui_project);
		});
		return modules;
	},

	module: function(folder_name) {
		return new YUImodule(folder_name, this);
	},

	translations: function() {

		var modules = this.modules();

		var translations = {};

		modules.forEach(function(module) {
			var tr = module.translations();
			if(tr !== null)
				translations[module.module_name()] = tr;
		});

		return translations;
	}

};

module.exports = YUIproject;