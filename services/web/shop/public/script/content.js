function openArticleFromPreview(event)
{
    event.preventDefault();
    console.log(event.target);
    var index = event.target.getAttribute("article_id");
    console.log("click art "+index);
    var art = articles.get(index);

    openArtilce(art);
}

function createPreviewArticle(article)
{
    var card = document.createElement("div");
    card.classList.add("card");
    card.classList.add('article-card');
    card.classList.add("bg-light");

    var img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = PICTURE_SERVICE+"/"+article.picturepath;
    img.addEventListener('click',openArticleFromPreview)
    img.setAttribute('article_id',article._id);

    var card_body = document.createElement("div");
    card_body.classList.add("card-body");
    
    var title = document.createElement("a");
    title.classList.add("card-title");
    title.addEventListener('click',openArticleFromPreview)
    title.setAttribute('article_id',article._id);
    title.innerText = article.name;
    
    var text = document.createElement("p");
    text.classList.add("card-text");
    text.innerText = article.description;

    card_body.appendChild(title);
    card_body.appendChild(text);

    var card_footer = document.createElement("div");
    card_footer.classList.add("card-body");

    var card_footer = document.createElement("div");
    card_footer.classList.add("card-body");


    var price = document.createElement("span");
    price.classList.add("price");
    price.innerText = article.price/100+" $"

    card_footer.appendChild(price)


    card.appendChild(img);
    card.appendChild(card_body);
    card.appendChild(card_footer);

    return card;
}

function changeCategorie(index)
{
    if(categories === null)
        return;

    var cat = categories[index];

    document.getElementById('category-img').src = PICTURE_SERVICE+"/"+cat.picturepath;

    var cats = document.getElementsByClassName("category-item");
    
    for(var i = 0; i < cats.length; i++)
    {
        if(cats[i].id === "categorie_id-"+index)
        {
            cats[i].classList.add("category-item-selected");
        }else{
            cats[i].classList.remove("category-item-selected");
        }
    }



    var el_art = document.getElementById('articles');


    while (el_art.firstChild) {
        el_art.removeChild(el_art.lastChild);
    }

    for(var art of articles.values())
    {
        if(art.categoryid === cat._id)
        {
            var element = createPreviewArticle(art);
            el_art.appendChild(element);
        }
    }
}
