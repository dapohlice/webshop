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


class PRequest{

    constructor(){
        this.request = new XMLHttpRequest();
        this.data = null;
    }


    GET(url){
        this.request.open("GET", url);
        return this;
    }

    POST_FORMDATA(url,data)
    {
      this.request.open("POST", url);
      this.data = data;
      return this;
    }

    POST(url){
        this.request.open("POST", url);
        this.request.setRequestHeader("Content-Type", "application/json");
        return this;
    }

    PUT(url){
        this.request.open("PUT", url);
        this.request.setRequestHeader("Content-Type", "application/json");
        return this;
    }

    DELETE(url){
        this.request.open("DELETE", url);
        return this;
    }

    addData(data)
    {
        this.data = JSON.stringify(data);
    }


    onSucces(succesFunction)
    {
        this.succesFunction = succesFunction;
    }

    onError(errorFunction)
    {
        this.errorFunction = errorFunction;
    }

    onFailure(failureFunction)
    {
        this.failureFunction = failureFunction;
    }

    onUnauthorized(failureFunction)
    {
        this.unauthorizedFunction = failureFunction;
    }

    send(isJson)
    {
        var self = this;

        try{

            this.request.onreadystatechange = function(){
                if(this.readyState == 4)
                {
                    if(this.status == 200)
                    {
                        let auth = this.getResponseHeader("Authentication");
                        setJwtCookie(auth);

                        var result;
                        if(isJson)
                        {
                            result = JSON.parse(this.responseText);
                        }else{
                            result = this.responseText;
                        }
                        self.succesFunction(result,this.getAllResponseHeaders());

                    }else if(this.status == 401){
                      if(self.unauthorizedFunction != null)
                          self.unauthorizedFunction(this.responseText);
                    }else{
                        console.warn("Request failed: "+this.statusText);

                        if(self.failureFunction != null)
                            self.failureFunction(this.status,this.responseText);
                    }
                }
            }

            this.request.onerror = function(){
                console.error("Request ERROR");
            }


            var jwt = getJwtCookie();

            if(jwt != null)
            {
                this.request.setRequestHeader("Authorization",`Bearer ${jwt}`);
            }



            if(this.data == null)
                this.request.send();
            else
                this.request.send(this.data);

        }catch(error)
        {
            console.error("Error: "+error);
        }
    }

}
