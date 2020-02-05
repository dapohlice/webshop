// Set Name of Dropdown-Button's
$(".dropdown-menu li a").click(function(){
  $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
});

// function setStatusOnButton() {
//
//   switch(currentStatus) {
//     case 0:
//       $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
//       $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
//       break;
//     case 1:
//       $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
//       $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
//       break;
//     case 2:
//       $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
//       $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
//       break;
//     case 3:
//       $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
//       $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
//       break;
//     default:
//       $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
//       $(this).parents(".dropdown").find('.btn').val($(this).data('value'));
//   }
// }
