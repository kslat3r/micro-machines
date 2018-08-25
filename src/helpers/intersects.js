const ccw = require('./ccw');

module.exports = (A, B, C, D) => {
  if (ccw(A, C, D) !== ccw(B, C, D) && ccw(A, B, C) !== ccw(A, B, D)) {
    return true;
  }

  return false;
};
