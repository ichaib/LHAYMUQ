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
  res.send("hello world");
  //db.smembers(query, function(err, vals){
    //if (err) return res.send(500);
    //res.send(vals);
  //});
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

app.listen(3000);
console.log('app listening on port 3000');

