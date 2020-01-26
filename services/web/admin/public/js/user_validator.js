// !todo: Prüft ob Formular vaöide ist und händelt die Weiterleitung
$(document).ready(function() {
      window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');

        // check match

        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
          form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            var selectProfessions = document.getElementById("inputGroupSelectProfessions01").value;
            if(selectProfessions === ''){
            // form.classList.add('was-validated');
              // $("#validate").html("Please choose a profession!");
              // $("#validate").addClass("error");
              //  $("#confirm_email").addClass("error-text");
              event.preventDefault();
              event.stopPropagation();
            }
            else{
              // $("#validate").removeClass("error");
              // form.classList.add('was-validated');
              //    $("#confirm_email").removeClass("error-text");
              //   $("#validate").html("Looks Good!");
            }

          }, false);
        });
      }, false);
    });
