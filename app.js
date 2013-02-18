
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
  //, pg = require('pg')
  // specify the connection path for pg
  //, conString = "tcp://richardtai:5342@localhost/meliorate_db";

//var client = new pg.Client(conString);
//client.connect();

//create the projects table
//client.query("CREATE TABLE IF NOT EXISTS Users (name VARCHAR(255), password VARCHAR(255), overall_goals TEXT, id   SERIAL , createdAt TIMESTAMP NOT NULL, updatedAt TIMESTAMP NOT NULL, PRIMARY KEY (id));");

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
  name: Sequelize.STRING,
  password: Sequelize.STRING
});

sequelize.sync();

function test() {
  console.log("Yay!");
}

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
//app.get('/test', test.foobar);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
