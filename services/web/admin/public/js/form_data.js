// FormData Funktion: input field werden vom Benutzer gefüllt
// Benötigt wird ein button zum senden der Informationen zum Server.
// Wichtig: button’s onclick method send().

// Paramter aus Adresse entfernen:
// document.getElementById('newuser').onclick(function(event){
//   event.prefentDefault();
// })

//URL's
// Get
const allCreatedOrders = 'http://localhost:3001/order/status/1';

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
  request.GET('http://localhost:3001/order/status/1');
  request.onSucces(function(data,header){
      // DIe Daten musst du in dieser Funktion bearbeiten
      // Desweiteren bekommst du eine Liste zurück, das heißt du musst diese Array auch durchgehen um an alle Daten zu kommen

      // Außerdem wäre es nice, wenn du für die Entwicklung bootstrap normal einbinden könntest, weil im Zug habe ich kaum Internet und kann dann nichts testen.
    
    let table = "<table>"  
    
      for(let i = 0; i < data.length; i++)
      {
          table+="<tr>";
          table+="<td>"+request[i].id + "</td>";
          table+="<td>"+request[i].mail + "</td>";
          table+="<td>"+request[i].timestamp + "</td>";
          table+="</tr>"
      }
      table+="</table>"
      document.getElementById('jsonobjekt').innerHTML =table;

  });
  request.addData({name: "name"});
  request.send(true);


  // Die Daten gibt es hier untern nicht
  
}
