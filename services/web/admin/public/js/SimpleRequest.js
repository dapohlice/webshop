/**
 * Simple XMLHttpRequest Container
 */

class SimpleRequest{
    /**
     * Create Simple Request with Method and url
     * request url = url/path
     * @param {string} type Http-Method 
     * @param {string} url Url
     * @param {string} path Url-Path
     */
    constructor(type,url,path){
        this.request = new XMLHttpRequest();
        this.data = null;
        if(path !== null)
            url+="/"+path;
        this.request.open(type, url,true);
        this.addHeader('Cache-Control', 'no-cache');
    }
    
    static GET(url,path = null)
    {
        return new SimpleRequest("GET",url,path);
    }

    static POST(url,path = null)
    {
        return new SimpleRequest("POST",url,path);
    }

    static PUT(url,path = null)
    {
        return new SimpleRequest("PUT",url,path);
    }

    static DELETE(url,path = null)
    {
        return new SimpleRequest("DELETE",url,path);
    }

    static PATCH(url,path = null)
    {
        return new SimpleRequest("PATCH",url,path);
    }

    /**
     * adds Request data
     * @param {*} data Data
     */
    addRaw(data)
    {
        this.data = data;
        return this;
    }
    
    /**
     * Adds JavascriptObject as Json
     * @param {*} data Javacript-Object 
     */
    addJson(data)
    {
        this.data = JSON.stringify(data);
        this.addHeader("Content-Type", "application/json");
        return this;
    }

    /** 
     * adds Request Header
     * @param {string} key Header-Key
     * @param {string} value Header-Value
     */
    addHeader(key,value)
    {
        this.request.setRequestHeader(key,value);
        return this;
    }
    /**
     * Function for Succes
     * @param {*} successFunction (data,header)
     */
    onSuccess(successFunction)
    {
        this.succesFunction = successFunction;
        return this;
    }
    /**
     * Function for Errors
     * @param {*} errorFunction (error)
     */
    onError(errorFunction)
    {
        this.errorFunction = errorFunction;
        return this;
    }

    /**
     * Function for non 200 Responscodes
     * @param {*} failureFunction (statuscode,statustext,responsText)
     */
    onFailure(failureFunction)
    {
        this.failureFunction = failureFunction;
        return this;
    }
    /**
     * Function for Unauthorized
     * when not set, then failureFunction is called
     * @param {*} unauthorizedFunction (responseText)
     */
    onUnauthorized(unauthorizedFunction)
    {
        this.unauthorizedFunction = unauthorizedFunction;
        return this;
    }

    /**
     * sends Request
     */
    send()
    {
        var self = this;

        try{

            this.request.onreadystatechange = function(){
                if(this.readyState == XMLHttpRequest.DONE)
                {
                    if(this.status == 200 || this.status == 201)
                    {
                      /*  let auth = this.getResponseHeader("Authentication");
                        setJwtCookie(auth);
                        */
                        var result;
                        if(this.getResponseHeader('content-type').startsWith("application/json"))
                        {
                            result = JSON.parse(this.responseText);
                        }else{
                            result = this.responseText;
                        }
                        if(self.succesFunction !== null)
                        {
                            self.succesFunction(result,this.getAllResponseHeaders());
                        }else{
                            response(result);
                        }
                    }else{
                        if(this.status == 401){
                            if(self.unauthorizedFunction != null)
                            {
                                self.unauthorizedFunction(this.responseText);
                                return;
                            }
                        console.warn("Request failed: "+this.statusText);

                        if(self.failureFunction != null)
                            self.failureFunction(this.status,this.statusText,this.responseText);        
                        }
                    }
                }
            }
            
            this.request.onerror = function(error){
                console.error("Request ERROR");
                console.error(error);
                if(self.errorFunction != null)
                {
                    self.errorFunction(error);
                }
                    
            }


            var jwt = getJwtCookie();

            if(jwt != null)
            {
                this.addHeader("Authorization",`Bearer ${jwt}`);
            }



            if(this.data == null)
                this.request.send();
            else
                this.request.send(this.data);

        }catch(error)
        {
            console.error("Error: ");
            console.error(error);
            throw error;
        }
    }

}
