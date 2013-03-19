var Sequelize = require('sequelize'),
    sequelize = new Sequelize ('meliorate_db', 'richardtai', null, {
      dialect: 'postgres',
      // When connecting to the database, psql uses 'local socket' as the default
      // method of connecting, while sequelize uses 'host'. Therefore, specify this 
      // instance of seqeulize to use the 'local socket'.
      socket: 'local socket',
      port: '5432'
});

/*
* Temporarily define the models here so that I can reference them and add them to the database.
* I'll figure out how to organize this neatly after.
*/
var User = sequelize.define('Users', {
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING
});

var OverallGoal = sequelize.define('OverallGoal', {
  description: Sequelize.STRING,
  isCompleted: Sequelize.BOOLEAN
});

User.hasMany(OverallGoal);

// Global variables

var user, overall_goal, mn_bool, og_bool;

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
      user = curr_user;
      mn_bool = false;
      og_bool = false;
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

/*
* Add a new overall goal
*/

exports.new_overall_goal = function(req, res) {
  res.render('new_overall_goal', {title: "Meliorate"});
}

exports.post_overall_goal_handler = function(req, res) {
  console.log("OG-Bool: " + og_bool);
  console.log("MN-Bool: "+ mn_bool);

  // post handler for adding an overall goal
  // if og_bool is false, that means we have not set an overall goal yet
  if((mn_bool == false) && (og_bool == false)) {
    //set overall goal to true
    og_bool = true;
    console.log("Adding overall goal.");
    // create the overall goal that the user input 
    OverallGoal.create({
      description: req.body.overall_goal_description,
      isCompleted: false,
      // upon success, add the overall goal to the user
    }).success(function(og_goal){
      user.addOverallGoal(og_goal).success(function() {
        overall_goal = og_goal;
        res.render('new_monthly_goal', {title: "Meliorate", months_needed_bool: mn_bool});
      }); // corresponds to the adding OverallGoal's success function
    }); // corresopnds to OverallGoal's success function
  }

  //post handler for determining how many months are needed to achieve the overall goal
  else if((mn_bool == false) && (og_bool == true)) {
    num_months = parseInt(req.body.months_needed);
    console.log(num_months);
    mn_bool = true;
    res.render('new_monthly_goal', {title: "Meliorate", months_needed_bool: mn_bool, num_months: num_months});
  }

  else if((mn_bool == true) && (og_bool == true)) {
    
  }
}

/*
* Add new monthly goals
*/
/*
exports.new_monthly_goal = function(req, res) {
  res.render('new_overall_goal', {title: "Meliorate"});
}

exports.post_new_monthly_goal_handler = function(req, res) {
  if(months_needed == false) {
    months_needed = true;
    num_months = req.body.months_needed;
    console.log(months_needed);
    console.log(req.body);
    res.render('new_monthly_goal', {title: "Meliorate", months_needed_bool: months_needed, num_months: num_months});
  }
}*/