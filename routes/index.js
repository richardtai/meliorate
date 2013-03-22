var Sequelize = require('sequelize'),
    sequelize = new Sequelize ('meliorate_db', 'postgres', 'postgres', {
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
  password: Sequelize.STRING,
  new_user: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  }
});

var OverallGoal = sequelize.define('OverallGoal', {
  description: Sequelize.STRING,
  isCompleted: Sequelize.BOOLEAN
});

var MonthlyGoal = sequelize.define('MonthlyGoal', {
  description: Sequelize.STRING,
  isCompleted: Sequelize.BOOLEAN
});

var WeeklyGoal = sequelize.define('WeeklyGoal', {
  description: Sequelize.STRING,
  isCompleted: Sequelize.BOOLEAN
});

var DailyGoal = sequelize.define('DailyGoal', {
  description: Sequelize.STRING,
  isCompleted: Sequelize.BOOLEAN
});

// Globals

User.hasMany(OverallGoal);
OverallGoal.hasMany(MonthlyGoal);
MonthlyGoal.hasMany(WeeklyGoal);
WeeklyGoal.hasMany(DailyGoal);

var user, overall_goal, monthly_goal, weekly_goal, mn_bool, og_bool, wg_bool, db_bool, num_months, first_month_id;

var mg_test_arr = [];
var wg_test_arr = [];
var dg_test_arr = [];


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
      reset_bool();
      user = curr_user;
      if (user.new_user == true) {
        res.render('home', {title: "Meliorate", user: curr_user});
      }
      else if (user.new_user == false) {
        user.getOverallGoals().success(function(og_array){
          res.render('home', {title: "Meliorate", user: curr_user, og_array: og_array});
        });
      }
    });
  }
};

exports.home = function(req, res) {
  overall_goal_id = req.params.id;
  find_overall_goal(overall_goal_id, function(og_goal) {
    og_goal.getMonthlyGoals({order:  'id ASC'}).success(function(mg_goal_array) {
      res.render('monthly_goal', {title: "Meliorate", user: user, mg_array: mg_goal_array});
    });
  });
}

exports.monthly_goal = function(req, res) {
  month_id = req.params.id;
  find_first_monthly_goal(month_id, function(mg_goal) {
    mg_goal.getWeeklyGoals({order:'id ASC'}).success(function(wg_goal_array) {
      res.render('weekly_goal', {title: "Meliorate", user:user, wg_array: wg_goal_array});
    });
  });
}

exports.weekly_goal = function(req, res) {
  week_id = req.params.id;
  find_first_weekly_goal(week_id, function(wg_goal) {
    wg_goal.getDailyGoals({order: 'id ASC'}).success(function(dg_goal_array) {
      res.render('daily_goal', {title: "Meliorate", user: user, dg_array: dg_goal_array});
    });
  });
}

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

/*
* Add a new overall goal
*/

exports.new_overall_goal = function(req, res) {
  res.render('new_overall_goal', {title: "Meliorate"});
}

exports.post_overall_goal_handler = function(req, res) {

  // post handler for adding an overall goal
  // if og_bool is false, that means we have not set an overall goal yet
  if((mn_bool == false) && (og_bool == false) && (wg_bool == false)) {
    //set overall goal to true
    og_bool = true;
    // create the overall goal that the user input 
    OverallGoal.create({
      description: req.body.overall_goal_description,
      isCompleted: false
      // upon success, add the overall goal to the user
    }).success(function(og_goal){
      user.addOverallGoal(og_goal).success(function() {
        overall_goal = og_goal;
        res.render('new_monthly_goal', {title: "Meliorate", months_needed_bool: mn_bool});
      }); // corresponds to the adding OverallGoal's success function
    }); // corresopnds to OverallGoal's success function
  }

  // post handler for determining how many months are needed to achieve the overall goal
  else if((mn_bool == false) && (og_bool == true) && (wg_bool == false) && (dg_bool == false)) {
    // need to change to int, or else you take the string value which is not what we want
    num_months = parseInt(req.body.months_needed);
    // set the mn_bool to true to signify that the user has specified how many months the goal should take to achieve
    mn_bool = true;
    res.render('new_monthly_goal', {title: "Meliorate", months_needed_bool: mn_bool, num_months: num_months});
  }

  // post handler for storing the monthly goals
  else if((mn_bool == true) && (og_bool == true) && (wg_bool == false) && (dg_bool == false)) {
    // add the monthly goals the user specified to the database
    add_monthly_goals(req.body, function() {
      associate_monthly_goals(mg_test_arr, function() {
        // set weekly goal boolean true for the post handler
        wg_bool = true;
        res.render('new_weekly_goal', {title: "Meliorate", fmg_goal: monthly_goal.id});
      });
    });
  }

  // post handler for storing weekly goals
  else if((mn_bool == true) && (og_bool == true) && (wg_bool == true) && (dg_bool == false)) {
    add_weekly_goals(req.body, function() {
      associate_weekly_goals(wg_test_arr, function() {
        dg_bool = true;
        res.render('new_daily_goal', {title: "Meliorate", fwg_goal: weekly_goal});
      });
    });
  }

  // post handler for storing daily goals
  else if((mn_bool == true) && (og_bool == true) && (wg_bool == true) && (dg_bool == true)) {
    add_daily_goals(req.body, function() {
      associate_daily_goals(dg_test_arr, function() {
        user.new_user = 'false';
        user.save().success(function(){
          res.redirect('/');
        ;});
      });
    });
  }

}

// decomp'd functions

var reset_bool = function() {
    mn_bool = false;
    og_bool = false;
    wg_bool = false;
    dg_bool = false;
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

var find_overall_goal = function(og_id, callback) {
  OverallGoal.find({
    where: {id: og_id}
  }).success(function(og_goal) {
    callback(og_goal);
  });
}

// add the monthly goals the user specifies to the database
var add_monthly_goals = function(mg_data, callback) {
  // set the first month bool to true, when we have the data, we set it to false
  first_month_bool = true;
  // loop through the keys in the data
  var counter = 0;
  for (key in mg_data) {
    // create the monthly goal
    MonthlyGoal.create({
      description: mg_data[key],
      isCompleted: false
      // upon success, associate it to the overall goal
    }).success(function(mg_goal) {
      counter++;
      mg_test_arr.push(mg_goal);
      if(counter == num_months) {
        callback();
      }
    }); // success
  } // for
}

// associates the monthly goals to the overall goal
var associate_monthly_goals = function(monthly_array, callback) {
  bool = true;
  overall_goal.setMonthlyGoals(monthly_array).success(function() {
    monthly_goal = monthly_array[0];
    callback();
  });
}


// finds the first monthly goal to display to a new user (part of the tutorial)
var find_first_monthly_goal = function(month_id, callback) {
  MonthlyGoal.find({
    where: {id: month_id}
  }).success(function(fmg_goal) {
    callback(fmg_goal);
  });
}

// adds the weekly goals to the database
var add_weekly_goals = function(wg_data, callback) {
  first_week_bool = true;
  counter = 0;
  num_weeks = 4;
  for (key in wg_data) {
    WeeklyGoal.create({
      description: wg_data[key],
      isCompleted: false
    }).success(function(wg_goal){
      counter++;
      wg_test_arr.push(wg_goal);
      if(counter == num_weeks) {
        callback();
      }
    });
  }
}

// associates the weekly goals to the monthly goal
var associate_weekly_goals = function(weekly_array, callback) {
  monthly_goal.setWeeklyGoals(weekly_array).success(function() {
    weekly_goal = weekly_array[0];
    callback()
  })
}

// finds the first weekly goal
var find_first_weekly_goal = function(week_id, callback) {
  WeeklyGoal.find({
    where: {id: week_id}
  }).success(function(fwg_goal) {
    callback(fwg_goal);
  });
}

// adds the daily goals to the database
var add_daily_goals = function(dg_data, callback) {
  counter = 0;
  num_days = 7;
  for(key in dg_data) {
    DailyGoal.create({
      description: dg_data[key],
      isCompleted: false
    }).success(function(dg_goal){
      counter++;
      dg_test_arr.push(dg_goal);
      if(counter == num_days) {
        callback();
      }
    });
  }
}

// associates the daily goals to the respective weekly goal
var associate_daily_goals = function(daily_array, callback) {
  weekly_goal.setDailyGoals(daily_array).success(function() {
    callback();
  })
}
