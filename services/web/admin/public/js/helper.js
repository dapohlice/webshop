// Rufe alle Container auf um dynamisch den Inhalt derer zu ändern:
var btn = document.getElementById("btn");
var orderTableContainer = document.getElementById('jsonTableObjekt');
var orderDetailTableContainer = document.getElementById('jsonDetailTableObjekt');
var orderShippingAddressTableContainer = document.getElementById('jsonAddressTableObjekt');
var modalTitelContainer = document.getElementById('modalDetailTitel');
var modalTitelLogContainer = document.getElementById('modalDetailLogTitel');
var modalTitelChangeContainer = document.getElementById('modalChangeOrderTitel');
var orderStatusButtonContainer = document.getElementById('curStatusButton');
var orderNextButtonContainer = document.getElementById('nextStatusButton');
var orderLogContainer = document.getElementById('orderLogContent');
var admincContainer = document.getElementById('adminc');
//  Helfer-Variablen, um den aktuellen Status zu speichern
var callOrderDetails = false;
var setNewStatus = false;
let lastID = 0;
let curLog = 0;

// Alle Aufrufe
function helper() {
  $(".editOrderButton").click(function() {
    console.log("click editOrderButton");       // Prints out test text
    var id = $(this).closest("tr").find(".id").text();
    console.log(id);
    if (lastID == id) {
      console.log("Keine Neuzuweisung, da lastID = id")

    } else {
      console.log("Neuzuweisung auf: lastId = id")
      $('#jsonDetailTableObjekt').children('table').eq(0).remove();
      $('#jsonAddressTableObjekt').children('table').eq(0).remove();
      $('#curStatusButton').children('button').eq(0).remove();
      $('#modalDetailTitel').children('span').eq(0).remove();
      $('#modalDetailLogTitel').children('span').eq(0).remove();
      $('#modalChangeOrderTitel').children('span').eq(0).remove();
      $('#nextStatusButton').children('button').eq(0).remove();
      $('#orderLogContent').children('table').eq(0).remove();
      clearParam();
      getOrderDetails(id);
    }
    // callOrderDetails = false;
  });
}
  // Set Name of Dropdown-Button's
  // ToDo! :Funktionert nach dem laden der Orderseite noch nicht.
  // Name von DropDown Button value eventuell im Cache zwischenspeichern
  $(".dropdown-menu li a").click(function(){
    var currentButton = $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
    sessionStorage.setItem("loadStore", "currentButton");

      //
      // var selected = localStorage.getItem($(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>'));
      // if (selected) {
      //   $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
      // }
      //
      //
      // $(this).parents(".dropdown").find('.btn').val($(this).data('value').change(function() {
      //   localStorage.setItem('selected', $(this).val());
      //   location.reload();
      // });

  });

// When the user clicks the button...
localStorage.setItem('no_display', 'true');

// When a user visits the page...
var no_display = localStorage.getItem('no_display');
if (no_display !== 'true') {
  display_the_modal();
}

function setStatusOnButton() {
  var currentPage = getUrlVars()["order"];
  console.log("setStatusOnButton FKT loaded:")
  switch(currentPage) {
    case 'ordered':
      $(this).parents(".dropdown").find('#statusbtn').html($(this).text() + ' <span class="caret"></span>');
      $(this).parents(".dropdown").find('#statusbtn').val($(this).text('Test1'));
      // $(this).parents(".dropdown").find('btn').val($(this).data('Test1'));
      $("#statusbtn").val("United State");
      console.log("case load 1")
      break;
    case 'payed':
      $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
      $(this).parents(".dropdown").find('.btn').val($(this).text('Test1'));
      break;
    case 3:
      $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
      $(this).parents(".dropdown").find('.btn').val($(this).text('Test1'));
      break;
    case 4:
      $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
      $(this).parents(".dropdown").find('.btn').val($(this).text('Test1'));
      break;
    default:
      $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
      $(this).parents(".dropdown").find('.btn').val($(this).text('Test1'));
  }
}

// Holt den aktuellen Parameter aus der Browser-Addresszeile
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
var currentID = getUrlVars()["id"];
var currentStatus = 0;
var statusString = '';

//speichere ID von Order-Detail Response in parameter in addresszeile
function addParam(curID, curOrder, status){
	history.pushState({id: curID}, "orderid", "?order=" + curOrder + "&id=" + curID + "&status=" + status);
}
//setze ADressverlauf zurück
function clearParam(){
	history.pushState({}, "");
}

//show info status
function showStatusInfo(content){
  var info = document.getElementById('status');
  info.innerHTML = content;
  info.className = "show";
  setTimeout(function(){ info.className = info.className.replace("show", ""); }, 3000);
}

// Wandelt den String Parameter aus der Browser-Addresszeile in eine numerische Zahl um
function getCurrentOrderFromParam(string) {
  var currentOrderInt = 0;
  switch(string) {
    case 'ordered':
      currentOrderInt = 1;
      break;
    case 'payed':
      currentOrderInt = 2;
      break;
    case 'packed':
      currentOrderInt = 3;
      break;
    case 'finished':
      currentOrderInt = 4;
      statusString = "finished";
      break;
    case 'returned':
      currentOrderInt = 6;
      statusString = "returned";
      break;
    case 'all':
      currentOrderInt = 0;
      break;
    default:
      //für Startseite
      currentOrderInt = 99;
  }
  currentStatus = currentOrderInt;
  return currentOrderInt;
}

// Alle Render HTML Funktionen:
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
      htmlString += "<td>";
      htmlString += getStatus(data[i].status);
      htmlString += "</td>";
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
  htmlString += "<tr>";
  htmlString += "<td>No entries available! Try again later.</td>";
  htmlString += "</tr>";
  htmlString += "</tbody>";
  htmlString += "</table>"

  orderTableContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log("Keine Bestellungen gefunden");
}
function renderOrderDetailsHTML(data) {
  lastID = data.id;
  status = data.status;
  orderParam = getStatus(data.status);
  var modalTitelString = "<span>Order Details - ID: " + lastID + "</span>";
  modalTitelContainer.insertAdjacentHTML('beforeend', modalTitelString);
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
  console.log(lastID);
  //Setze den aktuellen Status in die Params in die Addresszeile
  addParam(lastID, orderParam, status);
}

function renderOrderShippingAddressHTML(data) {
  var htmlString = "<table class=\"table\">";
  // htmlString += "<thead><tr><th></th>";
  // htmlString += "</tr></thead>";
  htmlString += "<tbody>";

  htmlString += "<tr><td>" + data.address.firstname + " " + data.address.lastname + "<br/>";
  htmlString += data.address.street + " " + data.address.streetnumber + "<br/>";
  htmlString += data.address.plz + " " + data.address.town + "<br/>";
  if (data.address.state != null) {
    htmlString += data.address.state;
  }
  if (data.address.country != null) {
    htmlString += data.address.country;
  }
  htmlString += "</td></tr>";


  htmlString += "</tbody>";
  htmlString += "</table>"

  orderShippingAddressTableContainer.insertAdjacentHTML('beforeend', htmlString);
}

function renderOrderStatusButtonHTML(data) {
  var htmlString = "<button class=\"btn btn-secondary disabled\" type=\"button\" data-tooltip=\"tooltip\" data-placement=\"top\" title=\"Current Status\">";
  htmlString += getStatus(data.status);
  htmlString += "</button>";

  orderStatusButtonContainer.insertAdjacentHTML('beforeend', htmlString);
}

function rendernextButtonHTML(data) {
  lastID = data.id;
  var modalTitelString = "<span>Change Order Status for ID: " + lastID + "</span>";
  modalTitelChangeContainer.insertAdjacentHTML('beforeend', modalTitelString);

  var nextStatus = (data.status + 1);
  var htmlString = "<button class=\"btn btn-warning disabled\" type=\"button\" data-tooltip=\"tooltip\" data-placement=\"bottom\" title=\"Next Status\">";
  htmlString += getStatus(nextStatus);
  htmlString += "</button>";

  orderNextButtonContainer.insertAdjacentHTML('beforeend', htmlString);
}

function renderOrderLogHTML(data) {
  lastID = data.id;
  var modalTitelString = "<span>Order Logs for ID: " + lastID + "</span>";
  modalTitelLogContainer.insertAdjacentHTML('beforeend', modalTitelString);

  var htmlString = "<table class=\"table table-striped\">";
  htmlString += "<thead>";
  htmlString += "<tr>";
  htmlString += "<th>user</th>";
  htmlString += "<th>info</th>";
  htmlString += "<th>status</th>";
  htmlString += "<th>timestamp</th>";
  htmlString += "</tr>";
  htmlString += "</thead>";
  htmlString += "<tbody>";
  for(let i = 0; i < data.logs.length; i++) {
    htmlString += "<tr>";
    htmlString += "<td>" + data.logs[i].user + "</td>";
    htmlString += "<td>" + data.logs[i].info + "</td>";
    htmlString += "<td>" + data.logs[i].status + "</td>";
    htmlString += "<td>" + data.logs[i].timestamp + "</td>";
    htmlString += "</tr>";
  }
  htmlString += "</tbody>";
  htmlString += "</table>";

  orderLogContainer.insertAdjacentHTML('beforeend', htmlString);
}

function getStatus(status) {
  var translateStatus = "";
  switch(status) {
    case 1:
      translateStatus += "ordered";
      break;
    case 2:
      translateStatus += "payed";
      break;
    case 3:
      translateStatus += "packed";
      break;
    case 4:
      translateStatus += "finished";
      break;
    case 5:
      translateStatus += "canceled";
      break;
    case 6:
      translateStatus += "returned";
      break;
    case 7:
      translateStatus += "return checked";
      break;
    case 8:
      translateStatus += "return failed";
      break;
    case 9:
      translateStatus += "payed back";
      break;
    default:
      translateStatus += "no status set";
  }
  return translateStatus;
}
