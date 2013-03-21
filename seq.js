// Initialize a sequelize database that we will use through the application.
var Sequelize = require('sequelize'),
    sequelize = new Sequelize ('meliorate_db', 'postgres', 'postgres', {
      dialect: 'postgres',
      // When connecting to the database, psql uses 'local socket' as the default
      // method of connecting, while sequelize uses 'host'. Therefore, specify this 
      // instance of seqeulize to use the 'local socket'.
      socket: 'local socket',
      port: '5432'
});

// Export the sequelize and Sequelize instances we created.
exports.sequelize = sequelize;
exports.Sequelize = Sequelize;