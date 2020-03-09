let user = null;

SimpleRequest.GET(USER_SERVICE,'me')
.onSuccess(function(data)
{
    user = data;
    document.getElementById('navbar-user-name').innerHTML = data.firstname+' '+data.lastname;
    document.getElementById('user-fname').value = data.firstname;
    document.getElementById('user-lname').value = data.lastname;
    document.getElementById('user-mail').value = data.mail;

    showOrderStatusButton(user);

})
.onFailure(function(errorstatus){
    showStatusError("Error loading user details "+errorstatus);
})
.onError(function(){{
    showStatusError("Network Error");
}})
.send();

function passwordError(message)
{
    document.getElementById('password-newfirst').classList.add('is-invalid');
    document.getElementById('password-newsecound').classList.add('is-invalid');
    document.getElementById('password-help').innerHTML = message;
}

function showOrderStatusButton(user)
{
  console.log("user Objekt:");
  console.log(user.auth.auth_allOrders);
  if (user.auth.auth_allOrders) {
    $('#editStatusCol').addClass('show');
  } else {
    $('#changeStatusCol').addClass('show');
  }
}

document.getElementById('btn-change-password').addEventListener('click',function(e){
    document.getElementById('password-newfirst').classList.remove('is-invalid');
    document.getElementById('password-newsecound').classList.remove('is-invalid');
    document.getElementById('password-help').innerHTML = "";

    var first = $('#password-newfirst').val();
    var secound = $('#password-newsecound').val();
    let res = checkPassword(first,secound);
    if(res === true)
    {
        $('#change_password_modal').modal('show');
    }else{
        passwordError(res);
    }


})

document.getElementById('btn-change-password-open').addEventListener('click',function(e){
    $('#password_modal').modal('show');
    document.getElementById('password-old').value = "";
    document.getElementById('password-newfirst').value = "";
    document.getElementById('password-newsecound').value = "";
});

document.getElementById('btn-change-password-accept').addEventListener('click',function(e){
    $('#change_password_modal').modal('hide');
    $('#password_modal').modal('hide');
    $('#user_modal').modal('hide');

    SimpleRequest.PATCH(USER_SERVICE,'me/password')
    .addJson({
        oldPassword: document.getElementById('password-old').value,
        newPassword: document.getElementById('password-newfirst').value,
    })
    .onSuccess(function(){
        showStatusInfo("Password changed");
    })
    .onFailure(function(statuscode){
        if(statuscode === 401)
        {
            showStatusError("Your Password is wrong.");
        }else{
            showStatusError("Could not change your Password.");
        }
    })
    .onError(function(){
        showStatusError("Network Error");
    }).send();
});

document.getElementById('btn-change-password-cancel').addEventListener('click',function(e){
    $('#change_password_modal').modal('hide');
    $('#password_modal').modal('hide');
    $('#user_modal').modal('hide');
});
