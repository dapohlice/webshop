import {getRepository} from "typeorm";
import {ArticleEntity} from '../entity/ArticleEntity' 
import { OrderEntity } from "../entity/OrderEntity";
import { ArticleOrderEntity } from "../entity/ArticleOrderEntity";
import * as ProductServiceMapper from "../mapper/ProductServiceMapper";

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
    let id = parseInt(article.productid);
    if((!price && isNaN(price)) || !article.name || (!id && isNaN(id)))
        return undefined;
    
    let entity = new ArticleEntity();
    entity.price = price;
    entity.article_id = id;
    entity.name = article.name;
    return entity.save();    
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

    let status,product;
    [status,product] = await ProductServiceMapper.getProduct(articleId);
   
    if(status !== 200)
    {
        return undefined;  
    }

    let article = await getRepository(ArticleEntity)
                    .createQueryBuilder("article")
                    .where("article.article_id = :id",{id: articleId})
                    .orderBy("article.timestamp")
                    .take(1)
                    .getOne();
    
    
    if(article == undefined || product.timestamp > article.timestamp)
    {
        article = await createArticle(product);
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
        return {
            state: "article not found."
        };
    
    let amount = parseInt(article.amount);
    let articleId = parseInt(article.articleId);
    let subarticleId = parseInt(article.subarticleId);
    
    if(isNaN(amount) || isNaN(articleId) || isNaN(subarticleId))
        return {
            state: "article not found."
        };

    let article_entitiy = await getArticle(articleId);
    if(article_entitiy === undefined)
    {
        return {
            state: "article not found."
        };
    }    
    let status,subarticle;
    [status,subarticle] = await ProductServiceMapper.reserveSubProdukt(articleId,subarticleId,amount);
    if(status !== 200 || subarticle === undefined )
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



