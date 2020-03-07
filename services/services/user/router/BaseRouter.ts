import {Router} from "express";
import * as JWT from "../jwt/verify"
/**
 * Basisrouter für Express in Typescript
 */
export abstract class BaseRouter{
    protected router: Router;
    protected jwt;
    /**
     * Konstruktor
     * @param checkJWT solle auf ein JWT-Token geprüft werden
     */
    constructor(checkJWT = false){
        this.router = Router();
        if(checkJWT)
            this.router.use(this.checkJWT);
        this.jwt = null;
        this.initialiseRouter();
    }

    /**
     * erstellt den express Router
     */
    abstract initialiseRouter():void;

    /**
     * gibt den express Router zurück
     */
    getRouter():Router{
        return this.router;
    }
    /**
     * Überprüft den JWT-Token
     * Speichert den JWT-Token in req.jwt
     * @param req 
     * @param res 
     * @param next 
     */
    checkJWT(req,res,next){
        
        let auth = req.get('Authorization');
        let status, jwt;
        [status,jwt] = JWT.processJwt(auth);
        if(status === 200)
        {
            req.jwt = jwt;
            next();
        }else{
            res.status(status);
            if(status === 401 || jwt !== null)
            {
                res.send(jwt);
            }else{
                res.send();
            }
            
        }     
    }
}