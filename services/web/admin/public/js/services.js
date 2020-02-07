var currentStatus = 0;
var orderTableContainer = document.getElementById('jsonTableObjekt');
var orderDetailTableContainer = document.getElementById('jsonDetailTableObjekt');
var admincContainer = document.getElementById('adminc');
var btn = document.getElementById("btn");
var statusString = '';
var callOrderDetails = false;
let lastID = 0;

// getUrlVars() zum Abruf der Parameter
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
var currentUrl = getUrlVars();
var currentOrder = getUrlVars()["order"];

function getOrders() {
  var url = '';

  switch(currentOrder) {
    case 'ordered':
      currentStatus = 1;
      break;
    case 'payed':
      currentStatus = 2;
      break;
    case 'packed':
      currentStatus = 3;
      break;
    case 'finished':
      currentStatus = 4;
      statusString = "finished";
      break;
    case 'returned':
      currentStatus = 6;
      statusString = "returned";
      break;
    case 'all':
      currentStatus = 0;
      break;
    default:
      //für Startseite
      currentStatus = 99;
  }
  $('#jsonTableObjekt').nextAll('div').remove();
  console.log("currentStatus: ");
  console.log(currentStatus);
  if(currentStatus == 0) {
    url = 'http://localhost:3001/order';
  } else if (currentStatus == 99) {
    url = 'http://localhost:3001/order/status/' + 1 + '.json';
  } else if (statusString != '' && (currentStatus == 4 || currentStatus == 6)) {
    url = 'http://localhost:3001/order/status/' + statusString;
  } else {
    url = 'http://localhost:3001/order/status/' + currentStatus + '.json';
  }
  var res = new XHR('GET', url);

  console.log("GetXHR Klasse wurde aufgerufen mit folgenden Objekt:");
  console.log(currentUrl);
}
function getOrderDetails(id) {
  var url = '';
  console.log("getOrder ID for details: ");
  console.log(id);

  if(id != null) {
    callOrderDetails = true;
    url = 'http://localhost:3001/order/' + id;
  }
  var res = new XHR('GET', url);


  console.log("UrlParams: ");
  console.log(currentUrl);

}

function XHR(type, url) {
  promise = $.ajax({
    type: type,
    dataType: 'json',
    url: url,
    cache: false
    });
  promise.done(function (data, statusText) {
    console.log(statusText + " - " + data.status);
    console.log('Sucessfull data check');
    console.log('XHR liefert folgendes Ergebnis zurück:');
    console.log(data);
    if ((JSON.stringify(data) !== JSON.stringify([])) && (callOrderDetails == false)) {
      console.log("Objekt in der Antwort ist nicht leer");
      renderOrderTableHTML(data);
    } else if (callOrderDetails == true) {
      console.log("Rufe RenderOrderDetailsHTML auf");
      renderOrderDetailsHTML(data);
    } else {
      renderErrorTableHTML();
    }

  });
  promise.fail(function (xhr, statusText) {
    console.log(statusText + " - " + xhr.status);
    $('#adminc').empty();
    renderErrorHTML(xhr, statusText);
  });

}

function renderOrderTableHTML(data) {
  console.log("renderOrderTableHTML gestartet")
  var htmlString = "<table class=\"table table-striped\">";
  htmlString += "<thead><tr><th>ID</th><th>mail</th><th>timestamp</th>";
  if (currentStatus == 0) {
    htmlString += "<th>status</th>";
  }
  htmlString += "</tr></thead>";
  htmlString += "<tbody>";
  for(let i = 0; i < data.length; i++) {
    htmlString += "<tr>";
    htmlString += "<td class=\"id\"><span>" + data[i].id + "</span></td>";
    htmlString += "<td>" + data[i].mail + "</td>";
    htmlString += "<td>" + data[i].timestamp + "</td>";
    if (currentStatus == 0) {
      switch(data[i].status) {
        case 1:
          htmlString += "<td>ordered</td>";
          break;
        case 2:
          htmlString += "<td>payed</td>";
          break;
        case 3:
          htmlString += "<td>packed</td>";
          break;
        case 4:
          htmlString += "<td>finished</td>";
          break;
        case 5:
          htmlString += "<td>canceled</td>";
          break;
        case 6:
          htmlString += "<td>returned</td>";
          break;
        case 7:
          htmlString += "<td>return checked</td>";
          break;
        case 8:
          htmlString += "<td>return failed</td>";
          break;
        case 9:
          htmlString += "<td>payed back</td>";
          break;
        default:
          htmlString += "<td>no status set</td>";
      }
    }
    if (currentStatus != 99) {
      htmlString += "<td>" + "<button class=\"editOrderButton\" type=\"button\" data-tooltip=\"tooltip\" data-placement=\"bottom\" title=\"Edit this order\" data-toggle=\"modal\" data-target=\"#OrderDetailModal\">Edit</button></td>";
    }
    htmlString += "</tr>";
  }
  htmlString += "</tbody>";
  htmlString += "</table>"

  orderTableContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log("Ab jetzt wird helper Klasse aufgerufen...");
  helper();
}

function renderErrorHTML(xhr, statusText) {
  console.log('A failure occurred');
  var htmlString = "<div class=\"error-template\">";
  htmlString += "<h1>Oops!</h1>";
  htmlString += "<h2>" + xhr.status + " " + statusText + "</h2>";
  htmlString += "<div class=\"error-details\">Sorry, an error has occured, Requested page not found!</div>";
  htmlString += "<div class=\"error-actions\">";
  htmlString += "<a href=\"/\" class=\"btn btn-secondary btn-lg\">";
  htmlString += "<span class=\"glyphicon glyphicon-home\"></span>";
  htmlString += "Zurück zur Startseite";
  htmlString += "</a>";
  htmlString += "<a href=\"#\" class=\"btn btn-danger btn-lg\">";
  htmlString += "<span class=\"glyphicon glyphicon-home\"></span>";
  htmlString += " Contact Support ";
  htmlString += "</a>";
  htmlString += "</div>";

  htmlString += "</div>";
  admincContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log("Output: Error page");
}
function renderErrorTableHTML() {
  var htmlString = "<table class=\"table table-striped\">";
  htmlString += "<thead><tr><th>ID</th><th>mail</th><th>timestamp</th>";
  htmlString += "</tr></thead>";
  htmlString += "<tbody>";
  htmlString += "<td>No entries available! Try again later.</td>";
  htmlString += "</tr>";
  htmlString += "</tbody>";
  htmlString += "</table>"

  orderTableContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log("Keine Bestellungen gefunden");
}
function renderOrderDetailsHTML(data) {
  var htmlString = "<table class=\"table table-striped\">";
  var amountPrice = 0.00;
  var total = 0.00;
  htmlString += "<thead><tr><th>Name</th><th>Property</th><th>Amount</th><th>Price</th>";
  htmlString += "</tr></thead>";
  htmlString += "<tbody>";
  for(let i = 0; i < data.article.length; i++) {
    amountPrice = ((data.article[i].price)*(data.article[i].amount));
    htmlString += "<tr>";
    htmlString += "<td class=\"id\">" + data.article[i].name + "</td>";
    htmlString += "<td>" + data.article[i].property + "</td>";
    htmlString += "<td>" + data.article[i].amount + "</td>";
    htmlString += "<td>" + amountPrice + " €</td>";
    htmlString += "</tr>";
    total += amountPrice;
  }
  htmlString += "<tr class=\"orderTotal\">";
  htmlString += "<td></td>";
  htmlString += "<td></td>";
  htmlString += "<td></td>";
  htmlString += "<td><span class=\"double_underline\">" + total + " €</td>";
  htmlString += "</tr>";

  htmlString += "</tbody>";
  htmlString += "</table>"

  orderDetailTableContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log("Tabelle mit Bestelldetails erstellt für ID:");
  lastID = data.id;
  console.log(lastID);
}

//********* NOCH IN ARBEIT *********

// $.ajax({
//   type: “GET”,
//   dataType: “json”,
//   url: “/server/tasks.json”, cache: false,
//   success: function(data) {
//   console.log(data); }
// });

// $.getJSON(“/server/tasks.json”, function (data) {
//   console.log(data);
// });
// das selbe mit promise:
// promise = $.ajax({
//   type: “GET”,
//   url: “/server/tasks.json”, cache: false
//   });
// promise.done(function (data) {
//   console.log(data); });
// promise.fail(function () {
//   console.log(‘A failure occurred’);
// });


// Das kann sinnvoll sein, wenn Sie mehrere AJAX-Calls ausführen, die Daten aggregieren und das DOM aktualisieren möchten:
// promise1 = $.ajax({
//   url: “/server/tasks.json”
// });
// promise2 = $.ajax({
//   url: “/server/tasks.json” });
//
// $.when(promise1, promise2).done(function (data1, data2) {
//   console.log(data1[0]);
//   console.log(data2[0]);
//   console.log(“Both requests have completed”);
// });


// Das Besondere an den Promises ist, dass Sie sie auch selbst in Ihren eige- nen APIs nutzen können. Nehmen wir eine Funktion, auf die das oben beschriebene Szenario zutrifft:
// cachedTasks = function () {
//   var tasks = null;
//   return {
//     getTasks: function () {
//       var deferred = $.Deferred();
//       if (tasks) {
//         deferred.resolve(tasks);
//         return deferred.promise();
//       } else {
//           var promise1 = $.ajax({
//           url: “/server/tasks.json”
//           });
//         promise1.done(function (data) {
//           tasks = data; setTimeout(function () {
//             deferred.resolve(tasks) }, 5000);
//         });
//
//         return deferred.promise();
//         }
//       }
//     }
// }();


// Wie bei den AJAX-Anfragen fügen wir dem von getTasks zurückgelieferten Promise ein Callback hinzu:
// promise = cachedTasks.getTasks(); promise.done(function (data) {
//   console.log(‘I have finished’); });

// Wenn Sie den Code durchgehen, erkennen Sie, dass das Promise bereits »fulfilled« ist, wenn wir unser Callback mit der Methode done hinzufügen. Deshalb wird dieses sofort ausgeführt. Sogar noch nach der Ausführung des Callback können wir dem Promise ein zweites Callback hinzufügen:
// promise.done(function (data) {
//   console.log(‘I have finished again’);
// });


// Nachfolgend ein Beispiel für eine Funktion, die ein task-Objekt an den Server übermittelt und ein Promise zurückliefert:
// function sendTask(task) {
//   return $.ajax({
//     type: “POST”,
//     url: “/submittask”,
//     contentType: “application/json”,
//     data: JSON.stringify(task)
//   });
  // Dieser Code lässt sich mit einer der jQuery-Kurzmethoden noch deutlich vereinfachen:
  // return $.post(»/submittask«, task);
// }
