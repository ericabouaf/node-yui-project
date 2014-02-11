#!/usr/bin/env node

var fs = require('fs'),
	path = require('path');
var YUIproject = require('../index.js').YUIproject;

var project = new YUIproject( process.cwd() );


var modules = project.modules();

modules.forEach(function(module) {

	var lang_files = module.lang_files();
	if(lang_files === null) return;

	console.log("=====");
	console.log(module.module_folder);


	var meta = module.meta_data();
	var meta_lang = meta[Object.keys(meta)[0]].lang;
	//console.log(meta_lang);



	var locales_files = lang_files.slice(1).map(function(f){
		return f.split('_')[1].split('.')[0];
	});
	//console.log(locales_files);

	var hasDiff = false;

	for(var i = 0 ; i < locales_files.length ; i++) {
		var l = locales_files[i];
		if(meta_lang.indexOf(l) == -1) {
			console.log("Locale "+l+" present in the lang/ files, but not in the metadata !");
			meta_lang.push(l);
			hasDiff = true;
		}
	}

	if(hasDiff) {
		// TODO: save meta data !
		console.log("DIFF :");
		//console.log( module.module_name() );
		console.log(JSON.stringify(meta, null, 3));

		var p = path.join( module.meta_path(), module.meta_files()[0]);

		fs.writeFileSync(p, JSON.stringify(meta, null, 3));
	}

});

