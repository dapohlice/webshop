
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

class PrettyLog
{
    user: string;
    info: string;
    timestamp: Date;
    status: string;
}

            

export function PrettiefyArticle(article):PrettyArticle
{
    console.log(article);

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

export function PrettiefyArticles(articles)
{
    let result = [];
    articles.forEach(article => {
        result.push(PrettiefyArticle(article))
    });
    return result;
}


export function PrettiefyLog(log):PrettyLog
{
    let result = new PrettyLog();
    result.user = log.user;
    result.info = log.info;
    result.status = log.status.name;
    result.timestamp = log.timestamp;
    return result;
}

export function PrettiefyLogs(logs)
{
    let result = [];
    logs.forEach(log => {
        result.push(PrettiefyLog(log))
    });
    return result;
}
