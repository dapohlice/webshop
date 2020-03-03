function setJwtCookie(auth){
    console.log(`Auth Cookie ${auth}`);
    if(auth != null)
    {
        var d = new Date();
        d.setTime(d.getTime() + (3500000));
        document.cookie = `jwt=${auth};expires=${d.toUTCString()};path=/`;
    }
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
  }

function getJwtCookie(){
    var jwt = getCookie("jwt");
    return jwt;
}

function deleteCookie(name){
    document.cookie = name+"= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
}

function deleteJwt(){
    deleteCookie("jwt");
}

