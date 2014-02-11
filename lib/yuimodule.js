var fs = require('fs'),
    path = require('path');


var YUImodule = function(module_folder, yui_project) {
	this.yui_project = yui_project;
	this.module_folder = module_folder;

	this.path = path.join(this.yui_project.root_path, 'src', this.module_folder);

	if(!fs.existsSync(this.path)) {
		throw "Module does not exist: ("+module_folder+" from "+yui_project.root_path+"/src)";
	}
};

YUImodule.prototype = {

	lang_path: function() {
		var l_path = path.join(this.path, 'lang');
		return fs.existsSync(l_path) ? l_path : null;
	},

	meta_path: function() {
		var l_path = path.join(this.path, 'meta');
		return fs.existsSync(l_path) ? l_path : null;
	},

	lang_files: function() {
		if(!this.lang_path()) {
			return null;
		}

		return fs.readdirSync(this.lang_path());
	},

	meta_files: function() {
		var meta_path = this.meta_path();
		if(meta_path === null) {
			return null;
		}
		var meta_files = fs.readdirSync(meta_path);
		return meta_files;
	},

	meta_data: function() {
		var meta_path = this.meta_path();
		if(meta_path === null) {
			return null;
		}
		var meta_files = this.meta_files();
		var meta_file = meta_files[0];
		var meta_file_content = fs.readFileSync(  path.join(meta_path, meta_file) ).toString();
		var meta_data = JSON.parse(meta_file_content);
		return meta_data;
	},

	module_name: function() {
		var meta_data = this.meta_data();
		if(meta_data === null) {
			return null;
		}
		return Object.keys(meta_data)[0];
	},

	locale_filepath: function(locale) {
		var module_name = this.module_name();
		if(module_name === null) {
			return null;
		}
		return path.join( this.lang_path(), module_name+'_'+locale+'.js');
	},

	add_translation: function(locale, object) {
		var dest_file = this.locale_filepath(locale);
		if(dest_file === null) {
			console.error("Module "+this.module_folder+" : no meta_data");
			return;
		}
		fs.writeFileSync(dest_file, JSON.stringify(object, null, 3));
	},

	translations: function() {
		var l_path = this.lang_path();
		var files = this.lang_files();

		if(files === null) return null;

		var locale_tr = files.slice(1); // remove the default lang with no locale

		var tr = {};

		locale_tr.forEach(function(f) {
			var s = f.split('_');
			var locale = s[s.length-1].substr(0, s[s.length-1].length-3) ;
			var content = fs.readFileSync( path.join(l_path, f) ).toString();

			try {
				var d = eval("("+content+")");
			}
			catch(ex) {
				console.log("error in "+f);
				console.log(ex);
				return;
			}

			tr[locale] = d;
		});

		return tr;
	}

};

module.exports = YUImodule;