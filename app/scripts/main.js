/*global Handlebars:false */
var myGlob;
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

    // Initialize Firebase backend
    var storiesRef = new Firebase('https://storify.firebaseio.com/stories/');

    // On the submission of a query fetch the data
    $('#search-storify').on('click', function(e) {
        e.preventDefault();
        var query = $('input').val();

        // Ajax request to Storify API
        $.ajax({
            dataType: 'jsonp',
            url: 'http://api.storify.com/v1/stories/search?q=' + query +'&per_page=10',
            success: function(data) {
                // Handlebars
                var source = $('#storify-template').html();
                var template = Handlebars.compile(source);

                // Iterate through the data and push the values to Firebase
                var stories = data.content.stories;
                $.each(stories, function() {
                    // Firebase
                    storiesRef.push({
                        title: this.title,
                        id: this.sid,
                        permalink: this.permalink,
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
                }); // .each()

                // Attach to Handlebars
                storiesRef.on('value', function(snapshot) {
                    $.each(snapshot.val(), function() {
                        $('.storify-stories').append(template(this));
                    });
                });

            } // success
        }); // .ajax()
    }); // .click()
}); // require()