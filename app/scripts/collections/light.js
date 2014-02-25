/*global define*/

define([
    'helpers/model',
    'underscore',
    'backbone',
    'models/light'
], function (modelHelper, _, Backbone, LightModel) {
    'use strict';

    var LightCollection = Backbone.Collection.extend({
        url: modelHelper.urlRoot + '/' + modelHelper.username + '/lights',
        parse: function (ret) {
            return _.map(ret, function (light, idx) {
                return _.extend({}, light, {id: parseInt(idx, 10)});
            });
        },
        model: LightModel
    });

    return LightCollection;
});
