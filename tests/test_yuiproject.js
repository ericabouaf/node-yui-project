var vows = require('vows'),
    path = require('path'),
    assert = require('assert');

var YUIproject = require('../index').YUIproject;

vows.describe('YUI project').addBatch({

   'test_modules': {
      topic: function() {
         return new YUIproject( path.join(__dirname, 'test_project') );
      },
      'we have a response with list of modules': function (project) {
         assert.equal( project.modules().length, 1);
      }
   },

   'test_module_realname': {
      topic: function() {
         var project = new YUIproject( path.join(__dirname, 'test_project') );
         var modules = project.modules();
         return modules[0];
      },
      'we should get the fullname of the module': function(module) {
         assert.equal( module.module_name() , 'project-mymodule');
      }
   }

}).export(module); // Export the Suite
