'use strict';

/**
 * @ngdoc service
 * @name.setGridDimensions
 * @description
 * # setGridDimensions
 * Factory in the proGridApp.
 */
angular.module('proGridApp')
  .factory('setGridDimensions', function () {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

    return {
      style: function (height) {
        var css = '.g__row { min-height:'
            css += (100/height) + "%";
            css += '; opacity: 1; }';
        style.type = 'text/css';
        if (style.styleSheet){
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);

        return this; 
      }
    };
  });
