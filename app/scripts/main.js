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
    var query = 'aboutaaron';
    var storiesRef = new Firebase('https://storify.firebaseio.com/stories/');

    $.ajax({
        dataType: 'jsonp',
        url: 'http://api.storify.com/v1/stories/search?q=' + query +'&per_page=10',
        success: function(data) {
            // Handlebars
            var source = $('#storify-template').html();
            var template = Handlebars.compile(source);

            // Data
            var stories = data.content.stories;
            $.each(stories, function() {
                $('.storify-stories').append(template(this));

                // Firebase
                storiesRef.push({
                    user_id: this.sid,
                    title: this.title,
                    id: this.sid,
                    stats: {
                        views: this.stats.views,
                        likes: this.stats.likes,
                        elements: {
                            images: this.stats.elements.image,
                            links: this.stats.elements.link,
                            quotes: this.stats.elements.quote,
                            text: this.stats.elements.text,
                            vidoes: this.stats.elements.video
                        }
                    }
                });

                console.log(this);
            });
        }
    });
});