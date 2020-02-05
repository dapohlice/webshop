import {Router} from "express";
import {verifyJWT} from "../jwt/verify"
/**
 * Basisrouter für Express in Typescript
 */
export abstract class BaseRouter{
    protected router: Router;
    protected jwt;

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
        console.log("get Router");
        return this.router;
    }

    checkJWT(req,res,next){
        try{
            let token = req.get('Authorization');
            token = req.get('Authorization').split(' ')[1];
            let jwt = verifyJWT(token);
            if(jwt === false)
            {
                res.sendStatus(401)
                return;
            }
            req.jwt = jwt;
            next();
        }catch(err)
        {
            console.error(err);
            if(err.name === "JsonWebTokenError")
            {
                res.sendStatus(401)
            }
            else if(err.name ==="TokenExpiredError")
            {
                res.sendSatus(401);
                res.send("Expired");
            }else{
                console.error(err);
                res.sendStatus(500);
            }
            
        }
    }

    getJwt(){
        return this.jwt;
    }
}