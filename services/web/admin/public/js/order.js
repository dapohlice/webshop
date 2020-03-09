$(function (){

  // var statusTemplate = $('#status-template').html(); // for details at one article
  var statusID = 0;

  $('#editStatus').on('click', function() {

    var id = $('#currentStatusBtn').attr('data-id');
    console.log("ID value of clicked edit Article: ");
    console.log(id);

    if (statusID == id) {
      console.log("nichts passiert");
    } else {
      console.log("Neuzuweisung");
      statusID = id;

      SimpleRequest.GET(ORDER_SERVICE,"status")
        .onSuccess(function(stati) {
          if ((JSON.stringify(stati) !== JSON.stringify([]))) {
            $('#orderStatus').find("option").remove();
            console.log("statusID");
            console.log(statusID);
            $.each(stati, function(i, status) {
              console.log("searching for status id with input");
              if (statusID == status.id) {
                $('#orderStatus')
                .append("<option selected data-id='" + status.id + "' value='" + status.name + "'>" + status.name + "</option>");
              } else if (statusID != status.id) {
                $('#orderStatus')
                .append("<option data-id='" + status.id + "' value='" + status.name + "'>" + status.name + "</option>");
              }
            });

          } else {
            $('#orderStatus').find("option").remove().end()
            .append("No stati found!");
          }
        })
        .onFailure(function (errorcode,errortext, statusText) {
          console.log("fail");
          showStatusError(statusText + ": " + errorcode+ " - " + errortext + " while get stati");
        })
        .onError(function(error){
          showStatusError("Network Error");
        }).send();
    }

  });

  $(document).on("click", "#edit-status", function() {

    // change vars
    var $orderStatus = $('#orderStatus');
    var $setStatiMessage = $('#setStatiMessage');
    console.log("Edited Status: ");
    console.log($setStatiMessage.val());
    console.log($orderStatus.find("option:selected").attr('data-id'));

    var status = {
      info: $setStatiMessage.val(),
      status: $orderStatus.find("option:selected").attr('data-id')
    };

    SimpleRequest.PATCH(ORDER_SERVICE,"order/"+lastID)
    .onSuccess(function (newStatus) {
      console.log("successfully set new individual status");
      showStatusInfo("Status processed");
      $('#setOrderStatusModal').modal('hide');
      $('#detailModal').modal('hide');
      getOrders();
    })
    .onUnauthorized(function(data){
      showStatusError("You are not allowed to change this status.");
    })
    .onFailure(function (errorcode,errortext, statusText) {
      console.log("failed set new status request");
      showStatusError(statusText + ": " + errorcode+ " - " + errortext + " while saving article");
    })
    .onError(function(error){
      showStatusError("Network Error");
    })
    .addJson(status)
    .send();

  });
});


function setNextStatus() {
    var url = '';
    var urlParamID = 0;
    var status = 0;
    urlParamID = lastID;
    status = lastStatus;


    let req = SimpleRequest.PATCH(ORDER_SERVICE,'order/'+urlParamID)
    .onSuccess(function(data){
      setNewStatus = true;
      setOrderDetails = false;
      lastID = 0;
      lastStatus = 0;
      response(data);
    })
    .onUnauthorized(function(data){
      showStatusError("You are not allowed to change this status.");
    })
    .onFailure(function(){
      showStatusError("It is not possible to change this status.");
    })
    .onError(function(){
      showStatusError("An network Error occurred.");
    });


    let message = document.getElementById('nextStatusMessage').value;
    if(message !== '' || message !== undefined)
    {
      let data = {
        info: message
      }
      req.addJson(data);
    }
    req.send();

  }

document.getElementById('acceptStatusButton').addEventListener('click',function(e){
    setNextStatus();
    $('#changeOrderStatusModal').modal('hide');
});

document.getElementById('changeStatusButton').addEventListener('click',function(e)
{
    e.preventDefault();
    document.getElementById('nextStatusMessage').value = "";
    $('#changeOrderStatusModal').modal('show');

});
