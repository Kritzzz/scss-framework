module.exports = {
  styles: {
    scss: './scss/**/*.scss',
    output: './',
    outputName: 'style.css',
    outputStyle: 'compressed',
    ignore: '!scss/mixins/**'
  },
  scripts: {
    entry: './assets/scripts/scripts.js',
    input: './assets/scripts/*.js',
    output: './dist/',
    outputName: 'scripts.min.js'
  },
  images: {
    input: './assets/images/*',
    output: './assets/images/dist/',
    svg: {
      input: 'assets/images/svg/*',
      output: 'assets/images/svg/dist/'
    }
  },
  jsSourcemap: false
};
