require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        bootstrap: 'vendor/bootstrap'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['jquery', 'bootstrap'], function ($) {
    'use strict';
    var aaron = 'aboutaaron';

    $.ajax({
        dataType: 'jsonp',
        url: 'http://api.storify.com/v1/stories/search?q=' + aaron,
        success: function(data) {
                console.log(data);
        }
    });
});