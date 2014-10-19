'use strict';

angular.module('proGridApp')
  .controller('MainCtrl', ['$scope', 'Randomcolor', 'hostname', function ($scope, Randomcolor, hostname) {
    var socket = io.connect(hostname);
    // Socket listener for updating grid
    var userColor = Randomcolor.new();
    var apiKey = 1;
    var updateGrid = function(row, col, color) {
      var selector = '.col_' + row + '_' + col;
      var el = document.querySelector(selector);
      if(el.style.backgroundColor) {
        el.style.backgroundColor = '';
      } else {
        el.style.backgroundColor = color;
      }
    };
    socket.on('server ready', function (data) {
      //grid is an array
      console.log('Hello There! Hope you are enjoying the app. Please be nice! Please help us fix our issues over at: https://github.com/pro-grid/pro-grid Thank you. -progrid.io');
      data.gridArray.forEach(function (element) {
        element.forEach(function (element) {
          updateGrid(element.row, element.col, element.color);
        });
      });
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

    $scope.dimensions = 32;

    $scope.generateGrid = function(num) {
      return new Array(num);
    };

    $scope.gridClicked = function(row, col) {
      updateGrid(row, col, userColor);
      socket.emit('clicked', { row: row, col: col, color: userColor, apiKey: apiKey });
    };

    $scope.gridRightClicked = function(row, col) {
      var selector = '.col_' + row + '_' + col;
      var el = document.querySelector(selector);
      userColor = colorToHex(el.style.backgroundColor);
    };
    
    $scope.heatMod = function() {
      var list = [];
      for(var a = 0; a < data.gridArray.length; a++) {
        for(var b = 0; b < data.gridArray.length; b++) {
          var clicks = Math.random(100);
          var maxclicks = 100;
          var hex = Math.floor(255*clicks/maxclicks).toString(16);
          var heat = "#" + hex + "0000";
          list.push({"row": a,"col": b,"color": heat});
        }
      }
      for(var c = 0; c < list.length-1; c++)
        updateGrid(list[c].row, list[c].col, list[c].color);
    };

    $scope.modOff = function() {
      for(var a = 0; a < data.gridArray.length; a++) {
        for(var b = 0; b < data.gridArray.length; b++) {
          updateGrid(b, a, $scope.gridArray[b][a].color);
        }
      }
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

function colorToHex(color) {
  if (color.substr(0, 1) === '#') {
    return color;
  }
  var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

  var red = parseInt(digits[2]);
  var green = parseInt(digits[3]);
  var blue = parseInt(digits[4]);

  var rgb = blue | (green << 8) | (red << 16);
  return digits[1] + '#' + rgb.toString(16);
}
