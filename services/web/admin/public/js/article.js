// article.js
// managed all requests and responses for articles

$(function (){

  // var $article = $('#article');
  var $articles = $('#articles');
  var $articleDetailForm = $('#articleDetailForm');
  var $productid = $('#productid');
  var $name = $('#name');
  var $description = $('#description');
  var $price = $('#price');
  var $state = $('#state');
  var $subid = $('#subid');
  var $property = $('#property');
  var $amount = $('#amount');
  var $category = $('#category');

  var articlesTemplate = $('#articles-template').html(); // for all articles
  var articleTemplate = $('#article-template').html(); // for details at one article
  var emptyTemplate = $('#empty-template').html(); // for zero article

  function addArticle(article) {
    $articles.append(Mustache.render(articlesTemplate, article));
  }
  function addEmpty(empty) {
    $articles.append(Mustache.render(emptyTemplate, empty));
  }
  function addArticleDetail(article, id, categoryID) {
    if (lastID == id) {
      console.log("nichts passiert");
    } else {
      console.log("Neuzuweisung");
      lastID = id;
      $articleDetailForm.children().remove();
      $articleDetailForm.append(Mustache.render(articleTemplate, article));

      var input = $('#editcategory').attr('data-id');
      console.log("categoryID: ");
      console.log(categoryID);
      // Get all categories for a valid new article

      SimpleRequest.GET(PRODUCT_SERVICE,"category")
        .onSuccess(function(categories) {
          if ((JSON.stringify(categories) !== JSON.stringify([]))) {

            console.log("categoryID");
            console.log(categoryID);
            $.each(categories, function(i, category) {
              console.log("searching for category id with input");
              if (categoryID == category._id) {
                $('#editcategory')
                .append("<option selected data-id='" + category._id + "' value='" + category.categoryname + "'>" + category.categoryname + "</option>");
                // $('#editcategory').find("option:selected").attr('value', category.categoryname);
              } else if (categoryID != category._id) {
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

    var article = {
      productid: $productid.val(),
      name: $name.val(),
      description: $description.val(),
      price: $price.val(),
      state: $state.is(':checked'),
      propertys: [{
                  subid: $subid.val(),
                  property: $property.val(),
                  amount: $amount.val() }],
      category: $category.val()
    };
    console.log(article.category);

    SimpleRequest.POST(PRODUCT_SERVICE,"article")
    .addJson(article)
    .onSuccess(function (newArticle) {
      addArticle(newArticle);
    })
    .onFailure(function (statuscode, statusText,responseText) {
      showStatusError(responseText + ": " + statuscode + " - " + statusText + " while saving article");
    })
    .onError(function(error){
      showStatusError("Network Error");
    }).send();
  });

  $(document).on("click", ".editArticle", function() {

    var $tr = $(this).closest('tr');
    var id = $tr.attr('data-id');
    SimpleRequest.GET(PRODUCT_SERVICE,"article/"+id)
    .onSuccess(function(article) {
      console.log("open ArticleDetails for Edit Modal");
      if ((JSON.stringify(article) !== JSON.stringify([]))) {
        console.log(article.description);
        addArticleDetail(article, id, article.category);
      } else {
        renderErrorTableHTML();
      }
    })
    .onFailure(renderErrorTableHTML)
    .onError(function(error){
      showStatusError("Network Error");
    }).send();

  });

  $(document).on("click", "#edit-article", function() {
    // change vars
    var $editname = $('#editname');
    var $editdescription = $('#editdescription');
    var $editprice = $('#editprice');
    var $editstate = $('#editstate');
    var $editcategory = $('#editcategory');
    var $tr = $(this).closest('tr');
    var id = $tr.attr('data-id');

    var article = {
      name: $editname.val(),
      description: $editdescription.val(),
      price: $editprice.val(),
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
        }
      });
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

});
