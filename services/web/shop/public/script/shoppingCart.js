var shoppingCart = [];

function addArticle(article,property){
    shoppingCart.push({
        article: article,
        property: property,
        amount: 1,
    });
    createShoppingCartTable();
}

function toggleShoppingCart()
{
    var cart = document.getElementById('shoppingCart-Container');
    cart.classList.toggle("shoppingCart-UnVisible");
    cart.classList.toggle("shoppingCart");
}

document.getElementById("shoppingCart-Close").addEventListener("click", toggleShoppingCart);

function incrementAmount(index)
{
    console.log(index);
    
    var record = shoppingCart[index];
    if(record === undefined)
        return;
    record.amount++;
    createShoppingCartTable();
}

function decrementAmount(index)
{
   
    var record = shoppingCart[index];
    if(record === undefined || record.amount <= 0)
        return;
    record.amount--;
    createShoppingCartTable();
}

function removeArticle(index)
{
    console.log(index);
    
    shoppingCart.splice(index,1);
    createShoppingCartTable();
}

function createTableHeader(content)
{
    var header = document.createElement("TR");
    
    for(var i = 0; i< content.length; i++)
    {
        var th = document.createElement("TH");
        th.innerHTML = content[i];
        header.appendChild(th);
        header.classList.add("shoppingCart-table-center");
    }
    return header;
}

function createTableRecord(cartItem,index)
{   
    var record = document.createElement('TR');
    
    var name = document.createElement('TD');
    var name_content = document.createElement("SPAN");
    name_content.setAttribute("list_index",index);
    name_content.innerHTML = cartItem.article.name + " " + cartItem.property.property;
    var btn_delete = document.createElement("BUTTON")
    btn_delete.classList.add("fas");
    btn_delete.classList.add("fa-trash");
    btn_delete.setAttribute("list_index",index);
    btn_delete.addEventListener("click",function(e){
        var i = e.srcElement.getAttribute("list_index");
        removeArticle(i);
    });
    name.appendChild(btn_delete);
    name.appendChild(name_content);
    record.appendChild(name);
    
    
    
    var price = document.createElement('TD');
    price.innerHTML = cartItem.article.price/100+" $";
    price.classList.add("shoppingCart-table-price")
    record.appendChild(price);

    var amount = document.createElement('TD');
    var inc_amount = document.createElement('BUTTON');
    var inc_sym = document.createElement("I");
    inc_sym.classList.add("fas");
    inc_sym.classList.add("fa-plus-square");
    inc_sym.classList.add("fas");
    inc_sym.setAttribute("list_index",index);
    inc_amount.appendChild(inc_sym);
    inc_amount.setAttribute("list_index",index);
    inc_amount.addEventListener("click", function(e){
        var i = e.srcElement.getAttribute("list_index");
        
        incrementAmount(i);
    });
    var dec_amount = document.createElement('BUTTON');
    var dec_sym = document.createElement("I");
    dec_sym.classList.add("fas");
    dec_sym.classList.add("fa-minus-square");
    dec_sym.classList.add("fas");
    dec_sym.setAttribute("list_index",index);
    dec_amount.appendChild(dec_sym);
    dec_amount.setAttribute("list_index",index);
    dec_amount.addEventListener("click", function(e){
        var i = e.srcElement.getAttribute("list_index");
        decrementAmount(i);
    });
    var text_amount = document.createElement('span');
    text_amount.innerHTML =  cartItem.amount;
    amount.appendChild(dec_amount);
    amount.appendChild(text_amount);
    amount.appendChild(inc_amount);
    amount.classList.add("shoppingCart-table-center");
    amount.classList.add("shoppingCart-table-amount");
    record.appendChild(amount);

    var total = cartItem.article.price * cartItem.amount;

    var total_rec = document.createElement('TD');
    total_rec.innerHTML = total/100+" $";
    total_rec.classList.add("shoppingCart-table-price")

    record.appendChild(total_rec);
    

    return [record,total];
}

function createShoppingCartTable()
{
    var div = document.getElementById('shoppingCart-Content');

    var table = document.createElement("TABLE");
    table.appendChild(createTableHeader(["Name","Price","Amount","Total"]));
    
    var record,price;
    var total = 0;
    for(var i = 0; i < shoppingCart.length; i++)
    {
        [record,price] = createTableRecord(shoppingCart[i],i);
        total += price;
        table.appendChild(record);
    }

    document.getElementById('shoppingCart-Total-Amount').innerHTML = total/100;
    
    while (div.firstChild) div.removeChild(div.firstChild);
    div.appendChild(table);
}



createShoppingCartTable();

document.getElementById("shoppingCart-btn").addEventListener("click", toggleShoppingCart);