function getOrders() {
  var url = '';
  var urlParamStatus = 0;
  urlParamStatus = getCurrentOrderFromParam(currentOrder);
  $('#jsonTableObjekt').children('table').eq(0).remove();
  setNewStatus = false;

  // $('#jsonTableObjekt').nextAll('div').remove();
  console.log("currentStatus: ");
  console.log(urlParamStatus);
  if(urlParamStatus == 0) {
    url = 'http://localhost:3001/order';
  } else if (urlParamStatus == 99) {
    url = 'http://localhost:3001/order/status/' + 1;
  } else if (statusString != '' && (urlParamStatus == 4 || urlParamStatus == 6)) {
    url = 'http://localhost:3001/order/status/' + statusString;
  } else {
    url = 'http://localhost:3001/order/status/' + urlParamStatus;
  }
  getOrderReq = true;
  var res = new XHR('GET', url);

  console.log("GetXHR Klasse wurde aufgerufen mit folgenden Objekt:");
  console.log(currentUrl);
}
function getCategories() {
  var url = '';

  $('#jsonTableCategoryObjekt').children('table').eq(0).remove();

  if(url == '') {
    url = 'http://localhost:3002/category';
    var res = new XHR('GET', url);
    getCategoryReq = true;
    console.log("GetXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(url);
  }

}
function createCategory() {

  // Get some values from elements on the page:
  var term = $('#categoryname').val();
  var term2 = $('#categorypicture').val();

  console.log(term);
  console.log(term2);
  var url = '';

  $('#jsonTableCategoryObjekt').children('table').eq(0).remove();

  // Create an empty JSON object to return.
  var retJson = {};
  retJson.categoryname = term;
  retJson.picturepath = term2;


  if( (term != '') && (term2 != '') ) {
    //todo: bei method: Post wird im request über ajax Json im Body nicht entgegen genommen

    // var nojson = JSON.stringify({ "categoryname" : term, "picturepath" : term2 });
    // console.log(nojson);
    // // let data = JSON.parse(nojson);
    // var data = JSON.stringify(trimdata);
    console.log(retJson);
    // console.log(JSON.stringify(retJson));

    url = 'http://localhost:3002/category';
    var res = new XHR('POST', url, retJson);

    createCategoryReq = true;
    console.log("POSTXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(url);
  }

}
function setNextStatus() {
  var url = '';
  var urlParamID = 0;
  var status = 0;
  urlParamID = lastID;
  status = lastStatus;

  if((urlParamID != null) && (status < 4) && (status != 0)) {
    setNewStatus = true;
    callOrderDetails = false;
    console.log("SetNextStatus() setzt die folgende ID: ");
    console.log(urlParamID);
    console.log("auf den nächsten Status: ");
    console.log(status);

    url = 'http://localhost:3001/order/' + urlParamID;
    var res = new XHR('PATCH', url);
    //setze lastID = 0 & lastStatus (Standartwert), sonst werden die OrderDetails nicht neu geladen!
    lastID = 0;
    lastStatus = 0;
    return true;
  } else {
    console.log("Statusänderung nicht erlaubt!")

    //show info status
    showStatusInfo("Statusänderung für ID = " + urlParamID + " nicht erlaubt!");
    //end of show info status
    return false;
  }


  console.log("PatchXHR Klasse wurde aufgerufen mit folgenden Objekt:");
  console.log(res);
}
function getOrderDetails(id) {
  var url = '';
  console.log("getOrder ID for details: ");
  console.log(id);

  if(id != null) {
    callOrderDetails = true;
    setNewStatus = false;
    url = 'http://localhost:3001/order/' + id;
  }
  var res = new XHR('GET', url);


  console.log("UrlParams: ");
  console.log(currentUrl);

}
function getCategoryDetails(id) {
  var url = '';
  console.log("getCategory ID for details: ");
  console.log(id);

  if(id != null) {
    renderCategoryDetailsHTML(id);
    // callCategoryDetails = true;
    // url = 'http://localhost:3002/category/' + id;
  }
  // var res = new XHR('GET', url);


  console.log("UrlParams: ");
  console.log(currentUrl);

}

function XHR(type, url, data) {
  promise = $.ajax({
    type: type,
    url: url,
    cache: false
  });
  promise.done(function (data, statusText) {
    console.log(statusText + " - " + data.status);
    console.log('Sucessfull data check');
    console.log('XHR liefert folgendes Ergebnis zurück:');
    console.log(data);
    if ((JSON.stringify(data) !== JSON.stringify([])) && getOrderReq == true) {
      console.log("Objekt in der Antwort ist nicht leer");
      renderOrderTableHTML(data);
      getOrderReq = false;
    } else if (setNewStatus == true) {
      $('#OrderDetailModal').modal('hide');
      //show info status
      showStatusInfo("Status wurde erfolgreich geändert!");
      //end of show info status
      getOrders();
    } else if (getCategoryReq == true) {
      renderCategoryTableHTML(data);
      getCategoryReq = false;
    } else if (callOrderDetails == true) {
      console.log("Rufe RenderOrderDetailsHTML auf");
      renderOrderDetailsHTML(data);
      renderOrderShippingAddressHTML(data);
      renderOrderStatusButtonHTML(data);
      renderOrderLogHTML(data);
      rendernextButtonHTML(data);
    } else if (createCategoryReq == true) {
      getCategories();
      createCategoryReq = false;
    } else {
      renderErrorTableHTML();
    }

  });
  // promise.statusCode(function (dataType) {
  //   console.log("ResponseText");
  //   console.log(dataType);
  //   if (setNewStatus == true) {
  //     getOrders();
  //   }
  // });
  promise.fail(function (xhr, statusText, errorThrown) {
    console.log(statusText + " - " + xhr.status);
    $('#adminc').empty();
    renderErrorHTML(xhr, statusText);
    return false;
  });

}



//********* NOCH IN ARBEIT *********

// $.ajax({
//   type: “GET”,
//   dataType: “json”,
//   url: “/server/tasks.json”, cache: false,
//   success: function(data) {
//   console.log('data'); }
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
