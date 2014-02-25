/*global define*/

define([
    'jquery',
    'backbone',
    'controllers/app'
], function ($, Backbone, AppController) {
    'use strict';

    var AppRouter = Backbone.Router.extend({
        routes: {
            '*any': 'app'
        },
        app: function () {
            this.appController = this.appController || new AppController();
            this.appController.route();
        }

    });

    return AppRouter;
});