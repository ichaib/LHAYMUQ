/**
 * Module dependencies.
 */

var express = require('express');

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname);

/**
 * GET the search page.
 */

app.get('/', function(req, res){
  res.render('search');
});

/**
 * GET search for :query.
 */

app.get('/search/:query?', function(req, res){
  var query = req.params.query;
  json = parse(query);
  res.send(json);
});

function parse(query)
{
    summary = "sum1";
    array = ["item1", "item2"];
    json = JSON.stringify({ summary: summary, transactions: array});
    return json;
}

/**
 * GET client javascript. Here we use sendfile()
 * because serving __dirname with the static() middleware
 * would also mean serving our server "index.js" and the "search.jade"
 * template.
 */

app.get('/client.js', function(req, res){
  res.sendfile(__dirname + '/client.js');
});

app.use(express.static(__dirname + '/public'));

app.listen(3000);
console.log('app listening on port 3000');

