// article.js
// managed all requests and responses for articles

$(function test(){

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

  var articlesTemplate = $('#articles-template').html();
  var articleTemplate = $('#article-template').html();

  function addArticle(article) {
    $articles.append(Mustache.render(articlesTemplate, article));
  }
  function addArticleDetail(article) {
    console.log("addArticleDetail");
    $articles.append(Mustache.render(articleTemplate, article));
  }

  $.ajax({
    type: 'GET',
    url: 'http://localhost:3002/article',
    success: function(articles) {
      $.each(articles, function(i, article) {
        addArticle(article);
        // test();
      });
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

    $.ajax({
      type: 'POST',
      url: 'http://localhost:3002/article',
      data: article,
      success: function(newArticle) {
        addArticle(newArticle);
      },
      error: function(error, statusText) {
        // $('#errorModalObjekt').children('div').eq(0).remove();
        // renderErrorHTML(error, statusText);
        showStatusError(statusText + ": " + error.status + " - " + error.statusText + " while saving orders");
      }
    });
  });

  $('.editArticle').on('click', function() {
    var $tr = $(this).closest('tr');
    console.log($tr.attr('data-id'));
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3002/article/' + $tr.attr('data-id'),
      success: function(article) {
        console.log("success addArticleDetail");
        addArticleDetail(article);
      },
      error: function() {
        renderErrorTableHTML();
      }
    });

  });




});
