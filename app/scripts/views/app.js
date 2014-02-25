/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var rgb2hex = function(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }

    var AppView = Backbone.View.extend({
        template: JST['app/scripts/templates/app.ejs'],
        events: {
            'click .onoff button': 'onClickOnoffButton',
            'click .colors button': 'onClickColorsButton',
            'click .alerts button': 'onClickAlertsButton',
            'click .effects button': 'onClickEffectsButton'
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
                color: rgb2hex($(ev.currentTarget).find('label').css('background-color'))
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
        }
    });

    return AppView;
});
