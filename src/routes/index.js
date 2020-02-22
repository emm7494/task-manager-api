["task", "user"].forEach((route) => {
  module.exports[`${route}Router`] = require(`./${route}`);
});
