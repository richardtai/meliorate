var Sequelize = require('sequelize'),
    sequelize = new Sequelize ('meliorate_db', 'richardtai', null, {
      dialect: 'postgres',
      // When connecting to the database, psql uses 'local socket' as the default
      // method of connecting, while sequelize uses 'host'. Therefore, specify this 
      // instance of seqeulize to use the 'local socket'.
      socket: 'local socket',
      port: '5432'
});

var User = sequelize.define('Users', {
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING
});
/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', {title: "Meliorate"});
};

exports.post_handler = function(req, res) {
  User.create({
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    email: req.body.email,
    password: req.body.password
  })  
  res.send("Yay!");
};