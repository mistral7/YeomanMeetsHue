/*global define*/

define([
    'helpers/model',
    'underscore',
    'backbone'
], function (modelHelper, _, Backbone) {
    'use strict';

    var LightModel = Backbone.Model.extend({
        urlRoot: function () {
            return modelHelper.urlRoot + '/' + modelHelper.username + '/lights';
        }
    });

    return LightModel;
});
