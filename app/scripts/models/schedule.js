/*global define*/

define([
    'helpers/model',
    'underscore',
    'backbone'
], function (modelHelper, _, Backbone) {
    'use strict';

    var ScheduleModel = Backbone.Model.extend({
        urlRoot: function () {
            return modelHelper.urlRoot + '/' + modelHelper.username + '/schedules';
        }
    });

    return ScheduleModel;
});
