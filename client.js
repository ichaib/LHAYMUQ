var search = document.querySelector('[type=search]');
var searchImage = document.getElementById('search-button');
var summary = document.getElementById('answer-summary');
var transactions = document.getElementById('answer-transactions');


function displaySearchResult(response) {
  summary.textContent = response.summary;
  summary.style.visibility = "visible";
  
  for(var i = 0; i < response.transactions.length; i++) {
    var t = response.transactions[i];
    var row = transactions.insertRow(-1);
    var date = row.insertCell(0);
    
    var d = moment(t.date);
    
    date.innerHTML = d.format("DD MMM YYYY");
    var amount = row.insertCell(1);
    amount.innerHTML = t.amount;
    var otherParty = row.insertCell(2);
    otherParty.innerHTML = t.otherParty;
  }
  
  transactions.style.visibility = "visible";
}

function sendSearchRequest() {
  var xhr = new XMLHttpRequest;
  xhr.open('GET', '/search/' + search.value, true);
  xhr.onreadystatechange = function(){
    if (4 == xhr.readyState) {
      displaySearchResult(JSON.parse(xhr.responseText));
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
