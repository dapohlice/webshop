//Handler-Namespace definiert
const EHandler = {};

function ReturnObject(status, msg, place) {
  this.statuscode = status;
  this.msg = msg;
  this.place = place;
}

EHandler.StdHandler = {
  // Prüfe Fehlertyp und lese Fehler aus
   checkError: function (err) {
     //console.error(err);
     //Hier werden Fehler von der Datenbank bearbeitet
     if (err.name === 'MongoError' && err.code === 11000) {
       return new ReturnObject(400, 'Key is assigned!', Object.keys(err.keyValue)[0]);
     }
     else if (err.name === 'ValidationError') {
       return new ReturnObject(400, err._message, 'Different Places.')
     }
     else if(err.name === 'CastError') {
       return new ReturnObject(400, 'Wrong Input!', err.path)
     }
     // Ab hier werden selbst definierte Fehler bearbeitet
     else if (err.name === 'NotFoundError') {
       return new ReturnObject(404, err.msg, err.searched);
     }
     else if (err.name === 'WrongTypeError') {
       return new ReturnObject(400, err.msg, err.at)
     }
   }
}
module.exports = EHandler;
