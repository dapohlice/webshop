function hideall(){
    document.getElementById('article-modal').classList.add('unvisible');
    document.getElementById('order-container').classList.add('unvisible');
    document.getElementById('content-container').classList.add('unvisible');
    document.getElementById('submitorder-container').classList.add('unvisible');
    document.getElementById('thanks').classList.add('unvisible');
}

function showArticle(){
    hideall();
    document.getElementById('article-modal').classList.remove('unvisible');
}

function showOrder(){
    hideall();
    document.getElementById('order-container').classList.remove('unvisible');
}
function showSubmitOrder(){
    hideall();
    document.getElementById('submitorder-container').classList.remove('unvisible');
}

function showContent(){
    hideall();
    document.getElementById('content-container').classList.remove('unvisible');
}
function showThanks(){
    hideall();
    document.getElementById('thanks').classList.remove('unvisible');
}

document.getElementById('logo-button').addEventListener('click',function (e){
    e.stopPropagation();
    showContent();
})