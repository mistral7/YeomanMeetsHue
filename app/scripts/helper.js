/*global define*/

define([
    'helpers/model'
], function (modelHelper) {
    'use strict';

    var rgbToHex = function(rgb) {
        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    };

    var hexToRgb = function (code) {
        return {
            r: parseInt(code.slice(1,3), 16),
            g: parseInt(code.slice(3,5), 16),
            b: parseInt(code.slice(5,7), 16)
        }
    };

    /**
     * RGB配列 を HSV配列 へ変換します
     *
     * @param   {Number}  r         red値   ※ 0～255 の数値
     * @param   {Number}  g         green値 ※ 0～255 の数値
     * @param   {Number}  b         blue値  ※ 0～255 の数値
     * @param   {Boolean} coneModel 円錐モデルにするか
     * @return  {Object}  {h, s, v} ※ h は 0～360の数値、s/v は 0～255 の数値
     */
    var rgbToHsv = function (r, g, b, coneModel) {
        var h, // 0..360
            s, v, // 0..255
            max = Math.max(Math.max(r, g), b),
            min = Math.min(Math.min(r, g), b);

        // hue の計算
        if (max == min) {
            h = 0; // 本来は定義されないが、仮に0を代入
        } else if (max == r) {
            h = 60 * (g - b) / (max - min) + 0;
        } else if (max == g) {
            h = (60 * (b - r) / (max - min)) + 120;
        } else {
            h = (60 * (r - g) / (max - min)) + 240;
        }

        while (h < 0) {
            h += 360;
        }

        // saturation の計算
        if (coneModel) {
            // 円錐モデルの場合
            s = max - min;
        } else {
            s = (max == 0)
                ? 0 // 本来は定義されないが、仮に0を代入
                : (max - min) / max * 255;
        }

        // value の計算
        v = max;

        return {'h': h, 's': s, 'v': v};
    };
    /**
     * HSV配列 を RGB配列 へ変換します
     *
     * @param   {Number}  h         hue値        ※ 0～360の数値
     * @param   {Number}  s         saturation値 ※ 0～255 の数値
     * @param   {Number}  v         value値      ※ 0～255 の数値
     * @return  {Object}  {r, g, b} ※ r/g/b は 0～255 の数値
     */
    var hsvToRgb = function (h, s, v) {
        var r, g, b; // 0..255

        while (h < 0) {
            h += 360;
        }

        h = h % 360;

        // 特別な場合 saturation = 0
        if (s == 0) {
            // → RGB は V に等しい
            v = Math.round(v);
            return {'r': v, 'g': v, 'b': v};
        }

        s = s / 255;

        var i = Math.floor(h / 60) % 6,
            f = (h / 60) - i,
            p = v * (1 - s),
            q = v * (1 - f * s),
            t = v * (1 - (1 - f) * s)

        switch (i) {
            case 0 :
                r = v;  g = t;  b = p;  break;
            case 1 :
                r = q;  g = v;  b = p;  break;
            case 2 :
                r = p;  g = v;  b = t;  break;
            case 3 :
                r = p;  g = q;  b = v;  break;
            case 4 :
                r = t;  g = p;  b = v;  break;
            case 5 :
                r = v;  g = p;  b = q;  break;
        }

        return {'r': Math.round(r), 'g': Math.round(g), 'b': Math.round(b)};
    };

    var helper = {
        color: {
            rgbToHex: rgbToHex,
            hexToRgb: hexToRgb,
            rgbToHsv: rgbToHsv,
            hsvToRgb: hsvToRgb
        },
        model: modelHelper
    };
    return helper;
});
