module.exports = (A, B, C) => {
  return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
};
