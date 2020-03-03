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

    constructor(type,url){
        this.request = new XMLHttpRequest();
        this.data = null;
        this.request.open(type, url);
    }
        
    addRaw(data)
    {
        this.data = data;
        return this;
    }


    addJson(data)
    {
        this.data = JSON.stringify(data);
        this.request.setRequestHeader("Content-Type", "application/json");
        return this;
    }


    onSucces(succesFunction)
    {
        this.succesFunction = succesFunction;
        return this;
    }

    onError(errorFunction)
    {
        this.errorFunction = errorFunction;
        return this;
    }

    onFailure(failureFunction)
    {
        this.failureFunction = failureFunction;
        return this;
    }

    onUnauthorized(failureFunction)
    {
        this.unauthorizedFunction = failureFunction;
        return this;
    }

    send()
    {
        var self = this;

        try{

            this.request.onreadystatechange = function(){
                if(this.readyState == 4)
                {
                    if(this.status == 200)
                    {
                      /*  let auth = this.getResponseHeader("Authentication");
                        setJwtCookie(auth);
                        */
                        var result;
                        if(isJson)
                        {
                            result = JSON.parse(this.responseText);
                            renderHTML(result);
                        }else{
                            result = this.responseText;
                        }
                        if(self.succesFunction !== null)
                        {
                            self.succesFunction(result,this.getAllResponseHeaders());
                        }else{
                            response(result);
                        }
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

            this.request.onerror = function(error){
                console.error("Request ERROR");
                console.error(error);
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
