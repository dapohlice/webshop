import * as bcrypt from "bcrypt"

const SALT_ROUNDS = 8;

/**
 * Überprüft ein Passwort nach den Passwort-Richtlinien (mind. 1 Groß, 1 Kleinbuchstabe und eine Zahl und mind. 8 Zeichen lang)
 * @param password Passwort
 * @returns true | false
 */
export function checkPassword(password: string):boolean
{
    return password.match("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}") !== null;
}

/**
 * Erstellt ein zufälliges Passwort mit 12 Zeichen
 * @returns Passwort
 */
export function createRandomPassword():string{
    return Math.random().toString(36).substring(6,12)+Math.random().toString(36).substring(6,12);;
}
/**
 * Hast ein Passwort
 * @param password gehashtes Passwort
 */
export async function hashPassword(password: string):Promise<string>
{
    return await bcrypt.hash(password,SALT_ROUNDS);
}

/**
 * Vergeleicht ein Passwort mit einem Passwort-Hash
 * @param password Passwort
 * @param hash Passwort-Hash
 */
export async function comparePassword(password: string, hash:string)
{  
    let res = await bcrypt.compare(password,hash);
    return res;    
}