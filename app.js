
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
 
var app = express();

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

sequelize.sync();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

app.post('/', routes.post_handler);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
