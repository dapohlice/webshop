const ORDER_SERVICE = "http://localhost:3001";

var user_key = null;

document.getElementById('order-form').addEventListener("submit", (e) => {
  e.preventDefault()
  
  var email = document.getElementById('email').value
  var fname = document.getElementById('fname').value
  var lname = document.getElementById('lname').value
  var street = document.getElementById('street').value
  var streetnum = document.getElementById('streetnum').value
  var postcode = document.getElementById('post').value
  var town = document.getElementById('town').value
  var state = document.getElementById('state').value
  var country = document.getElementById('country').value

  var articles = [];
  for(var i = 0; i < shoppingCart.length; i++)
  {
    articles.push({
      articleId: shoppingCart[i].article.productid,
      subarticleId: shoppingCart[i].property.subid,
      amount: shoppingCart[i].amount
    });
  }

  var data = {
    mail: email,
    address: {
      firstname:fname,
      lastname: lname,
      street: street,
      streetnumber: streetnum,
      plz:postcode,
      town:town,
      state: state,
      country:country,
    },
    articles: articles
  }
  SimpleRequest.POST(ORDER_SERVICE,"customer/createOrder")
  .onSuccess(function(data){
    user_key = data.user_key
    
    document.getElementById('record-data-mail').innerText = data.mail; 
    document.getElementById('record-data-fname').innerText = data.address.firstname; 
    document.getElementById('record-data-lname').innerText = data.address.lastname; 
    document.getElementById('record-data-street').innerText = data.address.street; 
    document.getElementById('record-data-number').innerText = data.address.streetnumber; 
    document.getElementById('record-data-code').innerText = data.address.plz; 
    document.getElementById('record-data-town').innerText = data.address.town; 
    document.getElementById('record-data-state').innerText = data.address.state; 
    document.getElementById('record-data-country').innerText = data.address.country; 
    
    var tablediv = document.getElementById('record-articles');
    
    while (tablediv.firstChild) {
      tablediv.removeChild(tablediv.lastChild);
    }
    
    var table = document.createElement("table");
    table.classList.add("table");
    var header = document.createElement('tr');
    var h_name = document.createElement('th');
    h_name.innerText="Name"
    header.appendChild(h_name)

    var h_amount = document.createElement('th');
    h_amount.innerText = "Amount"
    header.appendChild(h_amount)

    var h_price = document.createElement('th');
    h_price.innerText = "Price"
    header.appendChild(h_price)

    var h_total = document.createElement('th');
    h_total.innerText = "Total"
    header.appendChild(h_total)
    table.appendChild(header);

    var total = 0;

    for(var i = 0; i < data.articles.length; i++)
    {
      if(data.articles[i].state === undefined)
      {
        var row = document.createElement('tr');
        var d_name = document.createElement('td');
        d_name.innerText=data.articles[i].name +" "+data.articles[i].property
        row.appendChild(d_name)
    
        var d_amount = document.createElement('td');
        d_amount.innerText = data.articles[i].amount
        row.appendChild(d_amount)
    
        var d_price = document.createElement('td');
        d_price.innerText = data.articles[i].price/100 + " $"
        row.appendChild(d_price)
    
        var d_total = document.createElement('td');
        d_total.innerText = data.articles[i].total/100+" $"
        row.appendChild(d_total)
        table.appendChild(row);
        
        total += data.articles[i].total;
      }else{
        var row = document.createElement('tr');
        var d_total = document.createElement('td');
        d_total.innerText = data.articles[i].state
        d_total.colSpan = 4;
        row.appendChild(d_total)
        table.appendChild(row);
      }
    }

    var row = document.createElement('tr');

    var t_title = document.createElement('td');
    t_title.innerText = "Total: "
    t_title.colSpan = 3;
    row.appendChild(t_title)

    var t_total = document.createElement('td');
    t_total.innerText = total/100+" $"
    row.appendChild(t_total)
    table.appendChild(row);

    tablediv.appendChild(table);
    showSubmitOrder();
  })
  .addJson(data)
  .send();

})

document.getElementById('order-submit').addEventListener('click',function(e)
{
  SimpleRequest.POST(ORDER_SERVICE,"customer/submitOrder")
  .onSuccess(function(data){
    showThanks();
  })
  .addJson({
    user_key: user_key
  })
  .send();
})