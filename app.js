
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , singleton = require('./singleton.js');
 
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 8080);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  // included because the ninja-store example had it
  // also because this is what allows the req.session.email
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/new_overall_goal', routes.new_overall_goal);
app.get('/home', routes.home);
app.get('/home/:id?', routes.home);
app.get('/monthly_goal/:id?', routes.monthly_goal);
app.get('/weekly_goal/:id?', routes.weekly_goal);

app.post('/', routes.post_handler);
app.post('/login', routes.post_login_handler);
app.post('/new_overall_goal', routes.post_overall_goal_handler);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
