'use strict';

describe('Service: setGridDimensions', function () {

  // load the service's module
  beforeEach(module('proGridApp'));

  // instantiate service
  var setGridDimensions;
  beforeEach(inject(function (_setGridDimensions_) {
    setGridDimensions = _setGridDimensions_;
  }));

  it('should do something', function () {
    expect(!!setGridDimensions).toBe(true);
  });

});
