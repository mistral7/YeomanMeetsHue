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
            this.listenTo(this.appView, 'clearSchedule', this.onClearSchedule);
            this.listenTo(this.appView, 'ltStart', this.onLtStart);
        },
        route: function () {
            var _this = this;

            $('#content').html(this.appView.render().el);

            this.fullStateModel.fetch();
            this.timer = setInterval(function () {
                _this.fullStateModel.fetch();
                _this.calculateTimer();
            }, 500);
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
                    return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
                };

            $('.lights-state .light-1').css('color', lights[1].state.on ? convert(light1Rgb) : '#dddddd');
            $('.lights-state .light-2').css('color', lights[2].state.on ? convert(light2Rgb) : '#dddddd');
            $('.lights-state .light-3').css('color', lights[3].state.on ? convert(light3Rgb) : '#dddddd');
        },
        onChangeOnoff: function (data) {
            var params = {on: data.onoff};

            this.doAction(data, params);
        },
        onChangeColor: function (data) {
            var _this = this;

            this.doAction(data, {on: true}).done(function () {
                _this.doAction(data, _this.generateHsvParams(data.color));
            });
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
        onClearSchedule: function () {
            var schedules = this.fullStateModel.get('schedules'),
                __scheduleModel;

            this.target = null;

            _.each(schedules, function (schedule, key) {
                __scheduleModel = new ScheduleModel({id: key});
                __scheduleModel.destroy();
            });
        },
        onLtStart: function () {
            this.startLt(2);
        },
        // Functions
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
        generateHsvParams: function (color) {
            var colors = this.colors,
                rgb = colors[color],
                hsv = helper.color.rgbToHsv(rgb.r, rgb.g, rgb.b, false),
                params = {
                    hue: Math.floor((hsv.h * 65535) / 360),
                    sat: Math.floor(hsv.s),
                    bri: Math.floor(hsv.v)
                };

            return params;
        },
        startLt: function (min) {
            var baseParams = {
                    'name': 'Start LT',
                    'description': 'Desc',
                    'command': null,
                    'time': null
                },
                before1minOnModel  = new ScheduleModel(),
                before1minOffModel  = new ScheduleModel(),
                timeUpOnModel  = new ScheduleModel(),
                timeUpAlertModel  = new ScheduleModel(),
                now = moment().add('ms', this.diff),
                target = this.target = now.clone().add('m', min);

            before1minOnModel.save(_.extend({}, baseParams, {
                'command': {
                    'address': this.group1ActionModel.url().match(/\/api.*/)[0],
                    'method': 'PUT',
                    'body': _.extend({}, {
                        on: true,
                        transitiontime: 5
                        },
                        this.generateHsvParams('orange')
                    )
                },
                'time': target.clone().subtract('s', 30).toISOString().slice(0, 19)
            }));
            before1minOffModel.save(_.extend({}, baseParams, {
                'command': {
                    'address': this.group1ActionModel.url().match(/\/api.*/)[0],
                    'method': 'PUT',
                    'body': {
                        'on': false,
                        transitiontime: 5
                    }
                },
                'time':  target.clone().subtract('s', 30).add('s', 1).toISOString().slice(0, 19)
            }));
            timeUpOnModel.save(_.extend({}, baseParams, {
                'command': {
                    'address': this.group1ActionModel.url().match(/\/api.*/)[0],
                    'method': 'PUT',
                    'body': _.extend({}, {
                            on: true,
                            transitiontime: 5
                        },
                        this.generateHsvParams('red')
                    )
                },
                'time':  target.clone().toISOString().slice(0,19)
            }));
            timeUpAlertModel.save(_.extend({}, baseParams, {
                'command': {
                    'address': this.group1ActionModel.url().match(/\/api.*/)[0],
                    'method': 'PUT',
                    'body': {
                        alert: 'lselect'
                    }
                },
                'time': target.clone().add('s', 1).toISOString().slice(0, 19)
            }));
        },
        calculateTimer: function () {
            var min = Math.floor((this.target - moment()) / 1000 / 60),
                sec = Math.floor((this.target - moment()) / 1000 % 60);

            this.appView.setTimeReaming(min, sec);
        }
    });

    return AppController;
});