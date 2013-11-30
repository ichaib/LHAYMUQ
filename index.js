/**
 * Module dependencies.
 */


var express = require('express');
var parse = require('./parse.js');
var obpdata = require('./obpdata.js');


obpdata.loadObpData();

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
  //TODO: log query string  
  json = parse.parse(query);
  res.send(json);
});

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

var port = process.env.PORT || 3000;
app.listen(port);

console.log('app listening on port 3000');

