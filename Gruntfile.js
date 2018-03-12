module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      compile: {
        options: {
          sourcemap: 'none'
        },
        files: {
          'www/styles/main.css': 'www_src/styles/main.sass'
        }
      }
    },
    watch: {
      css: {
        files: 'www_src/styles/*.sass',
        tasks: ['newer:sass'],
        options: {
          debounceDelay: 333,
          spawn: false
        }
      },
      cssMixins: {
        files: 'www_src/styles/mixins/*.sass',
        tasks: ['sass'],
      },
      widgets: {
        files: 'www_src/styles/widgets/*.sass',
        tasks: ['sass'],
      }
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');
  
  grunt.registerTask('css', ['sass']);
  grunt.registerTask('default', ['sass']);
};