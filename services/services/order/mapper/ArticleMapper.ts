import {getRepository} from "typeorm";
import {ArticleEntity} from '../entity/ArticleEntity' 
import { OrderEntity } from "../entity/OrderEntity";
import { ArticleOrderEntity } from "../entity/ArticleOrderEntity";

/**
 * Erstellt einen neuen Artikel
 * @param article Artikel
 * @returns Erstellten Artikel | undefined
 */
export async function createArticle(article)
{
    if(article === undefined)
        return undefined;

    let price = parseInt(article.price);
    let id = parseInt(article.article_id);
    if((!price && isNaN(price)) || !article.name || (!id && isNaN(id)))
        return undefined;
    
    let entity = new ArticleEntity();
    entity.price = price;
    entity.article_id = id;
    entity.name = article.name;
    return entity.save();    
}

/**
 * Ruft einen Produktdatensatz von dem enstrechenden Service ab
 * @param articleId Artikel Id
 * @returns Produktdatensatz | undefined 
 */
async function getProduct(articleId: number)
{
    return {
        article_id: 1,
        name: "T-Shirt",
        timestamp: new Date("2019-01-19"),
        price: 1200
    }
}

/**
 * Ruft einen Unterartikeldatensatz von dem entrechenden Service ab
 * @param subarticleId Unterartikeldatensatz
 * @param amount Anzahl des gekauften Unterartikels
 * @returns Unterdatensatz mit der Reservierten Anzahl | undefined
 */
async function getSubarticle(subarticleId: number, amount: number)
{
    return {
        subarticle_id: 1,
        amount: amount,
        property: "M"
    }
}

/**
 * Gibt einen Artikeldatensatz zurück
 *  sollte dieser nicht vorhanden sein, so wird dieser von dem entsprechenden Service abgerufen
 * @param articleId Artikel-Id
 * @returns Artikeldatensatz | undefined
 */
async function getArticle(articleId: number):Promise<ArticleEntity>
{
    if(isNaN(articleId) || articleId === undefined)
        throw new Error(`${articleId} ist not a number`);
    let o_product = await getProduct(articleId)
    let article = await getRepository(ArticleEntity)
                    .createQueryBuilder("article")
                    .where("article.article_id = :id",{id: articleId})
                    .orderBy("article.timestamp")
                    .take(1)
                    .getOne();
    
    
    if(o_product === undefined)
        return undefined;

    if(article == undefined || o_product.timestamp > article.timestamp)
    {
        article = await createArticle(o_product);
    }
    return article;
}

/**
 * Fügt einen Article mit Unterartikel einer Bestellung hinzu
 * @param article {amount, articleId, subarticleId}
 * @param order Bestellung
 * @return Übersicht der Erstellten Daten | undefined
 */
export async function addArticle(article, order: OrderEntity)
{

    // TODO: bessere Rückgabe bei nicht möglichem Erstellen 
    if(article === undefined)
        return undefined;
    
    let amount = parseInt(article.amount);
    let articleId = parseInt(article.articleId);
    let subarticleId = parseInt(article.subarticleId);
    
    if(isNaN(amount) || isNaN(articleId) || isNaN(subarticleId))
        return undefined;
    

    let article_entitiy = await getArticle(articleId);
    if(article === undefined)
        return undefined;

    let subarticle = await getSubarticle(subarticleId,amount);
    if(subarticle === undefined )
        return undefined;

    let orderarticle = new ArticleOrderEntity();
    orderarticle.amount = subarticle.amount;
    orderarticle.article =  article_entitiy;
    orderarticle.order = order;
    orderarticle.property = subarticle.property;

    let db_result = await orderarticle.save();
    if(db_result === undefined)
        return undefined;
    
    let result = {
        amount:  orderarticle.amount,
        property: orderarticle.property,
        name:  article_entitiy.name,
        price:  article_entitiy.price,
        total:  article_entitiy.price * orderarticle.amount
    }
    return result;
}



