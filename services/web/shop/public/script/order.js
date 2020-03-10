document.getElementById('order-form').addEventListener('submit',function(e){
    e.preventDefault();
    console.log(document.getElementById('email').value);
})