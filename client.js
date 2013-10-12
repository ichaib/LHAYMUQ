var search = document.querySelector('[type=search]');
var searchImage = document.getElementById('search-button');
var code = document.querySelector('pre');


function sendSearchRequest() {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', '/search/' + search.value, true);
  xhr.onreadystatechange = function(){
    if (4 == xhr.readyState) {
      code.textContent = xhr.responseText;
    }
  };
  xhr.send();
}

search.addEventListener('keyup', function(event){
  if (event.keyCode == 13) {
    sendSearchRequest();
  }
}, false);

searchImage.addEventListener('click', function(event){
  sendSearchRequest(); 
});
