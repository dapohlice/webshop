// FormData Funktion: input field werden vom Benutzer gefüllt
// Benötigt wird ein button zum senden der Informationen zum Server.
// Wichtig: button’s onclick method send().

// XHR POST to Server
function send () {
  var username = {
    value: document.getElementById('username').value
  }
  var xhr = new window.XMLHttpRequest()
  xhr.open('POST', 'localhost:3001/newuser/8', true)
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  xhr.send(JSON.stringify(username))
  xhr.
}
// Send

// Paramter aus Adresse entfernen:
// document.getElementById('newuser').click(function(event){
//   event.prefentDefault();
// }


// var request = new PRequest();
// request.GET('localhost:3001/order');
// request.onSucces(function(data,header){console.log(data,header)});
// request.setData({name: "name"});
// request.send(true);
//
// console.log("weiter");
