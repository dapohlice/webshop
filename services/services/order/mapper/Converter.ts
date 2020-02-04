/**
 * Klasse für die Rückgabe der wesentlichen Daten von Artikeln
 */
class PrettyArticle
{
    amount: number;
    property: string;
    name: string;
    price: number;
    total: number;
    subarticle_id: number;
    article_id: number;
    mapping_id: number;   
}
/**
 * Klasse für die Rückgabe von wesentlichen Daten eines Artikellogs
 */
class PrettyLog
{
    user: string;
    info: string;
    timestamp: Date;
    status: string;
}

            
/**
 * Erstellt eine verkürzte Version eines Artikels mit den wesentlichen Informationen
 * @param article Artikeldatensatz
 * @returns Wesentliche Daten eines Artikeldatensatzes
 */
export function PrettiefyArticle(article):PrettyArticle
{
    let result = new PrettyArticle();
    result.amount = article.amount;
    result.property = article.property;
    result.name = article.article.name;
    result.price = article.article.price;
    result.total = article.article.price * article.amount;
    result.subarticle_id = article.article.id;
    result.article_id = article.article.article_id;
    result.mapping_id = article.id;
    return result;
}

/**
* Erstellt eine verkürzte Version mehrerer Artikel mit den wesentlichen Informationen
 * @param articles Artikeldatensätze
 * @returns Wesentliche Daten von Artikeldatensätzen
 */
export function PrettiefyArticles(articles)
{
    let result = [];
    articles.forEach(article => {
        result.push(PrettiefyArticle(article))
    });
    return result;
}

/**
 * Erstellt eine verkürzte Version eines Artikellogs mit den wesentlichen Informationen
 * @param log Artikellogdatensatz 
 * @returns Wesentliche Daten eines Artikellogdatensatzes
 */
export function PrettiefyLog(log):PrettyLog
{
    let result = new PrettyLog();
    result.user = log.user;
    result.info = log.info;
    result.status = log.status.id;
    result.timestamp = log.timestamp;
    return result;
}

/**
 * Erstellt eine verkürzte Version mehrerer Artikellogs mit den wesentlichen Informationen
 * @param articles Artikellogdatensätze
 * @returns Wesentliche Daten von Artikellogdatensätzen
 */
export function PrettiefyLogs(logs)
{
    let result = [];
    logs.forEach(log => {
        result.push(PrettiefyLog(log))
    });
    return result;
}


export function PrettiefyOrder(order)
{
    return {
        id: order.id,
        mail: order.mail,
        timestamp: order.timestamp,
        status: order.status.id
    }
}


export function PrettiefyOrders(orders)
{
    let result = [];
    orders.forEach(order => {
        result.push(PrettiefyOrder(order))
    });
    return result;
}