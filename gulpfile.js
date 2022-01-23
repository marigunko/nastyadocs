'use strict';

/* пути к исходным файлам (src), к готовым файлам (build), а также к тем, за изменениями которых нужно наблюдать (watch) */
var path = {
    build: {
        html: 'assets/build/',
        js: 'assets/build/js/',
        css: 'assets/build/css/',
        img: 'assets/build/img/',
        files: 'assets/build/files',
        fonts: 'assets/build/fonts/'
    },
    src: {
        html: 'assets/src/*.html',
        js: 'assets/src/js/main.js',
        style: 'assets/src/style/main.scss',
        img: 'assets/src/img/**/*.*',
        files: 'assets/src/files/**/*.*',
        fonts: 'assets/src/fonts/**/*.*'
    },
    watch: {
        html: 'assets/src/**/*.html',
        js: 'assets/src/js/**/*.js',
        css: 'assets/src/style/**/*.scss',
        img: 'assets/src/img/**/*.*',
        files: 'assets/src/files/**/*.*',
        fonts: 'assets/srs/fonts/**/*.*'
    },
    clean: './assets/build/*',
    template: {
        js: 'app/public_html/templates/nastya/js/',
        css: 'app/public_html/templates/nastya/css/',
        img: 'app/public_html/templates/nastya/img/',
        files: 'app/public_html/templates/nastya/files/',
        fonts: 'app/public_html/templates/nastya/fonts/'
    }
};

/* настройки сервера */
var config = {
    server: {
        baseDir: './assets/build'
    },
    notify: false
};

/* подключаем gulp и плагины */
var gulp = require('gulp'),  // подключаем Gulp
    webserver = require('browser-sync'), // сервер для работы и автоматического обновления страниц
    plumber = require('gulp-plumber'), // модуль для отслеживания ошибок
    rigger = require('gulp-rigger'), // модуль для импорта содержимого одного файла в другой
    sourcemaps = require('gulp-sourcemaps'), // модуль для генерации карты исходных файлов
    sass = require('gulp-sass'), // модуль для компиляции SASS (SCSS) в CSS
    autoprefixer = require('gulp-autoprefixer'), // модуль для автоматической установки автопрефиксов
    cleanCSS = require('gulp-clean-css'), // плагин для минимизации CSS
    uglify = require('gulp-uglify'), // модуль для минимизации JavaScript
    cache = require('gulp-cache'), // модуль для кэширования
    imagemin = require('gulp-imagemin'), // плагин для сжатия PNG, JPEG, GIF и SVG изображений
    jpegrecompress = require('imagemin-jpeg-recompress'), // плагин для сжатия jpeg	
    pngquant = require('imagemin-pngquant'), // плагин для сжатия png
    rimraf = require('gulp-rimraf'), // плагин для удаления файлов и каталогов
    rename = require('gulp-rename'),
    del = require('del');

/* задачи */

// запуск сервера
gulp.task('webserver', function () {
    webserver(config);
});

// сбор html
gulp.task('html:build', function () {
    return gulp.src(path.src.html) // выбор всех html файлов по указанному пути
        .pipe(plumber()) // отслеживание ошибок
        // .pipe(rigger()) // импорт вложений
        .pipe(gulp.dest(path.build.html)) // выкладывание готовых файлов
        .pipe(webserver.reload({ stream: true })); // перезагрузка сервера
});

// сбор стилей
gulp.task('css:build', function () {
    return gulp.src(path.src.style) // получим main.scss
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(sourcemaps.init()) // инициализируем sourcemap
        .pipe(sass()) // scss -> css
        .pipe(autoprefixer()) // добавим префиксы
        .pipe(gulp.dest(path.build.css))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS()) // минимизируем CSS
        .pipe(sourcemaps.write('./')) // записываем sourcemap
        .pipe(gulp.dest(path.build.css)) // выгружаем в build
        .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

// сбор js
gulp.task('js:build', function () {
    return gulp.src(path.src.js) // получим файл main.js
        .pipe(plumber()) // для отслеживания ошибок
        .pipe(rigger()) // импортируем все указанные файлы в main.js
        .pipe(gulp.dest(path.build.js))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.init()) //инициализируем sourcemap
        .pipe(uglify()) // минимизируем js
        .pipe(sourcemaps.write('./')) //  записываем sourcemap
        .pipe(gulp.dest(path.build.js)) // положим готовый файл
        .pipe(webserver.reload({ stream: true })); // перезагрузим сервер
});

// перенос шрифтов
gulp.task('fonts:build', function () {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

// обработка картинок
gulp.task('image:build', function () {
    return gulp.src(path.src.img) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
            imagemin.gifsicle({ interlaced: true }),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ])))
        .pipe(gulp.dest(path.build.img)); // выгрузка готовых файлов
});

// обработка картинок из files
gulp.task('files:build', function () {
    return gulp.src(path.src.files) // путь с исходниками картинок
        .pipe(cache(imagemin([ // сжатие изображений
            imagemin.gifsicle({ interlaced: true }),
            jpegrecompress({
                progressive: true,
                max: 90,
                min: 80
            }),
            pngquant(),
            imagemin.svgo({ plugins: [{ removeViewBox: false }] })
        ])))
        .pipe(gulp.dest(path.build.files)); // выгрузка готовых файлов
});

// удаление каталога build 
gulp.task('clean:build', function () {
    return gulp.src(path.clean, { read: false })
        .pipe(rimraf());
});

// очистка кэша
gulp.task('cache:clear', function () {
    cache.clearAll();
});

// сборка
gulp.task('build',
    gulp.series('clean:build',
        gulp.parallel(
            'html:build',
            'css:build',
            'js:build',
            'fonts:build',
            'image:build',
            'files:build',
        )
    )
);

// запуск задач при изменении файлов
gulp.task('watch', function () {
    gulp.watch(path.watch.html, gulp.series('html:build'));
    gulp.watch(path.watch.css, gulp.series('css:build'));
    gulp.watch(path.watch.js, gulp.series('js:build'));
    gulp.watch(path.watch.img, gulp.series('image:build'));
    gulp.watch(path.watch.files, gulp.series('files:build'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:build'));
});

// задача по умолчанию
gulp.task('default', gulp.series(
    'build',
    gulp.parallel('webserver','watch')      
));



// копирование css в шаблон
gulp.task('template:css', function () {
    return gulp.src(path.build.css + '/**/*.*')
        .pipe(gulp.dest(path.template.css))
});
// копирование js в шаблон
gulp.task('template:js', function () {
    return gulp.src(path.build.js + '/**/*.*')
        .pipe(gulp.dest(path.template.js))
});
// копирование fonts в шаблон
gulp.task('template:fonts', function () {
    return gulp.src(path.build.fonts + '/**/*.*')
        .pipe(gulp.dest(path.template.fonts))
});
// копирование img в шаблон
gulp.task('template:img', function () {
    return gulp.src(path.build.img + '/**/*.*')
        .pipe(gulp.dest(path.template.img))
});
// удаление css из шаблона
gulp.task('template:clean:css', function () {
    return del([path.template.css + '/**'], {force:true});
});
// удаление js из шаблона
gulp.task('template:clean:js', function () {
    return del([path.template.js + '/**'], {force:true});
});
// удаление fonts из шаблона
gulp.task('template:clean:fonts', function () {
    return del([path.template.fonts + '/**'], {force:true});
});
// удаление fonts из шаблона
gulp.task('template:clean:img', function () {
    return del([path.template.img + '/**'], {force:true});
});
// очистка шаблона
gulp.task('template:clean', gulp.parallel(
    'template:clean:css',
    'template:clean:js',
    'template:clean:fonts',
    'template:clean:img',
));
// сборка шаблона
gulp.task('template',
    gulp.series(
        'template:clean',
        'build',
        gulp.parallel(
            'template:css',
            'template:js',
            'template:fonts',
            'template:img',
        )
    )
);

