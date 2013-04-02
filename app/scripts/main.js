/*global Handlebars:false */

require.config({
    paths: {
        jquery: '../components/jquery/jquery',
        bootstrap: 'vendor/bootstrap',
        handlebars: '../components/handlebars/handlebars',
        d3: '../components/d3/d3'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    }
});

require(['jquery', 'bootstrap', 'handlebars', 'd3'], function ($) {
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
            url: 'http://api.storify.com/v1/stories/search?q=' + query,
            error: function(errorThrown) { console.log(errorThrown); },
            success: function(data) {
                // Iterate through the data and push the values to Firebase
                var stories = data.content.stories;
                $.each(stories, function() {

                    storiesRef.push({
                        title: this.title,
                        id: this.sid,
                        permalink: this.permalink,
                        version: this.version,
                        thumbnail: this.thumbnail,
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
                        },
                        author: {
                            username: this.author.username,
                            avatar: this.author.avatar
                        },
                        search: query
                    });
                }); // .each()
                //location.reload();
            } // success
        }); // .ajax()
    }); // .click()

    // Attach to Handlebars
    var source = $('#storify-template').html();
    var template = Handlebars.compile(source);

    // If the nothing is the db write an alert to the DOM
    // However, upon a search, grab the data and throw it on to the page
    // Check against values already in Firebase (by id) and only
    // append values that are unique

    storiesRef.on('value', function(snapshot) {
        if(snapshot.val() === null) {
            $('form').append('<span class="btn btn-info">There is nothing in the database. Search some stories!</span>')

        } else {
            /*$.each(snapshot.val(), function() {
                $('#storify-stories').append(template(this));
                console.log(this);
            })*/
            console.log(snapshot.val())
        }
    });
}); // require()