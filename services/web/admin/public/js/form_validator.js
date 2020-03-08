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

        } else if (currentAdminPage == 'categories') {
          // Paramter aus Adresse entfernen:
          event.preventDefault();
          console.log("call RenderSubmit after validation");
          $('#addModal').modal('hide');
          $('#detailModal').modal('hide');
        } else if (currentAdminPage == 'articles') {
          // Paramter aus Adresse entfernen:
          event.preventDefault();
          console.log("call RenderSubmit after validation");
          $('#addModal').modal('hide');
          $('#detailModal').modal('hide');

        } else if (currentAdminPage == 'users') {
          // Paramter aus Adresse entfernen:
          event.preventDefault();
          console.log("call RenderSubmit and Add NewUser");
          postUser();
          $('#addModal').modal('hide');

        } else if (currentAdminPage == 'groups') {
          // Paramter aus Adresse entfernen:
          event.preventDefault();
          console.log("call RenderSubmit and Add NewGroup");
          postGroup();
          $('#addModal').modal('hide');
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();


function validateForm() {
  // This function deals with validation of the dynamic created form fields
  var txt = '';
   switch(currentAdminPage) {
     case "articles":
        var name;
        var nr;
        var desc;
        var price;
        var category;
        var img;
        var $deleteImageAdd = $('#deleteImageAdd');
       name = $('#name').val();
       nr = $('#productid').val();
       desc = $('#description').val();
       price = $('#price').val();
       category = $('#category').val();
       img = $deleteImageAdd.attr('data-id');
       if (name == null || name == '') {
         //show error message
         showStatusError("Invalid name entered!");
         return false;
       } else if (nr == null || nr == '') {
         //show error message
         showStatusError("Invalid item number entered!");
         return false;
       } else if (desc == null || desc == '') {
         //show error message
         showStatusError("Invalid description entered!");
         return false;
       } else if (price == null || price == '') {
         //show error message
         showStatusError("Invalid price format entered!");
         return false;
       } else if (category == null || category == '') {
         //show error message
         showStatusError("Invalid category entered!");
         return false;
       } else if (img == null || img == '') {
         //show error message
         showStatusError("Invalid picture format uploaded!");
         return false;
       } else {
         return true;
       }
       break;
     case "categories":
      var name;
      var img;
      var $deleteImageAdd = $('#deleteImageAdd');
       name = $('#categoryname').val();
       img = $deleteImageAdd.attr('data-id');
       if (name == null || name == '') {
         //show error message
         showStatusError("Invalid name entered!");
         return false;
       } else if (img == null || img == '') {
         //show error message
         showStatusError("Invalid picture format uploaded!");
         return false;
       } else {
         return true;
       }
       break;
     case "users":
       txt = $('#mailEdit').val();
       if (setUserDetails && txt != null && txt != '' && validateEmail(txt)) {
         // close user detail modal
         setUserDetails = false;
         //show info status
         showStatusInfo("Successfully edit user with id " + lastID);
         //end of show info status
         putUser();
         $('#detailModal').modal('hide');
       } else {
         $('#detailModal').modal('hide');
         showStatusError("Warning: invalid request!");
       }
       break;
     case "groups":
       txt = $('#groupnameEdit').val();
       if (setGroupDetails && txt != null && txt != '') {
         // close group detail modal
         setGroupDetails = false;
         showStatusInfo("Successfully edit group with id " + lastID);
         putGroup();
         $('#detailModal').modal('hide');
       } else {
         $('#detailModal').modal('hide');
         showStatusError("Warning: invalid request!");
       }
       break;
     default:
       $('#detailModal').modal('hide');
       showStatusError("Warning: invalid request!");

   }

}
function validateEditForm() {
  // This function deals with validation of the dynamic created form fields
  var txt = '';
   switch(currentAdminPage) {
     case "articles":
        var editName;
        var editNr;
        var editPrice;
        var editCategory;
        var editDescription;
        var editImg;
        var $deleteImageEdit = $('#deleteImageEdit');
       editName = $('#editname').val(),
       editNr = $('#editproductid').val(),
       editPrice = $('#editprice').val(),
       editCategory = $('#editcategory').val(),
       editDescription = $('#editdescription').val(),
       editImg = $deleteImageEdit.attr('data-id')
       console.log("editName of category:");
       console.log(editName);
       console.log("editImg of category:");
       console.log(editImg);
       if (editName == null || editName == '') {
         //show error message
         showStatusError("Warning: Invalid name entered!");
         return false;
       } else if (editNr == null || editNr == '') {
         //show error message
         showStatusError("Invalid item number entered!");
         return false;
       } else if (editDescription == null || editDescription == '') {
         //show error message
         showStatusError("Invalid description entered!");
         return false;
       } else if (editPrice == null || editPrice == '') {
         //show error message
         showStatusError("Invalid price format entered!");
         return false;
       } else if (editCategory == null || editCategory == '') {
         //show error message
         showStatusError("Invalid category entered!");
         return false;
       } else if (editImg == null || editImg == '') {
         //show error message
         showStatusError("Warning: Invalid picture format uploaded!");
         return false;
       } else {
         return true;
       }
       break;
     case "categories":
      var editName;
      var editImg;
      var $deleteImageEdit = $('#deleteImageEdit');
      var $editcategoryname = $('#editcategoryname');
       editName = $editcategoryname.val(),
       editImg = $deleteImageEdit.attr('data-id')
       console.log("editName of category:");
       console.log(editName);
       console.log("editImg of category:");
       console.log(editImg);
       if (editName == null || editName == '') {
         //show error message
         showStatusError("Warning: Invalid name entered!");
         return false;
       } else if (editImg == null || editImg == '') {
         //show error message
         showStatusError("Warning: Invalid picture format uploaded!");
         return false;
       } else {
         return true;
       }
       break;
     default:
       $('#detailModal').modal('hide');
       showStatusError("Warning: invalid request!");
   }

}
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
