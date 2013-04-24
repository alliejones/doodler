module.exports = function(grunt) {
  var defaultTasks = ['jshint', 'concat', 'uglify']; // used for watch as well

  var files = [
    'src/queue.js',
    'src/canvas.js'
  ];

  grunt.initConfig({
    jshint: {
      all: files.concat(['Gruntfile.js'])
    },

    concat: {
      all: {
        src: files,
        dest: 'dist/doodler.js'
      }
    },

    uglify: {
      all: {
        files: {
          'dist/doodler.min.js': files
        }
      }
    },

    watch: {
      all: {
        files: files,
        tasks: defaultTasks,
        options: {
          debounceDelay: 250
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', defaultTasks);

  var growl = require('growl');

  ['warn', 'fatal'].forEach(function(level) {
    grunt.util.hooker.hook(grunt.fail, level, function(opt) {
      growl(opt.name, {
        title: opt.message,
        image: 'Console'
      });
    });
  });
};