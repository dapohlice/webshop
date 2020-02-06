const jwt = require('jsonwebtoken');
const fs = require('fs');

/**
 * Überprüft den JWT
 * @param token JWT
 * @returns jwt{loginname,auth} | false (unzureichende Daten)
 * @throws TokenExpiredError | JsonWebTokenError | Error
 */
function verifyJWT(token)
{
    let publicKey = fs.readFileSync(__dirname+'/key.pub');
    try{
        let res = jwt.verify(token, publicKey, { algorithms: ['RS256'],maxAge: "3h" });
        if(
            res === undefined ||
            res.name === undefined|| 
            res.auth === undefined||
            res.auth.auth_user === undefined||
            res.auth.auth_product === undefined||
            res.auth.auth_group === undefined||
            res.auth.auth_normalOrders === undefined||
            res.auth.auth_allOrders === undefined
        )
            return false;
        return res;
    }catch(err)
    {
        throw err;
    }
} 


/**
 * Verarbeitet einen JWT-Token
 * @param {*} auth Authentication-Header aus Request
 * @returns [StatusCode,JWT-Data]
 *   - [200,JWT]: JWT-Token Verifiziert 
 *   - [401,null]: Daten sind falsch
 *   - [401,"Expired"]: JWT-Token ist abgelaufen
 *   - [500,null]: Fehler
 */
function processJWT(auth)
{
    if(auth === undefined)
        return [401,null];
    
    let token_list = auth.split(' ');
    if(token_list.length !== 2)
        return [401,null];
    
    try{
        let jwt = verifyJWT(token_list[1]);
        if(jwt === false)
            return [401,null]
        return [200,jwt];
    }catch(err)
    {
        if(err.name === "JsonWebTokenError")
        {
            return [401,null]
        }
        else if(err.name ==="TokenExpiredError")
        {
            return [401,"Expired"];
        }else{
            console.error(err);
            return [500,null];
        }
    }
}

exports.processJwt = processJWT;