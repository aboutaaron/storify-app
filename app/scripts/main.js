/*global Handlebars:false */

require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        handlebars: '../components/handlebars/handlebars'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['jquery', 'bootstrap', 'handlebars'], function ($) {
    'use strict';
    var aaron = 'aboutaaron';
    var dataRef = new Firebase('https://storify.firebaseio.com/');

    $.ajax({
        dataType: 'jsonp',
        url: 'http://api.storify.com/v1/stories/search?q=' + aaron,
        success: function(data) {
            // Handlebars
            var source = $('#storify-template').html();
            var template = Handlebars.compile(source);

            // Data
            var stories = data.content.stories;
            $.each(stories, function() {
                $('.storify-stories').append(template(this));

                console.log(this);
            })
        }
    });
});