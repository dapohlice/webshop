// !todo: Prüft ob Formular vaöide ist und händelt die Weiterleitung
(function() {
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
          console.log("invalid form");
        } else if (currentAdminPage == 'users') {
          // Paramter aus Adresse entfernen:
          event.preventDefault();
          console.log("call RenderSubmit and Add NewUser");
          postUser();
          $('#addModal').modal('hide');
          showStatusInfo("Successfully add a new user");
        } else if (currentAdminPage == 'groups') {
          // Paramter aus Adresse entfernen:
          event.preventDefault();
          console.log("call RenderSubmit and Add NewGroup");
          postGroup();
          $('#addModal').modal('hide');
        } else if (currentAdminPage == 'categories') {
          // Paramter aus Adresse entfernen:
          event.preventDefault();
          if (setCategoryDetails) {
            console.log("call render submit function and edit current Category");
            putCategory();
            $('#detailModal').modal('hide');
          } else {
            console.log("call RenderSubmit and Add NewCategory");
            postCategory();
            $('#addModal').modal('hide');
          }
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();


function validateForm() {
  // This function deals with validation of the dynamic created form fields

  var txt = $('#mailEdit').val();
  console.log(validateEmail(txt));
  console.log(setUserDetails);
  console.log(currentAdminPage);
   if (txt != null && txt != '' && validateEmail(txt)) {
     switch(currentAdminPage) {
       case "users":
         if (setUserDetails) {
           setUserDetails = false;
           // Paramter aus Adresse entfernen:
           console.log("call render submit function and edit current User");
           showStatusInfo("Successfully edit user with id" + lastID);
           putUser();
           $('#detailModal').modal('hide');
         }
         break;
       default:
         showStatusInfo("No valid request!");
     }
   } else {
     $('#detailModal').modal('hide');
     showStatusInfo("No valid request!");
   }

}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
