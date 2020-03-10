var selectedArticle = null;
var selectedProperty = null;



function openArtilce(art){
    selectedArticle = art;
    document.getElementById('article-detail-img').src = PICTURE_SERVICE+"/"+art.picturepath;
    document.getElementById('article-detail-name').innerText = art.name;
    document.getElementById('article-detail-description').innerText = art.description;

    document.getElementById('price-first').innerText = Math.floor(art.price/100);
    document.getElementById('price-last').innerText = art.price%100;

    var options = document.getElementById('artilce-select-options');

    while (options.firstChild) {
        options.removeChild(options.lastChild);
    }

    for(var i = 0; i < art.propertys.length; i++)
    {
        if(i === 0)
        {
            document.getElementById('artilce-select-btn').innerText = art.propertys[i].property;
            selectedProperty = art.propertys[i];
        }
        var li = document.createElement('li');
        li.setAttribute('article_id',art._id);
        li.setAttribute('property_id',art.propertys[i]._id);
        li.setAttribute('property_value',art.propertys[i].property);
        li.addEventListener('click',chooseProperty);

        var a = document.createElement('a');
        a.setAttribute('article_id',art._id);
        a.setAttribute('property_id',art.propertys[i]._id);
        a.setAttribute('property_value',art.propertys[i].property);
        a.addEventListener('click',chooseProperty);

        a.innerText = art.propertys[i].property;
        li.appendChild(a);
        options.appendChild(li);
    }

    document.getElementById('article-modal').classList.remove('article-modal-invisible')
}

function chooseProperty(e)
{
    e.stopPropagation();
    var text = e.target.getAttribute("property_value");
    document.getElementById('artilce-select-btn').innerText = text;
    document.getElementById('artilce-select-options').classList.add('artilce-select-options-invisble')
   
    var art_id = e.target.getAttribute("article_id");
    var prop_id = e.target.getAttribute("property_id");
    selectedArticle = articles.get(art_id);
    for(var i =0; i < selectedArticle.propertys.length; i++)
    {
        if(selectedArticle.propertys[i]._id === prop_id)
        {
            selectedProperty = selectedArticle.propertys[i];
            break;
        }
    }
}

function closeArticle(){
    document.getElementById('article-modal').classList.add('article-modal-invisible')
}

document.getElementById('article-container-close').addEventListener('click',function(e){
    closeArticle();
})

document.getElementById('article-container').addEventListener('click',function(e){
   /* e.stopPropagation();*/
})

document.getElementById('article-modal').addEventListener('click',function(e){
   /* closeArticle();*/
})

document.getElementById('artilce-select-btn').addEventListener('click',function(e){
    e.stopPropagation();
    document.getElementById('artilce-select-options').classList.toggle('artilce-select-options-invisble')
})

document.getElementById('article-add-cart').addEventListener('click',function(e){
    e.stopPropagation();
    addArticle(selectedArticle,selectedProperty);
    closeArticle();
})

