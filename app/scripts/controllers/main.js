'use strict';

angular.module('proGridApp')
  .controller('MainCtrl', ['$scope', 'Randomcolor', 'hostname', 'injectStyle', function ($scope, Randomcolor, hostname, injectStyle) {
    var socket = io.connect(hostname);
    // Socket listener for updating grid
    var userColor = Randomcolor.new();
    var apiKey = 1;
    var updateGrid = function(row, col, color) {
      $scope.gridArray[row][col].color = !!$scope.gridArray[row][col].color ? '' : color;
      $scope.$apply();
    };

    socket.on('server ready', function (data) {
      //grid is an array
      var message = 'Hello There! Hope you are enjoying the app. Please be '+
      'nice! Please help us fix our issues over at: '+
      'https://github.com/pro-grid/pro-grid Thank you. -progrid.io';
      console.log(message);
      injectStyle.gridDimensions(data.gridArray.length);
      $scope.gridArray = angular.copy(data.gridArray);
      $scope.$apply();
    });

    socket.on('fresh api key', function (data) {
      apiKey = data.apiKey;
    });

    socket.on('update', function (data) {
      updateGrid(data.row, data.col, data.color);
    });
    socket.on('connect', function () {
      $scope.message = false;
    });
    socket.on('disconnect', function () {
      $scope.message = {
        title: 'Disconnected',
        body: 'You have been disconnected. Feel free to refresh the page if this message doesn’t go away.'
      };
      console.log('goodbye');
    });

    $scope.gridClicked = function(row, col) {
      updateGrid(row, col, userColor);
      socket.emit('clicked', { row: row, col: col, color: userColor, apiKey: apiKey });
    };

    $scope.gridRightClicked = function(row, col) {
      var selector = '.col_' + row + '_' + col;
      var el = document.querySelector(selector);
      userColor = el.style.backgroundColor;
    };

    $scope.closeMessage = function() {
      $scope.message = false;
    };
    $scope.gridClicked = _.throttle($scope.gridClicked, 100, {trailing: false});
  }]);

angular.module('proGridApp')
  .directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
      var fn = $parse(attrs.ngRightClick);
      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          fn(scope, {$event:event});
        });
      });
    };
  });
