var gulp=require('gulp');
  var nodemon=require('gulp-nodemon');

gulp.task('default',function(){

     nodemon({
          script:'server.js',
          ext:'js',
          env:{},
          ignore:['./node_modules/**']
          
        

              })
     .on('restart',function(){
       console.log('RESTARTED SERVER');

});

});
