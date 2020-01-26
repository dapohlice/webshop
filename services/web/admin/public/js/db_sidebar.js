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
