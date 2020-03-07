//Handler-Namespace definiert
const EHandler = {};

EHandler.StdHandler = {
  // Prüfe Fehlertyp und lese Fehler aus
   checkError: function (err) {
     if (err.name === 'MongoError' && err.code === 11000) {
       return {statuscode: 400,
               msg: 'Key is assigned!',
               at: Object.keys(err.keyValue)[0]};
     }
     else if (err.name === 'ValidationError') {
       return {statuscode: 400,
               msg: err._message};
     }
     else if(err.name === 'CastError') {
       return {statuscode: 400,
               msg: 'Wrong Input',
               at: err.path};
     }
     else if (err.name === 'NotFound') {
       return {statuscode: 404,
               msg: 'Document not Found!'};
     }
   }

}

module.exports = EHandler;
