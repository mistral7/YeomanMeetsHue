/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: [
                'jquery'
            ],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: '../bower_components/sass-bootstrap/dist/js/bootstrap',
        'requirejs-text': '../bower_components/requirejs-text/text',
        modernizr: '../bower_components/modernizr/modernizr',
        requirejs: '../bower_components/requirejs/require',
        'sass-bootstrap': '../bower_components/sass-bootstrap/dist/js/bootstrap',
        fastclick: '../bower_components/fastclick/lib/fastclick',
        moment: '../bower_components/moment/moment'
    }
});

require([
    'fastclick',
    'helper',
    'bootstrap',
    'backbone',
    'models/discover',
    'routes/app'
], function (FastClick, helper, bootstrap, Backbone, DiscoverModel, AppRouter) {
    var discoverModel = new DiscoverModel;
    
    $(function() {
        FastClick.attach(document.body);
    });

    if (helper.model.urlRoot.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)[0] === '1.1.1.1') {
        discoverModel.fetch()
            .done(function () {
                helper.model.urlRoot = 'http://' + discoverModel.get('internalipaddress') + '/api';
                new AppRouter();
                Backbone.history.start();
            });
    } else {
        new AppRouter();
        Backbone.history.start();
    }
});
