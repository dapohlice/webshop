import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

/**
 * Überprüft den JWT
 * @param token JWT
 * @returns jwt{loginname,auth} | false (unzureichende Daten)
 * @throws TokenExpiredError | JsonWebTokenError | Error
 */
export function verifyJWT(token)
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