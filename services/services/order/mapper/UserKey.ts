/**
 * Klasse für die Zuordnung von Bestellungen
 */
class OrderMapping{
    /**
     * Bestellungs-Id
     */
    id: number;
    /**
     * Erstellzeitpunkt
     */
    timestamp: Date;
    
    /**
     * Konstruktor
     * @param id Bestellungs-Id
     */
    constructor(id: number)
    {
        this.id = id;
        this.timestamp = new Date;
    }
}


/**
 * Zeit in der das Mapping überprüft wird in Millisekunden
 */
const KEY_REFRESH_TIME = 300000;
/**
 * Lebensspanne eines Mappings in Millisekunden
 */
const KEY_LIFESPAN = 600000;

/**
 * Map für die Zuweisung von User_Keys und Bestellungen
 */
var customerOrderMap: Map<string,OrderMapping> = new Map<string,OrderMapping>();

/**
 * Interval in der die customerOrderMap überprüft wird und abgelaufene Bestellungen gelöscht werden
 */
let checkCustomerOrderInterval = setInterval(check, KEY_REFRESH_TIME);

/**
 * Stoppt die Überprüfung von customOrderMap
 */
function stopFunction() {
    clearInterval(checkCustomerOrderInterval);
}

/**
 * Überprüft ein User_Key Bestellungsmapping auf den Ablaufzeitpunkt
 * @param mapping Bestell-Mapping
 * @param time Aktueller Zeitpunkt
 * @returns false: Abgelaufen | true: Gültig
 */
function checkMapping(mapping: OrderMapping, time: Date): boolean
{
    let diff = time.getTime() - mapping.timestamp.getTime();    

    if(diff > KEY_LIFESPAN)
    {
        return false;
    }
    return true;
}

/**
 * Überprüft alle Bestellungsmappings und löscht Abgelaufene
 */
function check(){
    let now = new Date();

    console.log("Check UserKeys");

    customerOrderMap.forEach(async (value,key)=>{
        if(!checkMapping(value,now))
        {
            console.log("Delete UserKey: "+key);
            customerOrderMap.delete(key);
        }
    });

}

/**
 * Gibt die Bestellungs-Id für einen UserKey zurück
 * @param userkey User_key
 * @returns Bestell-Id | undefined
 */
export function getOrder(userkey: string): number
{
    let mapping = customerOrderMap.get(userkey);
    if(mapping === undefined)
        return undefined;

    if(!checkMapping(mapping,new Date()))
    {
        return undefined;
    }

    customerOrderMap.delete(userkey);
    return mapping.id;
}

/**
 * Fügt eine neue Bestellung für die User_Key verwaltung hinzu
 * @param orderId Betstellungs-Id
 * @returns user_key
 */
export function addOrder(orderId: number):string
{
    let mapping = new OrderMapping(orderId) 
    let userkey;
    do{
        userkey = Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15);
    }while(customerOrderMap.has(userkey));

    customerOrderMap.set(userkey,mapping);

    return userkey;
}