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
  // if user hasn't logged in/signed up
  if (typeof req.session.email == 'undefined') {
    res.render('index', {title: "Meliorate"});
  } else {
    user_email = req.session.email;
    // find user via session email and then render the home page
    get_user(user_email, function(curr_user) {
      res.render('home', {title: "Meliorate", user: curr_user});
    });
  }
};

exports.post_handler = function(req, res) {
  // create a user with the values the user put in
  User.create({
    first_name: req.body.firstname,
    last_name: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
  });  
  email = req.body.email;
  // set the session to the user's session
  req.session.email = email;
  // redirect them back home
  res.redirect('/');
};

exports.post_login_handler = function(req, res) {
  user_email = req.body.email;
  user_password = req.body.password;
}


var get_user = function(user_email, callback) {
  // find the user in the database
  User.find({
    where:{email: user_email}
  }).success(function(user) {
    // if found, data is stored in 'user', and we then call our callback function
    if (callback && typeof(callback) === "function") {
      callback(user);
    }
  });
}