/*global define*/

define([
    'helpers/model',
    'underscore',
    'backbone'
], function (modelHelper, _, Backbone) {
    'use strict';

    var LightStateModel = Backbone.Model.extend({
        url: function () {
            return modelHelper.urlRoot + '/' + modelHelper.username + '/lights/' + this.id + '/state';
        },
        changeState: function (params, options) {
            return this.save(null, _.extend({}, options, {
                data: JSON.stringify(params)
            }));
        }
    });

    return LightStateModel;
});
