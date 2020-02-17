// Rufe alle Container auf um dynamisch den Inhalt derer zu ändern:
var btn = document.getElementById("btn");
var admincContainer = document.getElementById('adminc');
var jsonTableContainer = document.getElementById('jsonTableObjekt');
var detailTableContainer = document.getElementById('jsonDetailObjekt');
var orderShippingAddressTableContainer = document.getElementById('jsonAddressTableObjekt');
var modalTitelContainer = document.getElementById('modalDetailTitel');
var modalTitelLogContainer = document.getElementById('modalDetailLogTitel');
var modalTitelChangeContainer = document.getElementById('modalChangeOrderTitel');
var modalGroupAddUserGroupContainer = document.getElementById('jsonAddUserGroupObjekt');
var orderStatusButtonContainer = document.getElementById('curStatusButton');
var orderNextButtonContainer = document.getElementById('nextStatusButton');
var orderLogContainer = document.getElementById('orderLogContent');
var errorTableContainer = document.getElementById('errorTableObjekt');
var errorModalContainer = document.getElementById('errorModalObjekt');
//  Helfer-Variablen, um den aktuellen Status zu speichern
var deleteGroupReq = false;
var patchAddUserGroupReq = false;
var getUsersForGroupReq = false;
var patchRemoveUserGroupStatus = false;
var patchNewUserStatus = false;
var patchPwdUserStatus = false;
var putGroupReq = false;
var putUserReq = false;
var setArticleDetails = false;
var setGroupDetails = false;
var setUserDetails = false;
var setCategoryDetails = false;
var postCategoryReq = false;
var postGroupsReq = false;
var postUsersReq = false;
var getGroupsReq = false;
var getUsersReq = false;
var getCategoryReq = false;
var getOrderReq = false;
var setOrderDetails = false;
var setNewStatus = false;
let lastID = 0;
let lastStatus = 0;
let curLog = 0;
// Übergangslösung, damit beim schliessen und oeffnen von Detailseiten alle zukünftigen Aufrufe funktionieren
function setDetailsFalse() {
  setArticleDetails = false;
  setGroupDetails = false;
  setUserDetails = false;
  setCategoryDetails = false;
  patchPwdUserStatus = false;
  patchNewUserStatus = false;
  patchRemoveUserGroupStatus = false;
}

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
      $('#jsonDetailObjekt').children('table').eq(0).remove();
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
  });
  $(".editCategoryButton").click(function() {
    console.log("click editCategoryButton");       // Prints out test text
    var id = $(this).closest("tr").find(".id").text();
    console.log(id);
    if (lastID == id) {
      console.log("Keine Neuzuweisung, da lastID = id")
    } else {
      console.log("Neuzuweisung auf: lastId = id")
      $('#jsonDetailObjekt').children('form').eq(0).remove();
      $('#modalDetailTitel').children('span').eq(0).remove();
      // $('#modalDetailLogTitel').children('span').eq(0).remove();
      // $('#categoryLogContent').children('table').eq(0).remove();
      clearParam();
      getCategoryDetails(id);
    }
  });
  $(".editUserButton").click(function() {
    console.log("click editUserButton");       // Prints out test text
    var id = $(this).closest("tr").find(".id").text();
    console.log(id);
    if (lastID == id) {
      console.log("Keine Neuzuweisung, da lastID = id")
      setUserDetails = true;
    } else {
      console.log("Neuzuweisung auf: lastId = id")
      $('#jsonDetailObjekt').children('div').eq(0).remove();
      $('#modalDetailTitel').children('span').eq(0).remove();

      clearParam();
      getUserDetails(id);
    }
  });
  $(".editGroupButton").click(function() {
    console.log("click detailModal");       // Prints out test text
    var id = $(this).closest("tr").find(".id").text();
    console.log(id);
    if (lastID == id) {
      console.log("Keine Neuzuweisung, da lastID = id")
      setGroupDetails = true;
    } else {
      console.log("Neuzuweisung auf: lastId = id")
      $('#jsonDetailObjekt').children('div').eq(0).remove();
      $('#modalDetailTitel').children('span').eq(0).remove();

      clearParam();
      getGroupDetails(id);
    }
  });
  $(".editArticleButton").click(function() {
    console.log("click detailModal");       // Prints out test text
    var id = $(this).closest("tr").find(".id").text();
    console.log(id);
    if (lastID == id) {
      console.log("Keine Neuzuweisung, da lastID = id")
    } else {
      console.log("Neuzuweisung auf: lastId = id")
      $('#jsonDetailObjekt').children('form').eq(0).remove();
      $('#modalDetailTitel').children('span').eq(0).remove();

      clearParam();
      getArticleDetails(id);
    }
  });
}
function clickEvent() {
  $(".removeUserGroupButton").click(function() {
    console.log("click removeUserFromGroup Button");       // Prints out test text
    var id = $(this).closest("tr").find(".id").text();
    if (id != 0) {
      patchRemoveUserGroup(id);
    }
  });
  $(".addNewUserGroupButton").click(function() {
    console.log("click addUserToGroup Button");       // Prints out test text
    var id = $(this).closest("tr").find(".id").text();
    if (id != 0) {
      patchAddUserGroup(id);
    }
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
var currentAdminPage = getUrlVars()["ap"];
var edit = false;
var currentStatus = 0;
var statusString = '';

//speichere ID von Order-Detail Response in parameter in addresszeile
function addParam(curID, curOrder, status){
  if(curID != 'undefined' && curOrder == 'undefined' && status == 'undefined')
  {
    history.pushState({id: curID}, "&id=" + curID);
  } else {
    history.pushState({id: curID}, "orderid", "?order=" + curOrder + "&id=" + curID + "&status=" + status);
  }
}
function addParamCategory(curID, curOrder, status){
	history.pushState({id: curID}, "orderid", "?order=" + curOrder + "&id=" + curID + "&status=" + status);
}
//setze ADressverlauf zurück
function clearParam(){
	history.pushState({}, "");
}

//show info status
function showStatusInfo(content){
  $('#status').css("background-color", "#77998d");
  $('#status').css("color", "#fff");
  var info = document.getElementById('status');
  info.innerHTML = content;
  info.className = "show";
  setTimeout(function(){ info.className = info.className.replace("show", ""); }, 3000);
}
//show error status
function showStatusError(content){
  $('#status').css("background-color", "#f9a03f");
  $('#status').css("color", "#fff");
  var error = document.getElementById('status');
  error.innerHTML = content;
  error.className = "show";
  setTimeout(function(){ error.className = error.className.replace("show", ""); }, 3000);
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
