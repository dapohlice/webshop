document.getElementById('login-form').onsubmit = function(e)
{
    e.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    var req = new XMLHttpRequest();
    req.open('POST',"http://localhost:3003/user/login");
    req.data = JSON.stringify({
        "loginname":username,
        "password":password
    });
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = function(){
        if(this.readyState == 4)
        {
            if(this.status == 200)
            {
                setJwtCookie(this.responseText);
            }else if(this.status == 401){
                document.getElementById('login-failure').innerHTML = "Wrong Password or Username";
            }else{
                document.getElementById('login-failure').innerHTML = "Something went wrong, contact the Administrator";
            }
        }
    }
}