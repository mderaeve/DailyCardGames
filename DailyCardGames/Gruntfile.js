module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ["dist", '.tmp'],
        useminPrepare: {
            html: 'index.html'
        },
        usemin: {
            html: ['dist/index.html']
        },
        uglify: {
            my_target: {
                files: {
                    'dist/daily-card-games-min.js': ['app/*.js', 'DB/*.js', 'Directives/*.js', 'Games/Kinger/*.js', 'Games/Wiezer/*.js', 'Home/*.js', ]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');
    /*grunt.registerTask('adjustBuiltLinks', 'Performing Final Cleanups', function () {
        var indexDist = 'dist/index.html';
        grunt.log.writeln('Performing Final Cleanups');
        var indexContent = grunt.file.read(indexDist);
        indexContent = indexContent.replace('<base href="/demoangularninja/sp-blogger/app/" />', '<base href="/demoangularninja/sp-blogger/dist/app/" />');
        indexContent = indexContent.replace('<link rel="stylesheet" href="app/built/app.min.css"/>', '<link rel="stylesheet" href="built/app.min.css"/>');
        indexContent = indexContent.replace('<script src="app/built/app.min.js"></script>', '<script src="built/app.min.js"></script>');
        grunt.file.write(indexDist, indexContent);
    });*/
    // Tell Grunt what to do when we type "grunt" into the terminal
    grunt.registerTask('default', [
       'clean', 'useminPrepare', 'uglify', 'usemin'
    ]);
};