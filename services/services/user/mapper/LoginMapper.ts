import {getRepository} from "typeorm";
import {UserEntity} from '../entity/UserEntity' 
import {getUserPermission} from './UserMapper' 
import * as Password from "./Password";
import resolve from '../resolver';
import * as fs from 'fs';
import * as path from 'path';
import { sign } from 'jsonwebtoken';
import * as process from 'process';

export async function login(loginname:string, password:string)
{
    const userRep = getRepository(UserEntity)
    let user,err;
    let builder = userRep
        .createQueryBuilder("user")
        .select("user.pword")
        .addSelect("user.id")
        .addSelect("user.loginname")
        .where("user.loginname = :name",{name: loginname});

    [user,err] = await resolve(builder.getOne());
    if(user === undefined)
        return [401,null];
    if(err !== null)
        return [500,null];

    let result = await Password.comparePassword(password,user.pword);    
    if(!result)
        return [401,null];

    const dir = path.join(process.cwd(),'src','jwt','key');

    let privateKey = fs.readFileSync(dir);   

    let auth = getUserPermission(user.id)


    try{
        let token = sign({ name: user.loginname, auth: auth }, privateKey, { algorithm: 'RS256'});   
        return [200,token];
    }catch(error)
    {
        console.log(error);
        return [500,null]; 
    }
    
}