/**
 * Fängt eine Exception einer async Funktion ab und gibt die Fehlermeldung oder die Rückgabe zurück
 * @param promise Promise Rückgabe von einer asnyc Funktion
 * @returns [data,error]
 */
export default function resolve(promise:Promise<any>)
{
    return promise.then(data => {return [data,null]})
    .catch(err =>
        {
            console.error(err);
            return [null,err]
        });
}