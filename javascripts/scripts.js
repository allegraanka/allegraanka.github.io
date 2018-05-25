var prevScrollPosition = window.pageYOffset;
window.onscroll = function() {
  var currentScrollPosition = window.pageYOffset;
  if (prevScrollPosition > currentScrollPosition) {
    document.getElementById("navbar").style.top = "0";
  } else {
    document.getElementById("navbar").style.top = "-100px";
  }
  prevScrollPosition = currentScrollPosition;
}
