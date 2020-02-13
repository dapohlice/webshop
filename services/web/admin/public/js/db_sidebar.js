// Funktion öffnet die Sidebar 250 px nach rechts
function openNav() {
  document.getElementById("mySidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  $('.openbtn').css("display","none");
}
// Funktiomn schließt die Sidebar auf eine Größe von 0
function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft= "0";
  $('.openbtn').css("display","block");
}

function hideNavs(header, navs) {
  var x = document.getElementsByClassName(navs);
  var y = document.getElementById(header);
  console.log(x);
  for (var i = 0; i < x.length; i++) {
    if (x[i].style.display === "none") {
      x[i].style.display = "block";
    } else {
      x[i].style.display = "none";
    }
  }
  if ($( y ).hasClass('fa-caret-down')) {
    $( y ).removeClass("fa-caret-down");
    $( y ).addClass("fa-caret-right");
    console.log(y);
  } else {
    $( y ).removeClass("fa-caret-right");
    $( y ).addClass("fa-caret-down");
    console.log(y);
  }
}
