'use strict';

/**
 * @ngdoc directive
 * @name proGridClientApp.directive:pgDashboard
 * @description
 * # pgDashboard
 */
angular.module('proGridApp')
  .directive('pgDashboard', function () {
    return {
      templateUrl: 'pgDashboard',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

        scope.menuOpen = false;
        scope.currentView = 'dashboard';
        scope.currentTemplate = 'pgDashboard.' + scope.currentView;
        scope.switchView = function (v) {
          scope.currentView = v;
          scope.currentTemplate = 'pgDashboard.' + v;
          scope.menuOpen = false;
        };

        scope.toggleMenu = function () {
          scope.menuOpen = scope.menuOpen ? false : true;
        };
        
      }
    };
  });
