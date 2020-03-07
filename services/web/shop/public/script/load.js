const PRODUCT_SERVICE = 'http://localhost:3002'
const PICTURE_SERVICE = 'http://localhost:3004'

var articles = null;
var categories = null;

SimpleRequest.GET(PRODUCT_SERVICE,'article')
.onSuccess(function(data){
    articles = data;
    console.log(articles);
})
.send();

SimpleRequest.GET(PRODUCT_SERVICE,'category')
.onSuccess(function(data){
    categories = data;
    console.log(categories);
    var cat = document.getElementById('categories');

    while (cat.firstChild) {
        cat.removeChild(cat.lastChild);
    }

    for(var i = 0; i < categories.length; i++)
    {
        var tmp = document.createElement('a');
        tmp.classList.add('category-item');
        tmp.addEventListener('click',function(e){
            e.preventDefault();
            console.log(e.target);
            var index = e.target.getAttribute("categorie_id");
            console.log("click cat "+index);
            changeCategorie(index);
        })
        tmp.setAttribute('categorie_id',i);
        tmp.id = "categorie_id-"+i;
        tmp.innerHTML = categories[i].categoryname;
        cat.appendChild(tmp);
    }
})
.send();