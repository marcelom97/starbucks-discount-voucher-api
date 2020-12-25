const asyncHandler = (fn) => (...args) => {
  const fnReturn = fn(...args);
  const next = args[args.length - 1];
  return Promise.resolve(fnReturn).catch(next);
};

// const asyncHandler = fn => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };

module.exports = asyncHandler;
