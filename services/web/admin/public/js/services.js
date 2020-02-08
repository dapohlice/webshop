function getOrders() {
  var url = '';
  var urlParamStatus = 0;
  urlParamStatus = getCurrentOrderFromParam(currentOrder);

  // $('#jsonTableObjekt').nextAll('div').remove();
  console.log("currentStatus: ");
  console.log(urlParamStatus);
  if(urlParamStatus == 0) {
    url = 'http://localhost:3001/order';
  } else if (urlParamStatus == 99) {
    url = 'http://localhost:3001/order/status/' + 1 + '.json';
  } else if (statusString != '' && (urlParamStatus == 4 || urlParamStatus == 6)) {
    url = 'http://localhost:3001/order/status/' + statusString;
  } else {
    url = 'http://localhost:3001/order/status/' + urlParamStatus + '.json';
  }
  var res = new XHR('GET', url);

  console.log("GetXHR Klasse wurde aufgerufen mit folgenden Objekt:");
  console.log(currentUrl);
}
function setNextStatus() {
  var url = '';
  var urlParamStatus = 0;
  urlParamStatus = getUrlVars()["id"];
  console.log("SetNextStatus, nimmt folgenden Status entgegen: ")
  console.log(urlParamStatus);

  if(urlParamStatus != null) {
    setNewStatus = true;
    url = 'http://localhost:3001/order/' + urlParamStatus;
  }

  var res = new XHR('PATCH', url);

  console.log("PatchXHR Klasse wurde aufgerufen mit folgenden Objekt:");
  console.log(res);
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
    if ((JSON.stringify(data) !== JSON.stringify([])) && callOrderDetails == false && setNewStatus == false) {
      console.log("Objekt in der Antwort ist nicht leer");
      renderOrderTableHTML(data);
    } else if (setNewStatus == true) {
      console.log("Neuen Status erfolgreich gesetzt");
      renderOrderTableHTML(data);
    } else if (callOrderDetails == true) {
      console.log("Rufe RenderOrderDetailsHTML auf");
      renderOrderDetailsHTML(data);
      renderOrderShippingAddressHTML(data);
      renderOrderStatusButtonHTML(data);
      renderOrderLogHTML(data);
      rendernextButtonHTML(data);
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
