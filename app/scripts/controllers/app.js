/*global define*/

define([
    'helper',
    'underscore',
    'backbone',
    'models/light',
    'models/light/state',
    'models/group/action',
    'collections/light',
    'collections/group',
    'collections/schedule',
    'views/app'
], function (helper, _, Backbone,
             LightModel, LightStateModel, GroupActionModel,
             LightCollection, GroupCollection, ScheduleCollection,
             AppView) {
    'use strict';

    var AppController = function () {
        this.initialize.apply(this, arguments);
    };

    _.extend(AppController.prototype, Backbone.Events, {
        initialize: function () {
            this.light1StateModel = new LightStateModel({id:1});
            this.light2StateModel = new LightStateModel({id:2});
            this.light3StateModel = new LightStateModel({id:3});

            this.group1ActionModel = new GroupActionModel({id: 1});
            this.group2ActionModel = new GroupActionModel({id: 2});
            this.group3ActionModel = new GroupActionModel({id: 3});
            this.group4ActionModel = new GroupActionModel({id: 4});

            this.appView = new AppView();
            this.listenTo(this.appView, 'changeOnoff', this.onChangeOnoff);
            this.listenTo(this.appView, 'changeColor', this.onChangeColor);
            this.listenTo(this.appView, 'changeAlert', this.onChangeAlert);
            this.listenTo(this.appView, 'changeEffect', this.onChangeEffect);
        },
        route: function () {
            $('#content').html(this.appView.render().el);
        },
        onChangeOnoff: function (data) {
            var params = {on: data.onoff};

            this.doAction(data, params);
        },
        onChangeColor: function (data) {
            console.log(data);
        },
        onChangeAlert: function (data) {
            var params = {alert: data.alert};

            this.doAction(data, params);
        },
        onChangeEffect: function (data) {
            var params = {effect: data.effect};

            this.doAction(data, params);
        },
        doAction: function (data, params) {
            switch (data.type) {
                case 'single':
                    return this['light' + data.index + 'StateModel'].changeState(params, {wait: true});
                    break;
                case 'group':
                    return this['group' + data.index + 'ActionModel'].doAction(params, {wait: true});
                    break;
            }
        }
    });

    return AppController;
});