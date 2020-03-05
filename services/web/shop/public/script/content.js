function changeCategorie(index)
{
    if(categories === null)
        return;

    var cat = categories[index];

    var cur_art = [];

    var el_art = document.getElementById('articles');


    while (el_art.firstChild) {
        el_art.removeChild(el_art.lastChild);
    }

    for(var i = 0; i < articles.length; i++)
    {
        if(articles[i].category === cat._id)
            cur_art.push(articles[i]);
    }

    console.log('current');
    console.log(cur_art);

    for(var i = 0; i < cur_art.length; i++)
    {

    }
}