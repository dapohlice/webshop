// !todo: Prüft ob Formular vaöide ist und händelt die Weiterleitung
(function() {
  'use strict';
  window.addEventListener('load', function() {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          // Paramter aus Adresse entfernen:
          event.preventDefault();
          console.log("call RenderSubmit and Add NewUser");
          postUser();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();
