/*Eine Sammlung an Fehlerobjekten für selbst definierte Exceptions*/

//Exception für das fehlen einer Ressource
function NotFoundError(msg, searched) {
  this.name = 'NotFoundError';
  this.msg  = msg;
  this.searched = searched;
}

// Exception für das eingeben eines Falschen Datentypes
function WrongTypeError(msg, at) {
  this.name = "WrongTypeError";
  this.msg  = msg;
  this.at   = at;
}

exports.NotFoundError = NotFoundError;
exports.WrongTypeError = WrongTypeError;
