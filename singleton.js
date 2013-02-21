/*
* Requiring:
* s - the database instance
* dg - the daily goal model
* wg - the weekly goal model
* mg - the monthly goal model
* og - the overall goal model
* u - the user model
*/

var s = require('./seq')
  , dg = require('./models/daily_goal.js')      
  , wg = require('./models/weekly_goal.js')
  , mg = require('./models/monthly_goal.js')
  , og = require('./models/overall_goal.js')
  , u = require('./models/user.js');

// Defining relationships between the models.
wg.WeeklyGoal.hasMany(dg.DailyGoal);
mg.MonthlyGoal.hasMany(wg.WeeklyGoal);
og.OverallGoal.hasMany(mg.MonthlyGoal);
u.User.hasMany(og.OverallGoal);


// Sync the database.
s.sequelize.sync();