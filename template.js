const header = document.querySelector('#header'),
    footer = document.querySelector('#footer');

document.addEventListener('DOMContentLoaded', loadDoc);

function loadDoc() {
    var xhttp = new XMLHttpRequest();
      xhttp.open("GET", "template/header.html", true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        header.innerHTML =
        this.responseText;
      }
    };

    var xhttp = new XMLHttpRequest();
      xhttp.open("GET", "template/footer.html", true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        footer.innerHTML =
        this.responseText;
      }
    };
  
  }