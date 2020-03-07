function patchPwdUser(password) {
    var id = lastID;

    SimpleRequest.PATCH(USER_SERVICE,'user/'+id+'*/resetpassword')
    .onSuccess(function(){
        patchPwdUserStatus = true;
        showStatusInfo("Password reseted.")
    })
    .onUnauthorized(function(){
        showStatusInfo("You have not the Permission to do that.")
    })
    .onFailure(function(){
        showStatusInfo("Password reset failed.")
    })
    .onError(function(){
        showStatusInfo("Network Error")
    })
    .addJson({
        password: password
    })
    .send();
  }

$('#resetPwdUserBtn').click(function(){
    $('#user-passwprd-first').val(''); 
    $('#user-passwprd-sec').val('');
    $('#user_password_modal').modal('show');
});

function userPasswordError(message)
{
    document.getElementById('user-password-first').classList.add('is-invalid');
    document.getElementById('user-password-first').classList.add('is-invalid');
    document.getElementById('user-password-help').innerHTML = message;
}

$('#user-btn-change-password').click(function(){

    var first = $('#user-password-first').val();
    var secound = $('#user-password-first').val();

    var res = checkPassword(first,secound);
    if(res === true)
    {
        patchPwdUser(first);
        $('#user_password_modal').modal('hide');
    }else{
        userPasswordError(res);
    }

});
