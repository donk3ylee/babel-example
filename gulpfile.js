const { series , parallel , src , dest , watch } = require('gulp');
const sass = require('gulp-sass')(require('node-sass'));
const { join , basename } = require('path');
const { sync } = require('glob');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const path = join(__dirname, 'src');

const compileSCSS = () => {
    return src(sync(join(path, 'scss', '**/*.scss')))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write('./maps/'))
        .pipe(dest(join(path, 'dist')));
    }
    
const minifyCSS = () => {
    return src(sync(join(path, 'dist', '**/!(*.min).css')))
    .pipe(cleanCSS({ compatibility: 'ie8'}))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./maps/'))
    .pipe(
        rename(({ dirname , basename, extname }) => {
            return{
                dirname,
                basename: `${basename}.min`,
                extname
            }
        })
    )
    .pipe(dest(join(path, 'dist')));
}

const compileJS = () => {
    return src(sync(join(path, 'js', '**/*.js')))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(sourcemaps.write('./maps/'))
        .pipe(dest(join(path, 'dist')));
}

const minifyJS = () => {
    return src(sync(join(path, 'dist', '**/!(*.min).js')))
        .pipe(uglify())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./maps/'))
        .pipe(
            rename(({ dirname , basename, extname }) => {
                return{
                    dirname,
                    basename: `${basename}.min`,
                    extname
                }
            })
        )
        .pipe(dest(join(path, 'dist')));
}

const watchers = (cb) => {
    const HTMLfiles = sync(join(path, '**/*.html'));
    const SCSSfiles = sync(join(path, 'scss', '**/*.scss' ));
    const JSfiles = sync(join(path, 'js', '**/*.js' ));
    
    watch(HTMLfiles, series(reloadBrowser));
    console.log('\n\HTML Files Being Watched');
    console.table(HTMLfiles.map(path => basename(path)));

    watch(SCSSfiles, series(compileSCSS, minifyCSS, reloadBrowser));
    console.log('\n\nSCSS Files Being Watched');
    console.table(SCSSfiles.map(path => basename(path)));
    
    watch(JSfiles, series(compileJS, minifyJS, reloadBrowser));
    console.log('\n\nJavaScript Files Being Watched');
    console.table(JSfiles.map(path => basename(path)));
    cb();
}

const reloadBrowser = (cb) => {
    browserSync.reload();
    cb();
}

const dev = () => {
    browserSync.init({
        server : {
            baseDir: join(path)
        }
    })
}


exports.default = series(
    parallel(compileSCSS, compileJS),
    parallel(minifyCSS, minifyJS),
    watchers,
    dev
);