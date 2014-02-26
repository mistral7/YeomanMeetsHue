/*global define*/

define([
    'helpers/model',
    'underscore',
    'backbone',
    'models/group'
], function (modelHelper, _, Backbone, GroupModel) {
    'use strict';

    var GroupCollection = Backbone.Collection.extend({
        url: function () {
            return modelHelper.urlRoot + '/' + modelHelper.username + '/groups'
        },
        parse: function (ret) {
            return _.map(ret, function (group, idx) {
                return _.extend({}, group, {id: parseInt(idx, 10)});
            });
        },
        model: GroupModel
    });

    return GroupCollection;
});
