// category.js
// managed all requests and responses for categories

$(function (){

  var $categories = $('#categories');
  var $categoryDetailForm = $('#categoryDetailForm');

  var $categoryname = $('#categoryname');
  // var $picturepath = $('#picturepath');

  var categoriesTemplate = $('#categories-template').html(); // for all categories
  var categoryTemplate = $('#category-template').html(); // for details at one category
  var emptyTemplate = $('#empty-template').html(); // for zero categories

  function addCategory(category) {
    $categories.append(Mustache.render(categoriesTemplate, category));
  }
  function addEmpty(empty) {
    $categories.append(Mustache.render(emptyTemplate, empty));
  }
  function addCategoryDetail(category, id, btnimg) {
    if (lastID == id) {
      console.log("nichts passiert");
    } else {
      console.log("Neuzuweisung");
      lastID = id;
      $categoryDetailForm.children().remove();
      $categoryDetailForm.append(Mustache.render(categoryTemplate, category));
    }
    var $deleteImageEdit = $('#deleteImageEdit');
    var $editImageBtn = $('#editImageBtn');

    if (btnimg != '') {
      // attr is not blank
      $deleteImageEdit.removeAttr('disabled', 'disabled');
      $editImageBtn.attr('disabled', 'disabled');
    } else {
      //attr is blank
      $deleteImageEdit.attr('disabled', 'disabled');
      $editImageBtn.removeAttr('disabled', 'disabled');
    }
  }

  SimpleRequest.GET(PRODUCT_SERVICE,"category")
  .onSuccess(function(categories) {
    if ((JSON.stringify(categories) !== JSON.stringify([]))) {
      $.each(categories, function(i, category) {
        addCategory(category);
      });
    } else {
      addEmpty(categories);
    }

  })
  .onFailure(renderErrorTableHTML)
  .onError(function(error){
    showStatusError("Network Error");
  }).send();

  $('#add-category').on('click', function(event) {

    if (validateForm()) {
      var $deleteImageAdd = $('#deleteImageAdd');

      var category = {
        categoryname: $categoryname.val(),
        picturepath: $deleteImageAdd.attr('data-id')
      };
      console.log(JSON.stringify(category));

      SimpleRequest.POST(PRODUCT_SERVICE,"category")
      .onSuccess(function (newCategory) {
          addCategory(newCategory);
          showStatusInfo("Category added");
          if ($deleteImageAdd.attr('data-id')) {
            // attr is not blank
            $deleteImageAdd.removeAttr('disabled', 'disabled');
          } else {
            //attr is blank
            $deleteImageAdd.attr('disabled', 'disabled');
          }
      })
      .onFailure(function (errorcode,errortext, statusText) {
        showStatusError(statusText + ": " + errorcode + " - " + errortext + " while saving category");
      })
      .onError(function(error){
        showStatusError("Network Error");
      })
      .addJson(category)
      .send();
    } else {
      // showStatusError("Form not valid");
      event.preventDefault();
      event.stopPropagation();
      console.log("invalid form in categoryJS");
      return 10;
    }

  });

  $(document).on("click", ".editCategory", function() {

    var $deleteImageEdit = $('#deleteImageEdit');
    var $editImageBtn = $('#editImageBtn');

    var $tr = $(this).closest('tr');
    var id = $tr.attr('data-id');
    console.log(id);
    var btnimg = '';
    btnimg = $tr.find('td.image img').attr('data-id');
    console.log(btnimg);

    SimpleRequest.GET(PRODUCT_SERVICE,"category/"+id)
    .onSuccess(function(category) {
      console.log("open category details for edit modal");
      if ((JSON.stringify(category) !== JSON.stringify([]))) {
        addCategoryDetail(category, id, btnimg);
        console.log($deleteImageEdit.attr('data-id'));
      } else {
        renderErrorTableHTML();
      }

    })
    .onFailure(renderErrorTableHTML)
    .onError(function(error){
      showStatusError("Network Error");
    })
    .send();

  });

  $(document).on("click", "#edit-category", function() {

    if (validateEditForm()) {
      // change vars
      var $deleteImageEdit = $('#deleteImageEdit');
      var $editcategoryname = $('#editcategoryname');
      // var $editpicturepath = $('#editpicturepath');
      var $tr = $(this).closest('tr');
      var id = $tr.attr('data-id');

      var $category = {
        categoryname: $editcategoryname.val(),
        picturepath: $deleteImageEdit.attr('data-id')
      };
      console.log($category.categoryname);
      console.log($category.picturepath);
      var $btn = $('#edit-category');
      var btnid = $btn.attr('data-id');


      SimpleRequest.PUT(PRODUCT_SERVICE,"category/"+btnid)
      .onSuccess(function(category) {
        $.each($('.editCategory'), function () {
          $tr = $(this).closest('tr');
          id = $tr.attr('data-id');
          if (id == btnid) {
            console.log($category.categoryname);
            $tr.find('td.name').html($category.categoryname);
            var string = 'http://localhost:3004/' + $category.picturepath;
            console.log(string);
            $tr.find('td.image img').attr('src', 'http://localhost:3004/' + $category.picturepath);
          }
        });
      })
      .onFailure( function (errorstatus,errorText, statusText) {
        console.log("fail");
        showStatusError(statusText + ": " + errorstatus + " - " + errorText + " while changing category");
      })
      .onError(function(error){
        showStatusError("Network Error");
      })
      .addJson($category)
      .send();
    } else {
      // showStatusError("Form not valid");
      event.preventDefault();
      event.stopPropagation();
      console.log("invalid form in categoryJS");
      return 10;
    }
  });
  $(document).on("click", "#remove-category", function() {
    // delete tr
    var $categories = $('#categories');
    var $tr = $categories.closest('tr');
    var id = $tr.attr('data-id');

    var $askRemoveCategoryBtn = $('#askRemoveCategoryBtn');
    var $btn = $askRemoveCategoryBtn
    var btnid = $btn.attr('data-id');
    console.log(btnid);
    console.log(id);

    SimpleRequest.DELETE(PRODUCT_SERVICE,"category/"+btnid)
    .onSuccess(function (newCategory) {
      console.log("success");
      $.each($('.editCategory'), function () {
        $tr = $(this).closest('tr');
        id = $tr.attr('data-id');
        if (id == btnid) {
          $tr.remove();
        }
      });
      $('#deleteModal').modal('hide');
      $('#detailModal').modal('hide');
    })
    .onFailure( function (errorstatus,errorText, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + errorstatus + " - " + errorText + " while deleting category");
    })
    .onError(function(error){
      showStatusError("Network Error");
    })
    .send();

    // get btn id
    var $deleteImageEdit = $('#deleteImageEdit');
    var imgbtnid = $deleteImageEdit.attr('data-id');

    SimpleRequest.DELETE(PICTURE_SERVICE,imgbtnid)
    .onSuccess(function (newCategory) {
      console.log("successfully deleted picture");
    })
    .onFailure( function (errorstatus,errorText, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + errorstatus + " - " + errorText + " while deleteing category picture");
    })
    .onError(function(error){
      showStatusError("Network Error");
    })
    .send();
  });

  $(document).on("click", "#add-image", function(event) {
    event.preventDefault();
    // get filedata
    var $categoryname = $('#categoryname');
    var $picturesrc = $('#picturesrc');
    //get buttons
    var $deleteImageAdd = $('#deleteImageAdd');
    var src = document.getElementById('categorypicture').files[0];
    var data = new FormData();
    data.append("photo", src);

    SimpleRequest.POST(PICTURE_SERVICE)
    .onSuccess(function (image) {
          $('#imgModal').modal('hide');
          $deleteImageAdd.attr('data-id', image);
          $picturesrc.attr('src', PICTURE_SERVICE+"/"+ image);
          if ($deleteImageAdd.attr('data-id')) {
            // attr is not blank
            $deleteImageAdd.removeAttr('disabled', 'disabled');
            $('#addImageBtn').attr("disabled", "disabled");
          } else {
            //attr is blank
            $deleteImageAdd.attr('disabled', 'disabled');
            $('#addImageBtn').removeAttr("disabled", "disabled");
          }
          $('#addImageBtn').attr("disabled", "disabled");
          showStatusInfo("Image added");
    })
    .onFailure( function (errorstatus,errorText, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + errorstatus + " - " + errorText + " while uploading image");
    })
    .onError(function(error){
      showStatusError("Network Error");
    })
    .addRaw(data)
    .send();

  });

  $(document).on("click", "#edit-image", function(event) {
    event.preventDefault();
    // get filedata
    var $editcategoryname = $('#editcategoryname');
    var $editpicturesrc = $('#editpicturesrc');
    var $deleteImageEdit = $('#deleteImageEdit');

    var src = document.getElementById('editcategorypicture').files[0];
    var data = new FormData();
    data.append("photo", src);


    SimpleRequest.POST(PICTURE_SERVICE)
    .onSuccess(function (image) {
        $('#imgEditModal').modal('hide');
        $deleteImageEdit.attr('data-id', image)
        $editpicturesrc.attr('src', PICTURE_SERVICE +'/' + image);
        if ($deleteImageEdit.attr('data-id')) {
          // attr is not blank
          $deleteImageEdit.removeAttr('disabled', 'disabled');
          $('#editImageBtn').attr("disabled", "disabled");
        } else {
          //attr is blank
          $deleteImageEdit.attr('disabled', 'disabled');
          $('#editImageBtn').removeAttr("disabled", "disabled");
        }
        showStatusInfo("Image changed")
    })
    .onFailure( function (errorstatus,errorText, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + errorstatus + " - " + errorText + " while uploading image");
    })
    .onError(function(error){
      showStatusError("Network Error");
    })
    .addRaw(data)
    .send();


  });

  $(document).on("click", "#deleteImageAdd", function(event) {
    event.preventDefault();

    var $categoryname = $('#categoryname');
    var $picturesrc = $('#picturesrc');
    // get btn id
    var $deleteImageAdd = $('#deleteImageAdd');
    var btnid = $deleteImageAdd.attr('data-id');

    SimpleRequest.DELETE(PICTURE_SERVICE,btnid)
    .onSuccess(function () {
      //set any default category image here:
      $picturesrc.attr('src', 'img/category/shirt.png');
      $deleteImageAdd.attr('data-id', '');
      $deleteImageAdd.attr("disabled", "disabled");
      $('#addImageBtn').removeAttr("disabled", "disabled");
      showStatusInfo("Image removed")
    })
    .onFailure( function (errorstatus,errorText, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + errorstatus + " - " + errorText + " while deleting image");
    })
    .onError(function(error){
      showStatusError("Network Error");
    })
    .send();
  });

  $(document).on("click", "#deleteImageEdit", function(event) {
    event.preventDefault();
    // get filedata
    var $editcategoryname = $('#editcategoryname');
    var $editpicturesrc = $('#editpicturesrc');
    // get btn id
    var $deleteImageEdit = $('#deleteImageEdit');
    var btnid = $deleteImageEdit.attr('data-id');

    SimpleRequest.DELETE(PICTURE_SERVICE,btnid)
    .onSuccess(function () {
      //set any default category image here:
      $editpicturesrc.attr('src', '');
      $deleteImageEdit.attr("data-id", "");
      $deleteImageEdit.attr("disabled", "disabled");
      $('#editImageBtn').removeAttr("disabled", "disabled");
      showStatusInfo("Image removed");
    })
    .onFailure( function (errorstatus,errorText, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + errorstatus + " - " + errorText + " while deleting image");
    })
    .onError(function(error){
      showStatusError("Network Error");
    })
    .send();

  });

});
