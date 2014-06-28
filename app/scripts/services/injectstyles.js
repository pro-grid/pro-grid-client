'use strict';

/**
 * @ngdoc service
 * @name.injectStyle
 * @description
 * # injectStyle
 * Factory in the proGridApp.
 */
angular.module('proGridApp')
  .factory('injectStyle', function () {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    var inject = function (css) {
      style.type = 'text/css';
      if (style.styleSheet){
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }

      head.appendChild(style);
    };
    return {
      gridDimensions: function (height) {
        var css = '.g__row { min-height:'
            css += (100/height) + "%";
            css += '; }';
        inject(css);
        return this; 
      }
    };
  });
