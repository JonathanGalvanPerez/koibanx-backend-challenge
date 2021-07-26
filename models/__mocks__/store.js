const countDocuments = jest.fn(() => Promise.resolve(100));
const find = jest.fn();

module.exports = {
  countDocuments,
  find
};