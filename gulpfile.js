var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cache = require('gulp-cached');


gulp.task('connect', function() {
	return connect.server({
		port: 5000,
		livereload: true
	});
});

gulp.task('build:dist', function () {

	var assets = useref.assets();	

	gulp.src(['assets/plugins/bootstrap/fonts/*']).pipe(gulp.dest('dist/assets/fonts'));

	return gulp.src('*.html')
	.pipe(assets)
	.pipe(sourcemaps.init())
	.pipe(gulpif('*.js', uglify()))
	.pipe(gulpif('*.css', minifyCss()))
	.pipe(sourcemaps.write())
	.pipe(assets.restore())
	.pipe(useref())
	.pipe(gulp.dest('dist'));	
});

gulp.task('styles', function() {

	return gulp.src('assets/css/**/*.scss')	
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))

	.pipe(autoprefixer({
		browsers: ['last 2 versions', 'IE 8', 'IE 9', 'IE 10', 'IE 11']
	}))
	.pipe(sourcemaps.write())
	.pipe(cache('linting'))
	.pipe(gulp.dest('assets/css/'))
	.pipe(connect.reload());
});

gulp.task('scripts', function () {
	return gulp.src('assets/js/**/*.js')
	.pipe(connect.reload());
});

gulp.task('html', function () {
	return gulp.src('**/*.html')
	.pipe(connect.reload());
});

gulp.task('sass:watch',function() {
	return gulp.watch('assets/css/**/*.scss', ['styles']);
});

gulp.task('js:watch',function() {
	return gulp.watch('assets/js/**/*.js',['scripts']);
});

gulp.task('html:watch', function () {
	return gulp.watch(['**/*.html'], ['html']);
});

gulp.task('server', ['connect', 'sass:watch', 'js:watch', 'html:watch']);