const userservice = 'http://localhost:3003';
const adminservice = 'http://localhost:3010';

function setJwtCookie(auth){
    console.log(`Auth Cookie ${auth}`);
    if(auth != null)
    {
        var d = new Date();
        d.setTime(d.getTime() + (3500000));
        document.cookie = `jwt=${auth};expires=${d.toUTCString()};path=/`;
    }
}


document.getElementById('signin').addEventListener("submit", function(e)
{
    e.preventDefault();
    var name = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var xhr = new XMLHttpRequest();

    xhr.open('POST',userservice+"/login");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function(){
        if(this.readyState == 4)
        {
            if(this.status == 200)
            {
                setJwtCookie(this.responseText);
                window.open(adminservice,"_top");
            }else if(this.status == 401){
                document.getElementById('form-signin-error').innerHTML = "Username or Password are wrong.";
            }else{
                document.getElementById('form-signin-error').innerHTML = "Something went wrong please contact the Administrator";
            }
        }
    }

    xhr.onerror = function(){
        document.getElementById('form-signin-error').innerHTML = "Network failure";
    }

    xhr.send(JSON.stringify(
        {
            "loginname":name,
            "password":password
        }
    ));
    return false;
});