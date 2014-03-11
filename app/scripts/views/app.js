/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates',
    'helper'
], function ($, _, Backbone, JST, helper) {
    'use strict';

    var AppView = Backbone.View.extend({
        template: JST['app/scripts/templates/app.ejs'],
        events: {
            'click .onoff button': 'onClickOnoffButton',
            'click .colors button': 'onClickColorsButton',
            'click .alerts button': 'onClickAlertsButton',
            'click .effects button': 'onClickEffectsButton',
            'click .clear-schedule': 'onClickClearSchedule',
            'click .lt-start': 'onClickLtStart'
        },
        render: function () {
            this.$el.html(this.template());

            return this;
        },
        onClickOnoffButton: function (ev) {
            this.trigger('changeOnoff', _.extend({}, this.getSelectedLight(), {
                onoff: $(ev.currentTarget).data('on') === 'on'
            }));
        },
        onClickColorsButton: function (ev) {
            this.trigger('changeColor', _.extend({}, this.getSelectedLight(), {
                color: $(ev.currentTarget).data('color'),
                hex: helper.color.rgbToHex($(ev.currentTarget).find('label').css('background-color'))
            }));
        },
        onClickAlertsButton: function (ev) {
            this.trigger('changeAlert',  _.extend({}, this.getSelectedLight(), {
                alert: $(ev.currentTarget).data('alert')
            }));
        },
        onClickEffectsButton: function (ev) {
            this.trigger('changeEffect',  _.extend({}, this.getSelectedLight(), {
                effect: $(ev.currentTarget).data('effect')
            }));
        },
        getSelectedLight: function () {
            var domValue = this.$('.lights .active input[name=lights]').val().split('-');

            return {type: domValue[0], index: domValue[1]};
        },
        onClickClearSchedule: function () {
            this.trigger('clearSchedule');
        },
        onClickLtStart: function () {
            this.trigger('ltStart');
        },
        setTimeReaming: function (min, sec) {
            var renderTime;

            if (_.isNaN(min) || sec < 0) {
                renderTime = '00:00';
                this.$('.time-reaming').text(renderTime).removeClass('text-danger');
            } else {
                renderTime = ('00' + min).slice(-2) + ':' + ('00' + sec).slice(-2);
                this.$('.time-reaming').text(renderTime).toggleClass('text-danger', min < 1);
            }
        }
    });

    return AppView;
});
