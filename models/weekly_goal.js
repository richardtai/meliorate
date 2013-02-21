// db is the sequelize database instance we created in 'seq.js'
var db = require('../seq');

// Defining the WeeklyGoal model.
var WeeklyGoal = db.sequelize.define('WeeklyGoal', {
  description: db.Sequelize.STRING,
  isCompleted: db.Sequelize.BOOLEAN
});

// Export the 'WeeklyGoal' so that it can be access by the instance initiated.
// See here for example if ever lost:
// http://stackoverflow.com/questions/5311334/what-is-the-purpose-of-nodejs-module-exports-and-how-do-you-use-it

exports.WeeklyGoal = WeeklyGoal;