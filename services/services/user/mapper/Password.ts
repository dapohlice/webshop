import * as bcrypt from "bcrypt"

const SALT_ROUNDS = 8;


export function checkPassword(password: string):boolean
{
    return true;
}

export function createRandomPassword():string{
    return Math.random().toString(36).substring(6,12)+Math.random().toString(36).substring(6,12);;
}

export async function hashPassword(password: string):Promise<string>
{
    return await bcrypt.hash(password,SALT_ROUNDS);
}

export async function comparePassword(password: string, hash:string)
{  
    console.log(password,hash);
    let res = await bcrypt.compare(password,hash);
    return res;    
}