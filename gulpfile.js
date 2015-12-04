var gulp = require('gulp');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var gulpif = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

gulp.task('connect', function() {
	connect.server({
		port: 5000,
		livereload: true
	});
});

gulp.task('build:dist', function () {
	var assets = useref.assets();

	// gulp.src('app/assets/img/*')
	// .pipe(imagemin({
	// 	progressive: true,
	// 	svgoPlugins: [{removeViewBox: false}],
	// 	use: [pngquant()]
	// }))
	// .pipe(gulp.dest('dist/assets/img'));

	return gulp.src('**/*.html')
	.pipe(assets)
	.pipe(sourcemaps.init())
	.pipe(gulpif('*.js', uglify()))
	.pipe(gulpif('*.css', minifyCss()))
	.pipe(rev())
	.pipe(assets.restore())
	.pipe(useref())
	.pipe(revReplace()) 
	.pipe(gulpif('*.css', sourcemaps.write()))
	.pipe(gulp.dest('dist'));
});

gulp.task('styles', function() {
	gulp.src('assets/css/**/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass().on('error', sass.logError))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('assets/css/'))	
	.pipe(connect.reload());
});

gulp.task('scripts', function () {
	gulp.src('assets/js/*.js')
	.pipe(connect.reload());
});

gulp.task('html', function () {
	gulp.src('**/*.html')
	.pipe(connect.reload());
});

gulp.task('sass:watch',function() {
	gulp.watch('assets/css/**/*.scss',['styles']);
});

gulp.task('js:watch',function() {
	gulp.watch('assets/js/*.js',['scripts']);
});

gulp.task('html:watch', function () {
	gulp.watch(['**/*.html'], ['html']);
});

gulp.task('server', ['connect', 'sass:watch', 'js:watch', 'html:watch']);