'use strict';

angular.module('proGridApp')
  .controller('MainCtrl', ['$scope', '$timeout', 'hostname', 'injectStyle', function ($scope, $timeout, hostname, injectStyle) {
    var socket = io.connect(hostname);
    // Socket listener for updating grid
    $scope.userColor = '';
    $scope.mod = '0'; //0: no mod, 1: heat mod, 2: black mod, 3: blend mod
    $scope.maxclicks = 0; //maxclicks
    $scope.localdata = [];
    for (var a = 0; a<data.gridArray.length-1; a++) {
      localdata.push(new Array(data.gridArray.length));
      for (var b = 0; b<data.gridArray.length-1; b++) {
        localdata[a][b] = {row: a, col: b, color: '', clicks: 0};
      }
    }
    $scope.user = {
      color: '',
      name: 'anon'
    };
    $scope.meta = {
      numUsers: 0
    };

    var apiKey = 1;
    var updateGrid = function(row, col, color) {
      $timeout(function () {
        localdata[row][col].color = color;
        switch($scope.mod) {
          case '0': $scope.gridArray[row][col].color = !!$scope.gridArray[row][col].color ? '' : color;
          break;
          case '1': $scope.gridArray[row][col].color = "#" + 
          Math.floor(255*localdata[row][col].clicks/$scope.maxclicks).toString(16) + "0000";
          break;
          case '2': $scope.gridArray[row][col].color = !!$scope.gridArray[row][col].color ? '#000000' : '';
          break;
          case '3':
          break;
        }
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
      console.log(data);
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

    $scope.heatMod = function() {
      $scope.mod = '1';
      for(var a = 0; a < data.gridArray.length; a++) {
        for(var b = 0; b < data.gridArray.length; b++) {
          $scope.maxclicks = localdata[a][b] > $scope.maxclicks ? localdata[a][b]: $scope.maxclicks;}}
      for(var a = 0; a < data.gridArray.length; a++) {
        for(var b = 0; b < data.gridArray.length; b++) {
          var hex = Math.floor(255*localdata[a][b].clicks/$scope.maxclicks).toString(16);
          var heat = "#" + hex + "0000";
          $scope.gridArray[a][b].color = heat;
        }
      }  
    };

    $scope.blackMod = function () {
      $scope.mod = '2';
      for(var a = 0; a < data.gridArray.length; a++) {
        for(var b = 0; b < data.gridArray.length; b++) {
          $scope.gridArray[a][b].color = !!$scope.gridArray[a][b].color ? '#000000' : '';
        }
      }
    }

    $scope.blendMod = function () {
      $scope.mod = '3';
      var list = [];
      for(var a = 0; a < data.gridArray.length; a++) {
        list.push({"r": 0,"g": 0,"b": 0});
        for(var b = 0; b < data.gridArray.length; b++) {
          list[a].r += parseInt(localdata[a][b].color.substring(1,3),16);
          list[a].g += parseInt(localdata[a][b].color.substring(3,5),16);
          list[a].b += parseInt(localdata[a][b].color.substring(5,7),16);
        }
      }
      for(var a = 0; a < data.gridArray.length; a++) {
        for(var b = 0; b < data.gridArray.length; b++) {
          var cr = list[a].r*b/data.gridArray.length;
          var cg = list[a].g*b/data.gridArray.length;
          var cb = list[a].b*b/data.gridArray.length;
          $scope.gridArray[a][b].color = "#" + Math.floor(cr).toString(16) + Math.floor(cg).toString(16) + Math.floor(cb).toString(16);
        }
      }
    }

    $scope.modOff = function() {
      $scope.mod = '0';
      for(var a = 0; a < data.gridArray.length; a++) {
        for(var b = 0; b < data.gridArray.length; b++) {
          $scope.gridArray[a][b].color = localdata[a][b].color;
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
