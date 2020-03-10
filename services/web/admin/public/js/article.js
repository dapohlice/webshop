// article.js
// managed all requests and responses for articles

$(function (){

  // var $article = $('#article');
  var $articles = $('#articles');
  var $properties = $('#properties');
  var $articleDetailForm = $('#articleDetailForm');
  var $propertiesDetailForm = $('#editPropertiesForm');
  var $productid = $('#productid');
  var $name = $('#name');
  var $description = $('#description');
  var $price = $('#price');
  var $state = $('#state');

  var lastSubID= 0;
  var lastArticleID= 0;
  var $subid = $('#subid');
  var $property = $('#property');
  var $amount = $('#amount');

  var $category = $('#category');

  var articlesTemplate = $('#articles-template').html(); // for all articles
  var articleTemplate = $('#article-template').html(); // for details at one article
  var propertiesTemplate = $('#properties-template').html(); // for details at one property
  var propertyTemplate = $('#property-template').html(); // for details at one property
  var emptyTemplate = $('#empty-template').html(); // for zero article
  var emptyPropTemplate = $('#empty-prop-template').html(); // for zero properties

  function addArticle(article) {
    $articles.append(Mustache.render(articlesTemplate, article));
  }
  function addEmpty(empty) {
    $articles.append(Mustache.render(emptyTemplate, empty));
  }
  function addProperty(property) {
    $properties.append(Mustache.render(propertiesTemplate, property));
  }
  function addPropEmpty(emptyProp) {
    $properties.append(Mustache.render(emptyPropTemplate, emptyProp));
  }
  function addArticleDetail(article, id, categoryID, btnimg) {
    if (lastID == id) {
      console.log("nichts passiert");
    } else {
      console.log("Neuzuweisung");
      lastID = id;
      $articleDetailForm.children().remove();
      $articleDetailForm.append(Mustache.render(articleTemplate, article));
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
      // var input = $('#editcategory').attr('data-id');
      // Get all categories for a valid new article

      SimpleRequest.GET(PRODUCT_SERVICE,"category")
        .onSuccess(function(categories) {
          if ((JSON.stringify(categories) !== JSON.stringify([]))) {

            console.log("categoryID");
            console.log(categoryID);
            $.each(categories, function(i, category) {
              console.log("searching for category id with input");
              if (categoryID == category.categoryname) {
                $('#editcategory')
                .append("<option selected data-id='" + category._id + "' value='" + category.categoryname + "'>" + category.categoryname + "</option>");
                // $('#editcategory').find("option:selected").attr('value', category.categoryname);
              } else if (categoryID != category.categoryname) {
                $('#editcategory')
                .append("<option data-id='" + category._id + "' value='" + category.categoryname + "'>" + category.categoryname + "</option>");
              }
            });

          } else {
            $('#editcategory').find("option").remove().end()
            .append("No categories found!");
          }
        })
        .onFailure(renderErrorTableHTML)
        .onError(function(error){
          showStatusError("Network Error");
        }).send();

        SimpleRequest.GET(PRODUCT_SERVICE,"article/"+id+"/propertys")
        .onSuccess(function(properties) {
          if ((JSON.stringify(properties) !== JSON.stringify([]))) {
            $properties.children().remove();
            $.each(properties, function(i, property) {
              addProperty(property);
            });
          } else {
            $properties.children().remove();
            addPropEmpty(properties);
          }
        })
        .onFailure(function (errorcode,errortext, statusText) {
          console.log("fail");
          showStatusError(statusText + ": " + errorcode+ " - " + errortext + " while get properties");
        })
        .onError(function(error){
          showStatusError("Network Error");
        }).send();

    }
  }
  function addPropertyDetail(property, subid) {
    if (lastSubID == subid) {
      console.log("property details nicht neu generiert");
    } else {
      console.log("property details neu generiert");
      lastSubID = subid;
      $propertiesDetailForm.children().remove();
      $propertiesDetailForm.append(Mustache.render(propertyTemplate, property));
    }
  }

SimpleRequest.GET(PRODUCT_SERVICE,"article")
  .onSuccess(function(articles) {
    if ((JSON.stringify(articles) !== JSON.stringify([]))) {
      $.each(articles, function(i, article) {
        addArticle(article);
      });
    } else {
      $articles.children().remove();
      addEmpty(articles);
    }

  })
  .onFailure(renderErrorTableHTML)
  .onError(function(error){
    showStatusError("Network Error");
  }).send();

  // Get all categories for a valid new article
SimpleRequest.GET(PRODUCT_SERVICE,"category")
  .onSuccess(function(categories) {
    if ((JSON.stringify(categories) !== JSON.stringify([]))) {
      $('#category').find("option").remove().end();
      $.each(categories, function(i, category) {
        $('#category')
        .append("<option data-id='" + category._id + "' value='" + category.categoryname + "'>" + category.categoryname + "</option>");
      });
    } else {
      $('#category').find("option").remove().end()
      .append("No categories found!");
    }
  })
  .onFailure(renderErrorTableHTML)
  .onError(function(error){
    showStatusError("Network Error");
  }).send();

  $('#add-article').on('click', function() {
    var $deleteImageAdd = $('#deleteImageAdd');

    if (validateForm()) {
      var article = {
        productid: parseInt($productid.val()),
        name: $name.val(),
        description: $description.val(),
        picturepath: $deleteImageAdd.attr('data-id'),
        price: $price.val(),
        state: $state.is(':checked'),
        categoryid: $category.find("option:selected").attr('data-id'),
        category: $category.val()
      };
      console.log(article.category);
      console.log($category.find("option:selected").attr('data-id'));

      SimpleRequest.POST(PRODUCT_SERVICE,"article")
      .addJson(article)
      .onSuccess(function (newArticle) {
        if ($('#emptyRow').length) {
          $('#emptyRow').remove();
        }
        addArticle(newArticle);
        if ($deleteImageAdd.attr('data-id')) {
          // attr is not blank
          $deleteImageAdd.removeAttr('disabled', 'disabled');
        } else {
          //attr is blank
          $deleteImageAdd.attr('disabled', 'disabled');
        }
      })
      .onFailure(function (statuscode, statusText,responseText) {
        showStatusError(responseText + ": " + statuscode + " - " + statusText + " while saving article");
      })
      .onError(function(error){
        showStatusError("Network Error");
      }).send();
    } else {
      // showStatusError("Form not valid");
      event.preventDefault();
      event.stopPropagation();
      console.log("invalid form in article");
      return 10;
    }

  });

  $(document).on("click", ".editArticle", function() {

    var $tr = $(this).closest('tr');
    var id = $tr.attr('data-id');
    console.log("ID value of clicked edit Article: ");
    console.log(id);
    lastArticleID = $tr.attr('data-id');
    var btnimg = '';
    btnimg = $tr.find('td.image img').attr('data-id');
    console.log(btnimg);

    SimpleRequest.GET(PRODUCT_SERVICE,"article/"+id)
    .onSuccess(function(article) {
      console.log("open ArticleDetails for Edit Modal");
      if ((JSON.stringify(article) !== JSON.stringify([]))) {
        console.log(article.description);
        addArticleDetail(article, id, article.category, btnimg);
      } else {
        showStatusError("Error: response empty article objekt");
      }
    })
    .onFailure(function (errorcode,errortext, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + errorcode+ " - " + errortext + " while editing article");
    })
    .onError(function(error){
      showStatusError("Network Error");
    }).send();

  });

  $(document).on("click", "#edit-article", function() {

    if (validateEditForm()) {
      // change vars
      var $editname = $('#editname');
      var $editdescription = $('#editdescription');
      var $editprice = $('#editprice');
      var $editstate = $('#editstate');
      var $editcategory = $('#editcategory');
      var $tr = $(this).closest('tr');
      var id = $tr.attr('data-id');
      var $deleteImageEdit = $('#deleteImageEdit');

      var article = {
        name: $editname.val(),
        description: $editdescription.val(),
        price: $editprice.val(),
        picturepath: $deleteImageEdit.attr('data-id'),
        category: $editcategory.val()
      };
      var $btn = $('#edit-article');
      var btnid = $btn.attr('data-id');

      SimpleRequest.PUT(PRODUCT_SERVICE,"article/"+btnid)
      .onSuccess(function (newArticle) {
        console.log("success");
        $.each($('.editArticle'), function () {
          $tr = $(this).closest('tr');
          id = $tr.attr('data-id');
          $('#editcategory').find("option").remove();
          if (id == btnid) {
            $tr.find('td.name').html(article.name);
            $tr.find('td.price').html(currencyConverter(article.price));
            var urlstring = 'http://localhost:3004/' + article.picturepath;
            console.log(urlstring);
            $tr.find('td.image img').attr('src', urlstring);
          }
        });
        showStatusInfo("Article processed");
      })
      .onFailure(function (errorcode,errortext, statusText) {
        console.log("fail");
        showStatusError(statusText + ": " + errorcode+ " - " + errortext + " while saving article");
        $('#editcategory').find("option").remove();
      })
      .onError(function(error){
        showStatusError("Network Error");
      })
      .addJson(article)
      .send();
    } else {
      // showStatusError("Form not valid");
      event.preventDefault();
      event.stopPropagation();
      console.log("invalid form in article");
      return 10;
    }

  });
  $(document).on("click", "#add-properties", function(event) {
    event.preventDefault();
    // var $btn = $('#askPropertiesArticleBtn');
    // var btnid = $btn.attr('data-id');
    var id = lastArticleID;

    if (validatePropertiesForm()) {
      var property = {
        amount: $amount.val(),
        subid: $subid.val(),
        property: $property.val()
      };

      SimpleRequest.POST(PRODUCT_SERVICE,"article/"+id+"/propertys")
      .addJson(property)
      .onSuccess(function(newProperty) {
        console.log("open property add Modal");
        if ((JSON.stringify(newProperty) !== JSON.stringify([]))) {
          console.log(property.property);
          addProperty(newProperty);
          showStatusInfo("Property created");
        } else {
          showStatusError("Error: Response empty property objekt");
        }
      })
      .onFailure(function (errorcode, errortext, statusText) {
        console.log("fail");
        showStatusError(statusText + ": " + errorcode+ " - " + errortext + " while add property");
      })
      .onError(function(error){
        showStatusError("Network Error");
      }).send();
    } else {
      // showStatusError("Form not valid");
      event.preventDefault();
      event.stopPropagation();
      console.log("invalid form in add properties");
      return 10;
    }

  });
  $(document).on("click", ".editProperty", function() {

    var $trProp = $(this).closest('tr');
    var idProp = $trProp.attr('data-id');
    console.log("Property ID");
    console.log(idProp);

    SimpleRequest.GET(PRODUCT_SERVICE,"article/"+idProp+"/propertys")
    .onSuccess(function(property) {
      console.log("open Property details for Edit Prop Modal");
      if ((JSON.stringify(property) !== JSON.stringify([]))) {
        console.log(property.description);
        addPropertyDetail(property, id);
      } else {
        showStatusError("Error: Response empty property objekt");
      }
      showStatusInfo("Property processed");
    })
    .onFailure(function (errorcode, errortext, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + errorcode+ " - " + errortext + " while edit property");
    })
    .onError(function(error){
      showStatusError("Network Error");
    }).send();

  });

  $(document).on("click", "#edit-property", function() {

    if (validatePropertiesEditForm()) {
      // change vars
      var $amountedit = $('#amountEdit');
      var $tr = $(this).closest('tr');
      var id = $tr.attr('data-id');

      var property = {
        amount: $amountedit.val()
      };
      var $btn = $('#edit-property');
      var btnid = $btn.attr('data-id');
      console.log("click edit property with");
      console.log("button ID:");
      console.log(btnid);
      console.log("last ID:");
      console.log(lastID);

      SimpleRequest.PATCH(PRODUCT_SERVICE,"article/"+lastID+"/property/"+btnid)
      .onSuccess(function (newArticle) {
        console.log("success");
        $.each($('.editProperty'), function () {
          $tr = $(this).closest('tr');
          id = $tr.attr('data-id');
          if (id == btnid) {
            $tr.find('td.subid').html(property.name);
            $tr.find('td.property').html(property.price);
            $tr.find('td.amount').html(property.amount);
          }
        });
        showStatusInfo("Property added");
      })
      .onFailure(function (errorcode, errortext, statusText) {
        console.log("fail");
        showStatusError(statusText + ": " + errorcode+ " - " + errortext + " while saving property");
      })
      .onError(function(error){
        showStatusError("Network Error");
      })
      .addJson(article)
      .send();
    } else {
      // showStatusError("Form not valid");
      event.preventDefault();
      event.stopPropagation();
      console.log("invalid form in properties");
      return 10;
    }

  });
  $(document).on("click", "#edit-status", function() {
    // change vars
    var $editstate = $('#editstate');
    var $editstatusbtn = $('#edit-status');
    var bool;
    console.log("*****edit-status button pressed******");
    if ($editstate.val() == "active") {
      bool = false;
    } else {
      bool = true;
    }
    var status = {
      state: bool
    };
    var btnid = $editstatusbtn.attr('data-id');


    SimpleRequest.PUT(PRODUCT_SERVICE,"article/"+btnid)
    .onSuccess(function (newStatus) {
      console.log("success");
        if (status.state == true) {
          $editstate.attr("value", "active");
          $editstate.removeClass('btn-danger');
          $editstate.addClass('btn-success');
          $editstatusbtn.removeData()
          $editstatusbtn.html("deactivate");
          $editstatusbtn.removeClass('btn-success');
          $editstatusbtn.addClass('btn-danger');
        } else {
          $editstate.attr("value", "disabled");
          $editstate.removeClass('btn-success');
          $editstate.addClass('btn-danger');
          $editstatusbtn.removeData()
          $editstatusbtn.html("activate");
          $editstatusbtn.removeClass('btn-danger');
          $editstatusbtn.addClass('btn-success');
        }

    })
    .onFailure(function (errorcode,errortext, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + eerrorcode + " - " + errortext + " while saving article");
    })
    .onError(function(error){
      showStatusError("Network Error");
    })
    .addJson(status)
    .send();
  });

  $(document).on("click", "#add-image", function(event) {
    event.preventDefault();
    // get filedata
    var $name = $('#name');
    var $picturesrc = $('#picturesrc');
    //get buttons
    var $deleteImageAdd = $('#deleteImageAdd');
    var src = document.getElementById('articlepicture').files[0];
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
    var $editname = $('#editname');
    var $editpicturesrc = $('#editpicturesrc');
    var $deleteImageEdit = $('#deleteImageEdit');

    var src = document.getElementById('editarticlepicture').files[0];
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

    var $name = $('#name');
    var $picturesrc = $('#picturesrc');
    // get btn id
    var $deleteImageAdd = $('#deleteImageAdd');
    var btnid = $deleteImageAdd.attr('data-id');

    SimpleRequest.DELETE(PICTURE_SERVICE,btnid)
    .onSuccess(function () {
      //set any default category image here:
      $picturesrc.attr('src', '');
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
    var $editname = $('#editname');
    var $editpicturesrc = $('#editpicturesrc');
    // get btn id
    var $deleteImageEdit = $('#deleteImageEdit');
    var btnid = $deleteImageEdit.attr('data-id');
    //release add new image button to mind errors:
    $editpicturesrc.attr('src', '');
    $deleteImageEdit.attr("data-id", "");
    $deleteImageEdit.attr("disabled", "disabled");
    $('#editImageBtn').removeAttr("disabled", "disabled");

    SimpleRequest.DELETE(PICTURE_SERVICE,btnid)
    .onSuccess(function () {
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
