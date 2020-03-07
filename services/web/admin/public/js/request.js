function getOrders() {
  setDetailsFalse();
  var url = '';
  var urlParamStatus = 0;
  urlParamStatus = getCurrentOrderFromParam(currentAdminPage);
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
function getUsers() {
  setDetailsFalse();
  var url = '';
  var urlParam = currentAdminPage;
  console.log(urlParam);
  $('#jsonTableObjekt').children('table').eq(0).remove();

  if(urlParam == 'users') {
    url = 'http://localhost:3003/user';
    var res = new XHR('GET', url);
    getUsersReq = true;
    console.log("GetXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(url);
  }
}
function getUsersForGroup() {
  var url = '';
  var urlParam = currentAdminPage;
  console.log(urlParam);
  $('#jsonAddUserGroupObjekt').children('table').eq(0).remove();

  if(urlParam == 'groups') {
    url = 'http://localhost:3003/user';
    var res = new XHR('GET', url);
    getUsersForGroupReq = true;
    console.log("GetXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(url);
  }
}
function postUser() {
  setDetailsFalse();
  var url = '';
  var urlParam = currentAdminPage;
  console.log(urlParam);

  // Get some values from elements on the page:
  var term = $('#firstname').val();
  var term2 = $('#lastname').val();
  var term3 = $('#email').val();

  console.log(term);
  console.log(term2);
  console.log(term3);
  $('#jsonTableObjekt').children('table').eq(0).remove();

  // Create an empty JSON object to return.
  var retJson = {};
  retJson.firstname = term;
  retJson.lastname = term2;
  retJson.mail = term3;
  var json = JSON.stringify(retJson);
  console.log(json);

  if((term != '') && (term2 != '') && (term3 != '')) {
    url = 'http://localhost:3003/user';
    var res = new XHR('POST', url, json, 'application/json');
    postUsersReq = true;
    console.log("PostXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(json);
  }
}
function postGroup() {
  setDetailsFalse();
  var url = '';
  var urlParam = currentAdminPage;
  console.log(urlParam);

  // Get some values from elements on the page:
  var term = $('#groupname').val();
  console.log(term);
  $('#jsonTableObjekt').children('table').eq(0).remove();

  // Create an empty object to return.
  var retJson = {};
  retJson.groupname = term;
  // Create an string json to return
  var json = JSON.stringify(retJson);
  console.log(json);

  if(term != '') {
    url = 'http://localhost:3003/group';
    var res = new XHR('POST', url, json, 'application/json');
    postGroupsReq = true;
    console.log("PostXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(json);
  }
}
function getGroups() {
  setDetailsFalse();
  var url = '';
  var urlParam = currentAdminPage;
  console.log(urlParam);
  $('#jsonTableObjekt').children('table').eq(0).remove();

  if(urlParam == 'groups') {
    url = 'http://localhost:3003/group';
    var res = new XHR('GET', url);
    getGroupsReq = true;
    console.log("GetXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(url);
  }
}
function patchAddUserGroup(userid) {
  var url = '';
  // Get some values from elements on the page:
  var term = userid;

  // Create an empty object to return.
  var retJson = {};
  retJson.userId = term;

  // Create an string json to return
  var json = JSON.stringify(retJson);

  if( json.length != 0 ) {
    url = 'http://localhost:3003/group/' + lastID + '/add';
    var res = new XHR('PATCH', url, json, 'application/json');

    patchAddUserGroupReq = true;
    console.log("PatchXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(json);
  }
}
function patchRemoveUserGroup(userid) {
  var url = '';
  // Get some values from elements on the page:
  var term = userid;

  // Create an empty object to return.
  var retJson = {};
  retJson.userId = term;

  // Create an string json to return
  var json = JSON.stringify(retJson);

  if( json.length != 0 ) {
    url = 'http://localhost:3003/group/' + lastID + '/remove';
    var res = new XHR('PATCH', url, json, 'application/json');

    patchRemoveUserGroupStatus = true;
    console.log("PatchXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(json);
  }
}
function patchUserStatus() {
  var url = '';
  var id = lastID;
  // Get some values from elements on the page:
  var term = $('#statusUserInputEdit').is(':checked');

  // Create an empty object to return.
  var retJson = {};
  retJson.status = term;

  // Create an string json to return
  var json = JSON.stringify(retJson);

  if( json.length != 0 ) {
    url = 'http://localhost:3003/user/' + id;
    var res = new XHR('PATCH', url, json, 'application/json');

    patchNewUserStatus = true;
    console.log("PatchXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(json);
  }
}

function deleteGroup() {
  var url = '';
  var id = lastID;

  if( id != null ) {
    url = 'http://localhost:3003/group/' + id;
    var res = new XHR('DELETE', url);

    deleteGroupReq = true;
    console.log("DeleteXHR Klasse wurde aufgerufen mit folgenden Objekt:");
  }
}
function putUser() {
  var url = '';
  var id = lastID;
  // Get some values from elements on the page:
  var term = $('#firstnameEdit').val();
  var term2 = $('#lastnameEdit').val();
  var term3 = $('#mailEdit').val();
  // var term4 = $('#loginnameEdit').val();

  // Create an empty JSON object to return.
  var retJson = {};
  retJson.firstname = term;
  retJson.lastname = term2;
  retJson.mail = term3;
  // retJson.loginname = term4;
  // if (true) {
  //   retJson.status = true;
  // }

  // Create an string json to return
  var json = JSON.stringify(retJson);

  if( (term != '') && (term2 != '') && (term3 != '')) {
    url = 'http://localhost:3003/user/' + id;
    var res = new XHR('PUT', url, json, 'application/json');

    putUserReq = true;
    console.log("PutXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(json);
  }
}
function putGroup() {
  var url = '';
  var id = lastID;
  // Get some values from elements on the page:
  // var term = $('#groupname').val();
  var term2 = $('#auth_user').is(':checked');
  var term3 = $('#auth_product').is(':checked');
  var term4 = $('#auth_group').is(':checked');
  var term5 = $('#auth_normalOrders').is(':checked');
  var term6 = $('#auth_allOrders').is(':checked');
  // Create an empty JSON object to return.
  var retJson = {};
  retJson.auth_user = term2;
  retJson.auth_product = term3;
  retJson.auth_group = term4;
  retJson.auth_normalOrders = term5;
  retJson.auth_allOrders = term6;

  // Create an string json to return
  var json = JSON.stringify(retJson);

  if( json.length != 0) {
    url = 'http://localhost:3003/group/' + id;
    var res = new XHR('PUT', url, json, 'application/json');

    putGroupReq = true;
    console.log("PutXHR Klasse wurde aufgerufen mit folgenden Objekt:");
    console.log(json);
  }
}

function getOrderDetails(id) {
  setDetailsFalse();
  var url = '';
  console.log("getOrder ID for details: ");
  console.log(id);

  if(id != null) {
    setOrderDetails = true;
    setNewStatus = false;
    url = 'http://localhost:3001/order/' + id;
  }
  var res = new XHR('GET', url);


  console.log("UrlParams: ");
  console.log(currentUrl);

}
function getUserDetails(id) {
  setDetailsFalse();
  var url = '';
  console.log("getUser ID for details: ");
  console.log(id);

  if(id != null) {
    setUserDetails = true;
    url = 'http://localhost:3003/user/' + id;
    var res = new XHR('GET', url);
  }
}
function getGroupDetails(id) {
  setDetailsFalse();
  var url = '';
  console.log("getGroup ID for details: ");
  console.log(id);

  if(id != null) {
    setGroupDetails = true;
    url = 'http://localhost:3003/group/' + id;
    var res = new XHR('GET', url);
  }
}
