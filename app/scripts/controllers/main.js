'use strict';

angular.module('proGridApp')
  .controller('MainCtrl', [
    '$scope', '$timeout', '$document', 'hostname', 'injectStyle', 
    function ($scope, $timeout, $document, hostname, injectStyle) {
    var socket = io.connect(hostname);
    // Socket listener for updating grid
    $scope.userColor = '';
    $scope.user = {
      color: '',
      name: 'anon'
    };
    $scope.meta = {
      numUsers: 0
    };
    $scope.modCss = {};
    $scope.mods = {
      'css': [
        {
          'name': 'invert',
          'filter': 'invert(100%)'
        },
        {
          'name': 'blur',
          'filter': 'blur(15px)'
        },
        {
          'name': 'sepia',
          'filter': 'sepia(100%)'
        },
        {
          'name': 'grayscale',
          'filter': 'grayscale(100%)'
        },
        {
          'name': 'drunk',
          'className': 'mod-drunk'
        },
        {
          'name': 'circles',
          'className': 'mod-circle'
        }


      ]
    };
    $scope.toggleCssMod = function () {
      var cssFilters = [];
      var cssClasses = [];
      _.each($scope.mods.css, function (e) {
        if(e.enabled) {
          if(e.filter) {
            cssFilters.push(e.filter);
          }
          if(e.className) {
            cssClasses.push(e.className);
          }
        }
      });

      $scope.modFilterCss = 'filter:'+cssFilters.join(' ')+';-webkit-filter:'+cssFilters.join(' ')+';';
      $scope.modClasses = cssClasses.join(' ');
    };
    var apiKey = 1;
    var updateGrid = function(row, col, color) {
      $timeout(function () {
        $scope.gridArray[row][col].color = !!$scope.gridArray[row][col].color ? '' : color;
      }, 0);
    };

    socket.on('server ready', function (data) {
      //grid is an array
      var message = 'Hello There! Hope you are enjoying the app. Please be '+
      'nice! Please help us fix our issues over at: '+
      'https://github.com/pro-grid/pro-grid Thank you. -progrid.io';
      console.log(message);
      $scope.user.color = data.userColor;
      injectStyle.gridDimensions(data.gridArray.length);
      $timeout(function () {
        $scope.gridArray = angular.copy(data.gridArray);
      }, 0);
    });

    socket.on('fresh api key', function (data) {
      apiKey = data.apiKey;
    });

    socket.on('join', function (data) {
      $scope.meta.numUsers = data;
      $scope.$apply();
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
      updateGrid(row, col, $scope.user.color);
      socket.emit('clicked', { row: row, col: col, color: $scope.user.color, apiKey: apiKey });
    };

    $scope.gridRightClicked = function(row, col) {
      var selector = '.col_' + row + '_' + col;
      var el = document.querySelector(selector);
      $scope.user.color = el.style.backgroundColor;
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
