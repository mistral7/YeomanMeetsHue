/*global define*/

define([
    'helpers/model',
    'underscore',
    'backbone'
], function (modelHelper, _, Backbone) {
    'use strict';

    var GroupModel = Backbone.Model.extend({
        urlRoot: function () {
            return modelHelper.urlRoot + '/' + modelHelper.username + '/groups';
        }
    });

    return GroupModel;
});
