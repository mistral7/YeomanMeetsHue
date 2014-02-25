/*global define*/

define([
    'helpers/model',
    'underscore',
    'backbone'
], function (modelHelper, _, Backbone) {
    'use strict';

    var LightNewModel = Backbone.Model.extend({
        url: function () {
            return modelHelper.urlRoot + '/' + modelHelper.username + '/lights/' + this.id + '/new';
        }
    });

    return LightNewModel;
});
