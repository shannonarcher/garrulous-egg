const mongoose = require('mongoose');

module.exports = {
  connect() {
    const db = {
      ip: process.env.GEDB_IP,
      name: process.env.GEDB_NAME,
      user: process.env.GEDB_USER,
      pwd: process.env.GEDB_PWD,
      port: 27017,
    };

    return mongoose.connect(`mongodb://${db.user}:${db.pwd}@${db.ip}:${db.port}/${db.name}`, {
      useNewUrlParser: true,
    });
  },
  close() {
    mongoose.connection.close();
  },
};
