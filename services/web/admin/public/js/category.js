// category.js
// managed all requests and responses for categories

$(function (){

  var $categories = $('#categories');
  var $categoryDetailForm = $('#categoryDetailForm');

  var $categoryname = $('#categoryname');
  var $picturepath = $('#picturepath');

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


  $.ajax({
    type: 'GET',
    url: 'http://localhost:3002/category',
    success: function(categories) {
      if ((JSON.stringify(categories) !== JSON.stringify([]))) {
        $.each(categories, function(i, category) {
          addCategory(category);
        });
      } else {
        addEmpty(categories);
      }

    },
    error: function() {
      renderErrorTableHTML();
    }
  });

  $('#add-category').on('click', function() {

    var $deleteImageAdd = $('#deleteImageAdd');

    var category = {
      categoryname: $categoryname.val(),
      picturepath: $picturepath.val()
    };
    console.log(JSON.stringify(category));

    promise = $.ajax({
      type: 'POST',
      url: 'http://localhost:3002/category',
      data: JSON.stringify(category),
      contentType: 'application/json',
      cache: false
    });
    promise.done(function (newCategory, status, responseText) {
      var result;
      if (responseText.readyState == 4) {;
        if (responseText.status == 200) {
          result = status;
          addCategory(newCategory);
          if ($deleteImageAdd.attr('data-id')) {
            // attr is not blank
            $deleteImageAdd.removeAttr('disabled', 'disabled');
          } else {
            //attr is blank
            $deleteImageAdd.attr('disabled', 'disabled');
          }
        } else if (responseText.status == 201) {
          addCategory(newCategory);
          result = "Warning: Something went wrong with Status - " + responseText.status;
        } else {
          result = "Warning: Error - " + responseText.status;
        }
      } else {
        result = "Warning: Form for add category is not valid";
      }
      showStatusError(result);
    });

    promise.fail(function (error, statusText) {
      showStatusError(statusText + ": " + error.status + " - " + error.statusText + " while saving category");
    });
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

    $.ajax({
      type: 'GET',
      url: 'http://localhost:3002/category/' + id,
      success: function(category) {
        console.log("open category details for edit modal");
        if ((JSON.stringify(category) !== JSON.stringify([]))) {
          addCategoryDetail(category, id, btnimg);
          console.log($deleteImageEdit.attr('data-id'));
        } else {
          renderErrorTableHTML();
        }

      },
      error: function() {
        renderErrorTableHTML();
      }
    });

  });

  $(document).on("click", "#edit-category", function() {
    // change vars
    var $editcategoryname = $('#editcategoryname');
    var $editpicturepath = $('#editpicturepath');
    var $tr = $(this).closest('tr');
    var id = $tr.attr('data-id');

    var $category = {
      categoryname: $editcategoryname.val(),
      picturepath: $editpicturepath.val()
    };
    console.log($category.categoryname);
    console.log($category.picturepath);
    var json = JSON.stringify($category);
    var $btn = $('#edit-category');
    var btnid = $btn.attr('data-id');

    promise = $.ajax({
      type: 'PUT',
      url: 'http://localhost:3002/category/' + btnid,
      data: json,
      contentType: 'application/json',
      cache: false
    });
    promise.done(function (newCategory, status, responseText) {
      var result;
      console.log(newCategory);
      console.log(status);
      console.log(responseText);
      console.log(responseText.status);
      console.log(responseText.readyState);
      if (responseText.readyState == 4) {
        if (responseText.status == 200) {
          result = "Successfully changed category with status: " + responseText.status;
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
        } else {
          result = status;
        }
      } else {
          result = "Warning: Form for edit category is not valid";
      }

      showStatusError(result);
    });

    promise.fail(function (error, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + error.status + " - " + error.statusText + " while saving category");
    });

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

    promise = $.ajax({
      type: 'DELETE',
      url: 'http://localhost:3002/category/' + btnid,
      cache: false
    });
    promise.done(function (newCategory) {
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
    });

    promise.fail(function (error, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + error.status + " - " + error.statusText + " while delete category");
    });

    // get btn id
    var $deleteImageEdit = $('#deleteImageEdit');
    var imgbtnid = $deleteImageEdit.attr('data-id');

    $.ajax({
      type: 'DELETE',
      url: 'http://localhost:3004/' + imgbtnid,
      success: function(responseText, status, readyState) {
        console.log(responseText);
        console.log(readyState.readyState);
        console.log(status);
        var result;
        if(readyState.readyState == 4) {
          if(readyState.status == 200) {
            result = "Successfully delete image";
          } else {
            console.log(status);
            result = "Warning: " + readyState.status;
          }
        } else {
            result = "Warning: Image delete failed";
        }
        console.log(result);
      },
      error: function() {
        renderErrorTableHTML();
      }
    });

  });
  $(document).on("click", "#add-image", function(event) {
    event.preventDefault();
    // get filedata
    var $picturepath = $('#picturepath');
    var $categoryname = $('#categoryname');
    var $picturesrc = $('#picturesrc');
    //get buttons
    var $deleteImageAdd = $('#deleteImageAdd');
    var src = document.getElementById('categorypicture').files[0];
    var data = new FormData();
    data.append("photo", src);

    promise = $.ajax({
      processData: false,
      contentType: false,
      url: 'http://localhost:3004',
      data: data,
      type: 'POST',
      cache: false
    });
    promise.done(function (responseText, status, readyState) {
      console.log(responseText);
      console.log(readyState.readyState);
      console.log(status);
      var result;
      if(readyState.readyState == 4) {
        if(readyState.status == 200) {
          result = responseText;
          $('#imgModal').modal('hide');
          $deleteImageAdd.attr('data-id', responseText);
          $picturepath.val(responseText);
          $picturesrc.attr('src', 'http://localhost:3004/' + responseText);
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
        } else {
          console.log(status);
          result = readyState.status;
        }
      } else {
          result = "Warning: Image upload not ready";
      }

      showStatusInfo(result);
    });

    promise.fail(function (error, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + error.status + " - " + error.statusText + " while upload image");
    });

  });
  $(document).on("click", "#edit-image", function(event) {
    event.preventDefault();
    // get filedata
    var $editpicturepath = $('#editpicturepath');
    var $editcategoryname = $('#editcategoryname');
    var $editpicturesrc = $('#editpicturesrc');
    var $deleteImageEdit = $('#deleteImageEdit');

    var src = document.getElementById('editcategorypicture').files[0];
    var data = new FormData();
    data.append("photo", src);

    promise = $.ajax({
      processData: false,
      contentType: false,
      url: 'http://localhost:3004',
      data: data,
      type: 'POST',
      cache: false
    });
    promise.done(function (responseText, status, readyState) {
      console.log(responseText);
      console.log(readyState.readyState);
      console.log(status);
      var result;
      if(readyState.readyState == 4) {
        if(readyState.status == 200) {
          result = responseText;
          $('#imgEditModal').modal('hide');
          $deleteImageEdit.attr('data-id', responseText)
          $editpicturepath.val(responseText);
          $editpicturesrc.attr('src', 'http://localhost:3004/' + responseText);
          if ($deleteImageEdit.attr('data-id')) {
            // attr is not blank
            $deleteImageEdit.removeAttr('disabled', 'disabled');
            $('#editImageBtn').attr("disabled", "disabled");
          } else {
            //attr is blank
            $deleteImageEdit.attr('disabled', 'disabled');
            $('#editImageBtn').removeAttr("disabled", "disabled");
          }

        } else {
          console.log(status);
          result = readyState.status;
        }
      } else {
          result = "Warning: Image upload not ready";
      }

      showStatusInfo(result);
    });

    promise.fail(function (error, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + error.status + " - " + error.statusText + " while upload image");
    });

  });
  $(document).on("click", "#deleteImageAdd", function(event) {
    event.preventDefault();

    var $picturepath = $('#picturepath');
    var $categoryname = $('#categoryname');
    var $picturesrc = $('#picturesrc');
    // get btn id
    var $deleteImageAdd = $('#deleteImageAdd');
    var btnid = $deleteImageAdd.attr('data-id');

    promise = $.ajax({
      type: 'DELETE',
      url: 'http://localhost:3004/' + btnid,
      cache: false
    });
    promise.done(function (responseText, status, readyState) {
      console.log(responseText);
      console.log(readyState.readyState);
      console.log(status);
      var result;
      if(readyState.readyState == 4) {
        if(readyState.status == 200) {
          result = "Successfully delete image";
          $picturepath.val("");
          //set any default category image here:
          $picturesrc.attr('src', 'img/category/shirt.png');
          $deleteImageAdd.attr('data-id', '');
          $deleteImageAdd.attr("disabled", "disabled");
          $('#addImageBtn').removeAttr("disabled", "disabled");
        } else {
          console.log(status);
          result = "Warning: " + readyState.status;
        }
      } else {
          result = "Warning: Image delete failed";
      }

      showStatusInfo(result);
    });

    promise.fail(function (error, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + error.status + " - " + error.statusText + " while upload image");
    });

  });
  $(document).on("click", "#deleteImageEdit", function(event) {
    event.preventDefault();
    // get filedata
    var $editpicturepath = $('#editpicturepath');
    var $editcategoryname = $('#editcategoryname');
    var $editpicturesrc = $('#editpicturesrc');
    // get btn id
    var $deleteImageEdit = $('#deleteImageEdit');
    var btnid = $deleteImageEdit.attr('data-id');

    promise = $.ajax({
      type: 'DELETE',
      url: 'http://localhost:3004/' + btnid,
      cache: false
    });
    promise.done(function (responseText, status, readyState) {
      console.log(responseText);
      console.log(readyState.readyState);
      console.log(status);
      var result;
      if(readyState.readyState == 4) {
        if(readyState.status == 200) {
          result = "Successfully delete image";
          $editpicturepath.val("");
          //set any default category image here:
          $editpicturesrc.attr('src', 'img/category/shirt.png');
          $deleteImageEdit.attr("data-id", "");
          $deleteImageEdit.attr("disabled", "disabled");
          $('#editImageBtn').removeAttr("disabled", "disabled");
        } else {
          console.log(status);
          result = readyState.status;
        }
      } else {
          result = "Warning: Image delete failed";
      }

      showStatusInfo(result);
    });

    promise.fail(function (error, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + error.status + " - " + error.statusText + " while upload image");
    });

  });

});
