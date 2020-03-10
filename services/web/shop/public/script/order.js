const email = document.getElementById('email')
const fname = document.getElementById('fname')
const lname = document.getElementById('lname')
const street = document.getElementById('street')
const streetnum = document.getElementById('streetnum')
const postcode = document.getElementById('postcode')
const town = document.getElementById('town')
const state = document.getElementById('state')
const country = document.getElementById('country')
const form = document.getElementById('order-form')



form.addEventListener("submit", (e) => {
  e.preventDefault()
  console.log(email.value);
})
