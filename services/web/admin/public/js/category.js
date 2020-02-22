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
  function addCategoryDetail(category, id) {
    if (lastID == id) {
      console.log("nichts passiert");
    } else {
      console.log("Neuzuweisung");
      lastID = id;
      $categoryDetailForm.children().remove();
      $categoryDetailForm.append(Mustache.render(categoryTemplate, category));
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

    var $editpicturepath = $('#editpicturepath');
    var $editpicturesrc = $('#editpicturesrc');

    var category = {
      categoryname: $categoryname.val(),
      picturepath: $editpicturepath.val()
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

    var $tr = $(this).closest('tr');
    var id = $tr.attr('data-id');
    console.log(id);

    $.ajax({
      type: 'GET',
      url: 'http://localhost:3002/category/' + id,
      success: function(category) {
        console.log("open category details for edit modal");
        if ((JSON.stringify(category) !== JSON.stringify([]))) {
          addCategoryDetail(category, id);
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

    var $askRemoveGroupBtn = $('#askRemoveGroupBtn');
    var $btn = $askRemoveGroupBtn
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

  });
  $(document).on("click", "#add-image", function(event) {
    event.preventDefault();
    // get filedata
    var $editpicturepath = $('#picturepath');
    var $editcategoryname = $('#categoryname');
    var $editpicturesrc = $('#picturesrc');

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
          $editpicturepath.val(responseText);
          $editpicturesrc.attr('src', 'http://localhost:3004/' + responseText);
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
          $editpicturepath.val(responseText);
          $editpicturesrc.attr('src', 'http://localhost:3004/' + responseText);
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

});
