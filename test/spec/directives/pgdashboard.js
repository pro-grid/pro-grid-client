'use strict';

describe('Directive: pgDashboard', function () {

  // load the directive's module
  beforeEach(module('proGridClientApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<pg-dashboard></pg-dashboard>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the pgDashboard directive');
  }));
});
