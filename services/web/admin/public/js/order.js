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
      showStatusError("You are not allwed to change this status.");
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


