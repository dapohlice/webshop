// FormData Funktion: input field werden vom Benutzer gefüllt
// Benötigt wird ein button zum senden der Informationen zum Server.
// Wichtig: button’s onclick method send().

// Paramter aus Adresse entfernen:
// document.getElementById('newuser').onclick(function(event){
//   event.prefentDefault();
// })

//URL's
// Get
const allCreatedOrders = 'http://localhost:3001/order/status/0';

// function getOrderStatus() {
//   document.getElementById('test').innerText = "Yes. Onload Function started";
//
//   var res = new XHR('GET',allCreatedOrders);
//   console.log(typeof res)
//
//   document.getElementById('jsonobjekt').innerHTML =
//   // $.each( json, function( key, value ) {
//   //   document.getElementById('jsonobjekt').innerText = key + ": " + value + "<br>";
//   // });
//     res.id + "<br>" +
//     res.mail + "<br>" +
//     res.timestamp + "<br>";
//
// }


function getOrderStatus() {
  document.getElementById('test').innerText = "Yes. Onload Function started";

  var request = new PRequest();
  request.GET('http://localhost:3001/order/status/0');
  request.onSucces(function(data,header){console.log(data,header)});
  request.addData({name: "name"});
  request.send(true);

//this try end in an SyntaxError: Unexpected token o in JSON at position 1:
  // var obj = JSON.parse(request);
  // document.getElementById('jsonobjekt').innerHTML=obj[0].id[1];

  document.getElementById('jsonobjekt').innerHTML =
  //request.id gibt mir ein error zurück:
      request.id + "<br>" +
      //oder so ebenso:
      request['mail'] + "<br>" +
      request['timestamp'] + "<br>";

  console.log("weiter");
}
