module.exports = function(grunt){
    grunt.initConfig({
        concat: {
            js: {
                src:[
                    'www-build/jquery.js',
                    'www-build/velocity.js',
                    'www-build/lockr.js',
                    'www-build/script.js'
                ],
                dest: 'www-build/script.js'
            }
        },
        uglify: {
            buildjs: {
                files: [{
                    src: 'www-build/script.js',
                    dest: 'www-build/script.js'
                },{
                    src: 'www-build/sw.js',
                    dest: 'www-build/sw.js'
                },{
                    src: 'www-build/xeduleapi.js',
                    dest: 'www-build/xeduleapi.js'
                }]
            }
        },
        exec: {
            copy_www: 'cp -R www/* www-build/'
        }
    });
    grunt.loadNpmTasks('grunt-wx-copydir');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks("grunt-contrib-jade");
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('build', ['exec','concat','uglify']);

};