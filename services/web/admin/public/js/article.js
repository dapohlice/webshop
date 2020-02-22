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
  function addArticleDetail(article, id) {
    if (lastID == id) {
      console.log("nichts passiert");
    } else {
      console.log("Neuzuweisung");
      lastID = id;
      $articleDetailForm.children().remove();
      $articleDetailForm.append(Mustache.render(articleTemplate, article));
    }
  }


  $.ajax({
    type: 'GET',
    url: 'http://localhost:3002/article',
    success: function(articles) {
      if ((JSON.stringify(articles) !== JSON.stringify([]))) {
        $.each(articles, function(i, article) {
          addArticle(article);
        });
      } else {
        addEmpty(articles);
      }

    },
    error: function() {
      renderErrorTableHTML();
    }
  });

  // Get all categories for a valid new article
  $.ajax({
    type: 'GET',
    url: 'http://localhost:3002/category',
    success: function(categories) {
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
    },
    error: function() {
      renderErrorTableHTML();
    }
  });

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

    promise = $.ajax({
      type: 'POST',
      url: 'http://localhost:3002/article',
      data: article
    });
    promise.done(function (newArticle) {
      addArticle(newArticle);
    });

    promise.fail(function (error, statusText) {
      showStatusError(statusText + ": " + error.status + " - " + error.statusText + " while saving article");
    });
  });

  $(document).on("click", ".editArticle", function() {

    var $tr = $(this).closest('tr');
    var id = $tr.attr('data-id');

    $.ajax({
      type: 'GET',
      url: 'http://localhost:3002/article/' + id,
      success: function(article) {
        console.log("open ArticleDetails for Edit Modal");
        if ((JSON.stringify(article) !== JSON.stringify([]))) {
          console.log(article.description);
          addArticleDetail(article, id);
        } else {
          renderErrorTableHTML();
        }

      },
      error: function() {
        renderErrorTableHTML();
      }
    });

    // Get all categories for a valid new article
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3002/category',
      success: function(categories) {
        if ((JSON.stringify(categories) !== JSON.stringify([]))) {
          var option = $('option:selected').attr('data-id');
          console.log("option");
          console.log(option);
          $.each(categories, function(i, category) {
            if (option == category._id) {
              $('#editcategory').find("option:selected").attr('value', category.categoryname);
            } else if (option != category._id) {
              $('#editcategory')
              .append("<option data-id='" + category._id + "' value='" + category.categoryname + "'>" + category.categoryname + "</option>");
            }
          });
        } else {
          $('#editcategory').find("option").remove().end()
          .append("No categories found!");
        }
      },
      error: function() {
        renderErrorTableHTML();
      }
    });

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
    promise = $.ajax({
      type: 'PUT',
      url: 'http://localhost:3002/article/' + btnid,
      data: article
    });
    promise.done(function (newArticle) {
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
    });

    promise.fail(function (error, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + error.status + " - " + error.statusText + " while saving article");
      $('#editcategory').find("option").remove();
    });
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

    promise = $.ajax({
      type: 'PUT',
      url: 'http://localhost:3002/article/' + btnid,
      data: status
    });
    promise.done(function (newStatus) {
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

    });

    promise.fail(function (error, statusText) {
      console.log("fail");
      showStatusError(statusText + ": " + error.status + " - " + error.statusText + " while saving article");
    });

  });

});
