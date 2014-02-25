/*global define*/

define([
    'helpers/model',
    'underscore',
    'backbone'
], function (modelHelper, _, Backbone) {
    'use strict';

    var DiscoverModel = Backbone.Model.extend({
        url: function () {
            return 'https://www.meethue.com/api/nupnp';
        },
        parse: function (res) {
            return res[0];
        }
    });

    return DiscoverModel;
});
