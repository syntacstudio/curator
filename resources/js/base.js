try {
    window.$ = window.jQuery = require('jquery');
    window.Popper = require('popper.js').default;

    require('bootstrap');
} catch (e) {}