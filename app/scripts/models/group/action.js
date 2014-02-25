/*global define*/

define([
    'helpers/model',
    'underscore',
    'backbone'
], function (modelHelper, _, Backbone) {
    'use strict';

    var GroupActionModel = Backbone.Model.extend({
        url: function () {
            return modelHelper.urlRoot + '/' + modelHelper.username + '/groups/' + this.id + '/action';
        },
        doAction: function (params, options) {
            return this.save(null, _.extend({}, options, {
                data: JSON.stringify(params)
            }));
        }
    });

    return GroupActionModel;
});
