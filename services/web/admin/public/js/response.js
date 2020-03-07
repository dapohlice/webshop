// Hier werden alle Daten einer ajax Antwort in Tabellen verarbeitet
function response(data) {
  if ((JSON.stringify(data) !== JSON.stringify([])) && getOrderReq == true) {
    console.log("Objekt in der Antwort ist nicht leer");
    renderOrderTableHTML(data);
    getOrderReq = false;
  } else if (setNewStatus) {
    $('#detailModal').modal('hide');
    //show info status
    showStatusInfo("Status is changed successfully!");
    //end of show info status
    getOrders();
  } else if (deleteGroupReq) {
    $('#deleteModal').modal('hide');
    $('#detailModal').modal('hide');
    //show info status
    showStatusInfo("Delete group successfully!");
    //end of show info status
    getGroups();
    deleteGroupReq = false;
  } else if (patchAddUserGroupReq) {
    patchAddUserGroupReq = false;
    $('#jsonAddUserGroupObjekt').children('table').eq(0).remove();
    $('#jsonDetailObjekt').children('div').eq(0).remove();
    $('#modalDetailTitel').children('span').eq(0).remove();
    getGroupDetails(lastID);
    showStatusInfo("User successfully added!");
  } else if (patchNewUserStatus) {
    patchNewUserStatus = false;
    $('#jsonDetailObjekt').children('div').eq(0).remove();
    $('#modalDetailTitel').children('span').eq(0).remove();
    getUserDetails(lastID);
    showStatusInfo("Status successfully changed!");
  } else if (patchRemoveUserGroupStatus) {
    patchRemoveUserGroupStatus = false;
    $('#jsonDetailObjekt').children('div').eq(0).remove();
    $('#modalDetailTitel').children('span').eq(0).remove();
    getGroupDetails(lastID);
    showStatusInfo("User successfully removed from group " + lastID + "!");
  } else if (patchPwdUserStatus) {
    patchPwdUserStatus = false;
    showStatusInfo("Pwd successfully changed!");
  } else if (getUsersForGroupReq) {
    renderUserForGroupTableHTML(data);
    getUsersForGroupReq = false;
  } else if (putUserReq) {
    getUsers();
    putUserReq = false;
  } else if (putGroupReq) {
    getGroups();
    putGroupReq = false;
  } else if (setOrderDetails) {
    console.log("Rufe Order-Details HTMLs auf");
    renderOrderDetailsHTML(data);
    renderOrderShippingAddressHTML(data);
    renderOrderStatusButtonHTML(data);
    renderOrderLogHTML(data);
    rendernextButtonHTML(data);
  } else if (setUserDetails) {
    console.log("Rufe User-Details HTMLs auf");
    renderUserDetailsHTML(data);
  } else if (setGroupDetails) {
    console.log("Rufe Group-Details HTMLs auf");
    renderGroupDetailsHTML(data);
  } else if ((JSON.stringify(data) !== JSON.stringify([])) && getUsersReq) {
    renderUserTableHTML(data);
    getUsersReq = false;
  } else if (postUsersReq) {
    getUsers();
    postUsersReq = false;
  } else if (postGroupsReq) {
    getGroups();
    postGroupsReq = false;
  } else if ((JSON.stringify(data) !== JSON.stringify([])) && getGroupsReq) {
    renderGroupTableHTML(data);
    getGroupsReq = false;
  } else {
    renderErrorTableHTML();
  }
}

// Alle Render HTML Funktionen:
function renderOrderTableHTML(data) {
  console.log("renderOrderTableHTML gestartet")
  var htmlString = "<table class=\"table table-striped table-hover\">";
  htmlString += "<thead><tr><th>ID</th><th>mail</th><th>timestamp</th>";
  if (currentStatus == 0) {
    htmlString += "<th>status</th>";
  }
  htmlString += "</tr></thead>";
  htmlString += "<tbody>";
  for(let i = 0; i < data.length; i++) {
    if (currentStatus != 99) {
      htmlString += "<tr class=\"editOrderButton table-row\" data-tooltip=\"tooltip\" data-placement=\"bottom\" title=\"Edit this order\" data-toggle=\"modal\" data-target=\"#detailModal\">";
    } else {
      htmlString += "<tr>";
    }
    htmlString += "<td class=\"id\"><span>" + data[i].id + "</span></td>";
    htmlString += "<td>" + data[i].mail + "</td>";
    htmlString += "<td>" + timeConverter(data[i].timestamp) + "</td>";
    if (currentStatus == 0) {
      htmlString += "<td>";
      htmlString += getStatus(data[i].status);
      htmlString += "</td>";
    }
    htmlString += "</tr>";
  }
  htmlString += "</tbody>";
  htmlString += "</table>"

  jsonTableContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log("Ab jetzt wird helper Klasse aufgerufen...");
  helper();
}
function renderUserTableHTML(data) {
  console.log("renderUserTableHTML gestartet")
  // Ersetzen mit richtiger Login Berechtigung
  var admin = 1;

  var htmlString = "<table class=\"table table-striped table-hover\">";
  htmlString += "<thead><tr><th>ID</th><th>Lastname</th><th>Firstname</th>";
  if (admin == 1) {
    htmlString += "<th>status</th>";
  }
  htmlString += "</tr></thead>";
  htmlString += "<tbody>";
  for(let i = 0; i < data.length; i++) {
    if (admin == 1) {
      htmlString += "<tr class=\"editUserButton table-row\" data-tooltip=\"tooltip\" data-placement=\"bottom\" title=\"Edit this user\" data-toggle=\"modal\" data-target=\"#detailModal\">";
    } else {
      htmlString += "<tr>";
    }
    htmlString += "<td class=\"id\"><span>" + data[i].id + "</span></td>";
    htmlString += "<td>" + data[i].lastname + "</td>";
    htmlString += "<td>" + data[i].firstname + "</td>";
    if (admin == 1) {
      htmlString += "<td>";
      if (data[i].status) {
        htmlString += "<i class=\"fa fa-check\" style=\"color:green\"></i>";
      } else {
        htmlString += "<i class=\"fa fa-close\" style=\"color:red\"></i>";
      }
      htmlString += "</td>";
    }
    htmlString += "</tr>";
  }
  htmlString += "</tbody>";
  htmlString += "</table>"

  jsonTableContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log("Ab jetzt wird helper Klasse aufgerufen...");
  helper();
}
function renderUserForGroupTableHTML(data) {
  console.log("renderUserForGroupTableHTML gestartet")
  // Ersetzen mit richtiger Login Berechtigung
  var admin = 1;

  var htmlString = "<table class=\"table table-striped table-hover\">";
  htmlString += "<thead><tr><th>ID</th><th>Lastname</th><th>Firstname</th>";
  if (admin == 1) {
    htmlString += "<th>status</th>";
  }
  htmlString += "</tr></thead>";
  htmlString += "<tbody>";
  for(let i = 0; i < data.length; i++) {
    if (admin == 1) {
      htmlString += "<tr class=\"addNewUserGroupButton table-row\" data-tooltip=\"tooltip\" data-placement=\"bottom\" title=\"Add this user\" data-dismiss=\"modal\">";
    } else {
      htmlString += "<tr>";
    }
    htmlString += "<td class=\"id\"><span>" + data[i].id + "</span></td>";
    htmlString += "<td>" + data[i].lastname + "</td>";
    htmlString += "<td>" + data[i].firstname + "</td>";
    if (admin == 1) {
      htmlString += "<td>";
      if (data[i].status) {
        htmlString += "<i class=\"fa fa-check\" style=\"color:green\"></i>";
      } else {
        htmlString += "<i class=\"fa fa-close\" style=\"color:red\"></i>";
      }
      htmlString += "</td>";
    }
    htmlString += "</tr>";
  }
  htmlString += "</tbody>";
  htmlString += "</table>"

  modalGroupAddUserGroupContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log("Ab jetzt wird auf eine Auswahl gewartet...");
  console.log(lastID);
  clickEvent();
}
function renderGroupTableHTML(data) {
  console.log("renderGroupTableHTML gestartet")
  // Ersetzen mit richtiger Login Berechtigung
  var admin = 1;

  var htmlString = "<table class=\"table table-striped table-hover\">";
  htmlString += "<thead><tr><th>ID</th><th>Groupname</th>";
  htmlString += "</tr></thead>";
  htmlString += "<tbody>";

  for(let i = 0; i < data.length; i++) {
    if (admin == 1) {
      htmlString += "<tr class=\"editGroupButton table-row\" data-tooltip=\"tooltip\" data-placement=\"bottom\" title=\"Edit this group\" data-toggle=\"modal\" data-target=\"#detailModal\">";
    } else {
      htmlString += "<tr>";
    }
    htmlString += "<td class=\"id\"><span>" + data[i].id + "</span></td>";
    htmlString += "<td>" + data[i].groupname + "</td>";

    htmlString += "</tr>";
  }
  htmlString += "</tbody>";
  htmlString += "</table>"

  jsonTableContainer.insertAdjacentHTML('beforeend', htmlString);
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
  errorModalContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log("Output: Error page");
  $('#errorModal').modal('show');

}
function renderErrorTableHTML() {
  var htmlString = "<table class=\"table table-striped\">";
  htmlString += "<thead><tr><th>ID</th><th>mail</th><th>timestamp</th>";
  htmlString += "</tr></thead>";
  htmlString += "<tbody>";
  htmlString += "<tr>";
  htmlString += "<td colspan=\"3\">No entries available! Try again later.</td>";
  htmlString += "</tr>";
  htmlString += "</tbody>";
  htmlString += "</table>"

  errorTableContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log("Keine Bestellungen gefunden");
}
function renderOrderDetailsHTML(data) {
  lastID = data.id;
  lastStatus = data.status;
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
    htmlString += "<td>" + currencyConverter(amountPrice) + "</td>";
    htmlString += "</tr>";
    total += amountPrice;
  }
  htmlString += "<tr class=\"orderTotal\">";
  htmlString += "<td></td>";
  htmlString += "<td></td>";
  htmlString += "<td></td>";
  htmlString += "<td><span class=\"double_underline\">" + currencyConverter(total) + "</td>";
  htmlString += "</tr>";

  htmlString += "</tbody>";
  htmlString += "</table>"

  detailTableContainer.insertAdjacentHTML('beforeend', htmlString);
  console.log("Tabelle mit Bestelldetails erstellt für ID:");
  console.log(lastID);
  //Setze den aktuellen Status in die Params in die Addresszeile
  // addParam(lastID, orderParam, status);
}
function renderUserDetailsHTML(data) {
  lastID = data.id;
  var modalTitelString = "<span>User ID: " + lastID + "</span>";
  modalTitelContainer.insertAdjacentHTML('beforeend', modalTitelString);

  var htmlString = "<div>";
  htmlString += "<form id=\"editUserForm\">";
  htmlString += "<div class=\"form-row\">";
  htmlString += "<div class=\"col-md-6 mb-3\">";
  htmlString += "<label for=\"firstnameEdit\">First name</label>";
  htmlString += "<input id=\"firstnameEdit\" class=\"form-control\" type=\"text\" placeholder=\"First name\" value=\"" + data.firstname + "\" required></input>";
  htmlString += "<div class=\"invalid-feedback\">Please enter firstname</div>";
  htmlString += "</div>";
  htmlString += "<div class=\"col-md-6 mb-3\">";
  htmlString += "<label for=\"lastnameEdit\">Last name</label>";
  htmlString += "<input id=\"lastnameEdit\" class=\"form-control\" type=\"text\" placeholder=\"First name\" value=\"" + data.lastname + "\" required></input>";
  htmlString += "<div class=\"invalid-feedback\">Please enter lastname</div>";
  htmlString += "</div>";
  htmlString += "</div>";

  htmlString += "<div class=\"form-row\">";
  htmlString += "<div class=\"col-md-6 mb-3\">";
  htmlString += "<label for=\"mailEdit\">Mail Address</label>";
  htmlString += "<input id=\"mailEdit\" class=\"form-control\" type=\"email\" placeholder=\"Mail address\" value=\"" + data.mail + "\" required></input>";
  htmlString += "<div class=\"invalid-feedback\">Please enter valid mail address.</div>";
  htmlString += "</div>";
  htmlString += "<div class=\"col-md-6 mb-3\">";
  htmlString += "<label for=\"loginnameEdit\">Login name</label>";
  htmlString += "<input id=\"loginnameEdit\" class=\"form-control\" type=\"text\" placeholder=\"Login name\" value=\"" + data.loginname + "\" disabled></input>";
  htmlString += "<div class=\"invalid-feedback\">Please enter loginname</div>";
  htmlString += "</div>";
  htmlString += "</div>";
  // End Form
  htmlString += "</form>";

  htmlString += "<hr/>";

  htmlString += "<div class=\"row\">";
  // Start second row

  htmlString += "<div class=\"col-md-4 mb-3\">";
  htmlString += "<h5>Status</h5>";
  htmlString += "<div class=\"form-check\">";
  if (data.status) {
    console.log(data.status);
    htmlString += "<input type=\"checkbox\" id=\"statusUserInputEdit\" class=\"form-check-input\" checked>";
    htmlString += "<label class=\"form-check-label\" for=\"statusUserInpusEdit\">active</label>";
  } else {
    htmlString += "<input type=\"checkbox\" id=\"statusUserInputEdit\" class=\"form-check-input\">";
    htmlString += "<label class=\"form-check-label\" for=\"statusUserInputEdit\">not active</label>";
  }
  htmlString += "</div>";
  htmlString += "</div>";
  // Current Groups
  htmlString += "<div class=\"col-md-8 mb-3\">";
  htmlString += "<h5>Groups</h5>";
  htmlString += "<div class=\"btn-group\" role=\"group\">";
  if (data.groups.length != 0) {
    for (var i = 0; i < data.groups.length; i++) {
      htmlString += "<button type=\"button\" class=\"btn btn-secondary\" disabled>" + data.groups[i].groupname + "</button>"
    }
  } else {
    htmlString += "<button type=\"button\" class=\"btn btn-secondary\" disabled>None</button>"
  }
  htmlString += "</div>";
  htmlString += "</div>";

  // End second Row
  htmlString += "</div>";

  // End User Div
  htmlString += "</div>";

  detailTableContainer.insertAdjacentHTML('beforeend', htmlString);

  console.log("Last ID in user details:");
  console.log(lastID);
}
function renderGroupDetailsHTML(data) {
  lastID = data.id;
  var modalTitelString = "<span>Group " + data.groupname + " - ID: " + lastID + "</span>";
  modalTitelContainer.insertAdjacentHTML('beforeend', modalTitelString);

  var htmlString = "<div>";
  htmlString += "<form id=\"editGroupForm\">";
  htmlString += "<div class=\"form-row\">";
  if (data.users.length != 0) {
    htmlString += "<div class=\"col-md-6 mb-3\">";
  } else {
    htmlString += "<div class=\"col-md-12 mb-3\">";
  }


  htmlString += "<label for=\"groupnameEdit\">Group name</label>";
  htmlString += "<input id=\"groupnameEdit\" class=\"form-control\" type=\"text\" placeholder=\"First name\" value=\"" + data.groupname + "\" disabled></input>";
  htmlString += "<div class=\"invalid-feedback\">Please enter group name</div>";

  htmlString += "<h5 class=\"mt-3\">Change permissions for " + data.groupname + " group</h5>";

  htmlString += "<div class=\"form-row\">";
  htmlString += "<div class=\"form-check form-check-inline\">";
  if (data.auth_user) {
    console.log(data.auth_user);
    console.log("Ruft Checkbox ab");
    htmlString += "<input id=\"auth_user\" class=\"form-check-input\" type=\"checkbox\" checked data-toggle=\"toggle\" data-onstyle=\"primary\" data-offstyle=\"secondary\">"
  } else {
    htmlString += "<input id=\"auth_user\" class=\"form-check-input\" type=\"checkbox\" data-toggle=\"toggle\" data-onstyle=\"primary\" data-offstyle=\"secondary\">"
  }
  htmlString += "<label for=\"auth_user\" class=\"form-check-label\">User</label>";
  htmlString += "</div>";
  htmlString += "</div>";

  htmlString += "<div class=\"form-row\">";
  htmlString += "<div class=\"form-check form-check-inline\">";
  if (data.auth_product) {
    console.log(data.auth_product);
    console.log("Ruft Checkbox ab");
    htmlString += "<input id=\"auth_product\" class=\"form-check-input\" type=\"checkbox\" checked data-toggle=\"toggle\" data-onstyle=\"primary\" data-offstyle=\"secondary\">"
  } else {
    htmlString += "<input id=\"auth_product\" class=\"form-check-input\" type=\"checkbox\" data-toggle=\"toggle\" data-onstyle=\"primary\" data-offstyle=\"secondary\">"
  }
  htmlString += "<label for=\"auth_product\" class=\"form-check-label\">Product</label>";
  htmlString += "</div>";
  htmlString += "</div>";

  htmlString += "<div class=\"form-row\">";
  htmlString += "<div class=\"form-check form-check-inline\">";
  if (data.auth_group) {
    console.log(data.auth_group);
    console.log("Ruft Checkbox ab");
    htmlString += "<input id=\"auth_group\" class=\"form-check-input\" type=\"checkbox\" checked data-toggle=\"toggle\" data-onstyle=\"primary\" data-offstyle=\"secondary\">"
  } else {
    htmlString += "<input id=\"auth_group\" class=\"form-check-input\" type=\"checkbox\" data-toggle=\"toggle\" data-onstyle=\"primary\" data-offstyle=\"secondary\">"
  }
  htmlString += "<label for=\"auth_group\" class=\"form-check-label\">Group</label>";
  htmlString += "</div>";
  htmlString += "</div>";

  htmlString += "<div class=\"form-row\">";
  htmlString += "<div class=\"form-check form-check-inline\">";
  if (data.auth_normalOrders) {
    console.log(data.auth_normalOrders);
    console.log("Ruft Checkbox ab");
    htmlString += "<input id=\"auth_normalOrders\" class=\"form-check-input\" type=\"checkbox\" checked data-toggle=\"toggle\" data-onstyle=\"primary\" data-offstyle=\"secondary\">"
  } else {
    htmlString += "<input id=\"auth_normalOrders\" class=\"form-check-input\" type=\"checkbox\" data-toggle=\"toggle\" data-onstyle=\"primary\" data-offstyle=\"secondary\">"
  }
  htmlString += "<label for=\"auth_normalOrders\" class=\"form-check-label\">Normal Orders</label>";
  htmlString += "</div>";
  htmlString += "</div>";

  htmlString += "<div class=\"form-row\">";
  htmlString += "<div class=\"form-check form-check-inline\">";
  if (data.auth_allOrders) {
    console.log(data.auth_allOrders);
    console.log("Ruft Checkbox ab");
    htmlString += "<input id=\"auth_allOrders\" class=\"form-check-input\" type=\"checkbox\" checked data-toggle=\"toggle\" data-onstyle=\"primary\" data-offstyle=\"secondary\">"
  } else {
    htmlString += "<input id=\"auth_allOrders\" class=\"form-check-input\" type=\"checkbox\" data-toggle=\"toggle\" data-onstyle=\"primary\" data-offstyle=\"secondary\">"
  }
  htmlString += "<label for=\"auth_allOrders\" class=\"form-check-label\">All Orders</label>";
  htmlString += "</div>";
  htmlString += "</div>";
  // col-6
  htmlString += "</div>";
  console.log(data.users.length);
  if (data.users.length != 0) {
    htmlString += "<div class=\"col-md-6 mb-3\">";

    htmlString += "<h5>User inside this group</h5>";
    htmlString += "<table class=\"table table-striped\">";
    htmlString += "<thead><tr><th>id</th><th>firstname</th><th>lastname</th><th></th>";
    htmlString += "</tr></thead>";
    htmlString += "<tbody>";
    for(let i = 0; i < data.users.length; i++) {
      htmlString += "<tr>";
      htmlString += "<td class=\"id\">" + data.users[i].id + "</td>";
      htmlString += "<td>" + data.users[i].firstname + "</td>";
      htmlString += "<td>" + data.users[i].lastname + "</td>";
      htmlString += "<td><button class=\"removeUserGroupButton btn btn-danger\" type=\"button\" data-tooltip=\"tooltip\" data-placement=\"bottom\" title=\"Remove this user from current group\"><i class=\"fa fa-trash\"></i></button</td>";
      htmlString += "</tr>";
    }

    htmlString += "</tbody>";
    htmlString += "</table>"
    htmlString += "</div>";
  }

  // Form row
  htmlString += "</div>";

  // End Form
  htmlString += "</form>";
  // submit button
  htmlString += "</div>";

  detailTableContainer.insertAdjacentHTML('beforeend', htmlString);

  console.log("Last ID in group details:");
  console.log(lastID);
  clickEvent();
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
    htmlString += "<td>" + timeConverter(data.logs[i].timestamp) + "</td>";
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
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + '. ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
function currencyConverter(eu_cent){
  var euro = eu_cent / 100;
  eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(euro)
  return eur;
}
