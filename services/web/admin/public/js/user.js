let user = null;

SimpleRequest.GET(USER_SERVICE,'me')
.onSuccess(function(data)
{
    user = data;
    document.getElementById('navbar-user-name').innerHTML = data.firstname+' '+data.lastname;
    document.getElementById('user-fname').value = data.firstname;
    document.getElementById('user-lname').value = data.lastname;
    document.getElementById('user-mail').value = data.mail;

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

document.getElementById('btn-change-password').addEventListener('click',function(e){
    document.getElementById('password-newfirst').classList.remove('is-invalid');
    document.getElementById('password-newsecound').classList.remove('is-invalid');
    document.getElementById('password-help').innerHTML = "";

    let password = document.getElementById('password-newfirst').value;
    if(password.length < 8)
    {
        passwordError("Password must be at least 8 characters long.");
        return;
    }

    if(!/\d/.test(password) || !/[a-z]/.test(password) || !/[A-Z]/.test(password))
    {
        passwordError("Password must container at least one upper-, one lowercase character and one number.");
        return 
    }
    var sec = document.getElementById('password-newsecound').value;
    if(password !== sec)
    {
        passwordError("Passwords do not match.");
        return;
    }

    $('#change_password_modal').modal('show');

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

