const Mongoose = require('mongoose');

const server = "mongodb://product_db:27017/product";
/* Singleton Datenbankverbindungsobjekt -> neuere Klassensyntax*/
class DBConnection
{
  constructor()
  {
      this.connect();
  }

  connect()
  {
    try
    {
      /*Verbindung zur Datenbank erstellen*/
      Mongoose.connect(server,{user: "testuser",
                               pass: "12test34",
                               useNewUrlParser: true,
                               useUnifiedTopology: true,
                               useFindAndModify: false});
    }
    catch (err)
    {
      throw err;
    }
  }
}
module.exports = DBConnection
