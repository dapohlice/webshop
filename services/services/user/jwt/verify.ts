import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

export function verify(token)
{
    let publicKey = fs.readFileSync(__dirname+'/key.pub');
    let res = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
    console.log(res);
    return res;
} 