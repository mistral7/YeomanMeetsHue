/*global define*/

define([
    'helpers/model',
    'underscore',
    'backbone'
], function (modelHelper, _, Backbone) {
    'use strict';

    var FullStateModel = Backbone.Model.extend({
        url: function () {
            return modelHelper.urlRoot + '/' + modelHelper.username;
        }
    });

    return FullStateModel;
});
