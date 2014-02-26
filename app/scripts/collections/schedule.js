/*global define*/

define([
    'helpers/model',
    'underscore',
    'backbone',
    'models/schedule'
], function (modelHelper, _, Backbone, ScheduleModel) {
    'use strict';

    var ScheduleCollection = Backbone.Collection.extend({
        url: function () {
            return modelHelper.urlRoot + '/' + modelHelper.username + '/schedules'
        },
        parse: function (ret) {
            return _.map(ret, function (schedule, idx) {
                return _.extend({}, schedule, {id: parseInt(idx, 10)});
            });
        },
        model: ScheduleModel
    });

    return ScheduleCollection;
});
