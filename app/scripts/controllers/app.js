/*global define*/

define([
    'helper',
    'underscore',
    'moment',
    'backbone',
    'models/full-state',
    'models/light',
    'models/light/state',
    'models/group/action',
    'models/schedule',
    'collections/light',
    'collections/group',
    'collections/schedule',
    'views/app'
], function (helper, _, moment, Backbone,
             FullStateModel,
             LightModel, LightStateModel, GroupActionModel, ScheduleModel,
             LightCollection, GroupCollection, ScheduleCollection,
             AppView) {
    'use strict';

    var AppController = function () {
        this.initialize.apply(this, arguments);
    };

    _.extend(AppController.prototype, Backbone.Events, {
        colors: {
            red: {r: 254, g: 2, b: 6},
            orange: {r: 254, g: 158, b: 3},
            yellow: {r: 46, g: 254, b: 4},
            green: {r: 2, g: 201, b: 68},
            blue: {r: 78, g: 2, b: 254},
//                cyan: '',
            purple: {r: 176, g: 13, b: 201}
        },
        initialize: function () {
            this.fullStateModel   = new FullStateModel();

            this.light1StateModel = new LightStateModel({id: 1});
            this.light2StateModel = new LightStateModel({id: 2});
            this.light3StateModel = new LightStateModel({id: 3});

            this.group1ActionModel = new GroupActionModel({id: 1});
            this.group2ActionModel = new GroupActionModel({id: 2});
            this.group3ActionModel = new GroupActionModel({id: 3});
            this.group4ActionModel = new GroupActionModel({id: 4});

            this.appView = new AppView();

            this.listenTo(this.fullStateModel, 'change:config', this.onChangeConfigState);
            this.listenTo(this.fullStateModel, 'change:lights', this.onChangeLightsState);

            this.listenTo(this.appView, 'changeOnoff', this.onChangeOnoff);
            this.listenTo(this.appView, 'changeColor', this.onChangeColor);
            this.listenTo(this.appView, 'changeAlert', this.onChangeAlert);
            this.listenTo(this.appView, 'changeEffect', this.onChangeEffect);
        },
        route: function () {
            var _this = this;

            $('#content').html(this.appView.render().el);

            this.fullStateModel.fetch();
            this.timer = setInterval(function () {
                _this.fullStateModel.fetch();
            }, 500);

            this.sched();
//            this.sched1();
            this.sched2();
        },
        onChangeConfigState: function () {
            var config = this.fullStateModel.get('config'),
                hueDate = moment.utc(config.UTC),
                now = moment();

            this.diff = now - hueDate;
        },
        onChangeLightsState: function () {
            var lights = this.fullStateModel.get('lights'),
                light1Rgb = helper.color.hsvToRgb(Math.floor(((lights[1].state.hue * 360) / 65535)), lights[1].state.sat, lights[1].state.bri),
                light2Rgb = helper.color.hsvToRgb(Math.floor(((lights[2].state.hue * 360) / 65535)), lights[2].state.sat, lights[2].state.bri),
                light3Rgb = helper.color.hsvToRgb(Math.floor(((lights[3].state.hue * 360) / 65535)), lights[3].state.sat, lights[3].state.bri),
                convert = function (rgb) {
                    return 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
                };

            $('.lights-state .light-1').css('color', lights[1].state.on ? convert(light1Rgb) : '#dddddd');
            $('.lights-state .light-2').css('color', lights[2].state.on ? convert(light2Rgb) : '#dddddd');
            $('.lights-state .light-3').css('color', lights[3].state.on ? convert(light3Rgb) : '#dddddd');
        },
        onChangeOnoff: function (data) {
            var params = {on: data.onoff};

            this.doAction(data, params);
        },
//        onChangeColor: function (data) {
//            var _this = this,
//                rgb = helper.color.hexToRgb(data.color),
//                hsv = helper.color.rgbToHsv(rgb.r, rgb.g, rgb.b, false),
//                params = {
//                    hue: Math.floor((hsv.h * 65535) / 360),
//                    sat: Math.floor(hsv.s),
//                    bri: Math.floor(hsv.v)
//                };
//            console.log(rgb);
//
//            this.doAction(data, {on: true}).done(function () {
//                _this.doAction(data, params);
//            });
//        },
        onChangeColor: function (data) {
            var _this = this;

            this.doAction(data, {on: true}).done(function () {
                _this.doAction(data, _this.generateHsvParams(data.color));
            });
        },
        generateHsvParams: function (color) {
            var colors = this.colors,
//                rgb = helper.color.hexToRgb(data.hex),
                rgb = colors[color],
                hsv = helper.color.rgbToHsv(rgb.r, rgb.g, rgb.b, false),
                params = {
                    hue: Math.floor((hsv.h * 65535) / 360),
                    sat: Math.floor(hsv.s),
                    bri: Math.floor(hsv.v)
                };

            return params;
        },
        onChangeAlert: function (data) {
            var params = {alert: data.alert};

            this.doAction(data, params);
        },
        onChangeEffect: function (data) {
            var _this = this,
                params = {effect: data.effect};

            this.doAction(data, {on: true}).done(function () {
                _this.doAction(data, params);
            });
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
        },
        sched: function () {
            var params = {
                'name': 'Wake up',
                'description': 'My wake up alarm',
                'command': {
                    'address': this.group1ActionModel.url().match(/\/api.*/)[0],
                    'method': 'PUT',
                    'body': _.extend({}, {on: true, transitiontime: 5}, this.generateHsvParams('orange'))
                },
                'time': moment().add('ms', this.diff).add('s', 5).toISOString().slice(0,19)
            };
            var sched = new ScheduleModel();
            return sched.save(params, {wait: true})
                .done(function () {
                    console.log('Schedule registered.');
                });
        },
        sched1: function () {
            var params = {
                'name': 'Wake up',
                'description': 'My wake up alarm',
                'command': {
                    'address': this.group1ActionModel.url().match(/\/api.*/)[0],
                    'method': 'PUT',
                    'body': {
                        'alert': 'select'
                    }
                },
                'time': moment().add('ms', this.diff).add('s', 6).toISOString().slice(0,19)
            };
            var sched = new ScheduleModel();
            sched.save(params, {wait: true})
                .done(function () {
                    console.log('Schedule registered.');
                });
        },
        sched2: function () {
            var params = {
                'name': 'Wake up',
                'description': 'My wake up alarm',
                'command': {
                    'address': this.group1ActionModel.url().match(/\/api.*/)[0],
                    'method': 'PUT',
                    'body': {
                        'on': false,
                        transitiontime: 5
                    }
                },
                'time': moment().add('ms', this.diff).add('s', 6).toISOString().slice(0,19)
            };
            var sched = new ScheduleModel();
            sched.save(params, {wait: true})
                .done(function () {
                    console.log('Schedule registered.');
                });
        }
    });

    return AppController;
});