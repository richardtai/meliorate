// db is the sequelize database instance we created in 'seq.js'
var db = require('../seq');

// Defining the User model.
var User = db.sequelize.define('Users', {
  first_name: db.Sequelize.STRING,
  last_name: db.Sequelize.STRING,
  email: db.Sequelize.STRING,
  password: db.Sequelize.STRING
});

// Export the 'User' so that it can be access by the instance initiated.
// See here for example if ever lost:
// http://stackoverflow.com/questions/5311334/what-is-the-purpose-of-nodejs-module-exports-and-how-do-you-use-it

exports.User = User;